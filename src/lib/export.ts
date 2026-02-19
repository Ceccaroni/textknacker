import { parseInlineSegments, stripMarkdown, type TextBlock, type StyledSegment } from './text-parser';

// ── Types ────────────────────────────────────────────────────────

export type ExportParams = {
  textBlocks: TextBlock[];
  currentText: string;
  readingMode: 'einfach' | 'leicht';
};

// ── Helpers ──────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function svgToPngDataUrl(svgUrl: string, pixelWidth: number, pixelHeight: number): Promise<string> {
  const response = await fetch(svgUrl);
  let svgText = await response.text();
  svgText = svgText.replace('<svg ', `<svg width="${pixelWidth}" height="${pixelHeight}" `);
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, pixelWidth, pixelHeight);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG conversion failed')); };
    img.src = url;
  });
}

function modeLabel(readingMode: 'einfach' | 'leicht'): string {
  return readingMode === 'einfach' ? 'Einfache Sprache' : 'Leichte Sprache';
}

// ── PDF Export ───────────────────────────────────────────────────

export async function exportPdf({ textBlocks, readingMode }: ExportParams): Promise<void> {
  const jsPDFModule = await import('jspdf');
  const doc = new jsPDFModule.default({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PW = 210, PH = 297;
  const ML = 20, MR = 20, MT = 20, MB = 20;
  const CW = PW - ML - MR;
  const BLUE = { r: 26, g: 53, b: 80 };
  const SLATE = { r: 61, g: 64, b: 91 };
  const H_SIZE = 14, B_SIZE = 11, M_SIZE = 9;
  const LH = 1.5;
  const LIST_INDENT = 8;

  function fontStyle(bold: boolean, italic: boolean): string {
    if (bold && italic) return 'bolditalic';
    if (bold) return 'bold';
    if (italic) return 'italic';
    return 'normal';
  }

  function lineH(fontSize: number): number {
    return fontSize * LH * 0.3528;
  }

  function checkPageBreak(y: number, needed: number): number {
    if (y + needed > PH - MB) { doc.addPage(); return MT; }
    return y;
  }

  function renderStyledText(
    segments: StyledSegment[], startX: number, startY: number,
    maxWidth: number, fontSize: number, color: { r: number; g: number; b: number }
  ): number {
    doc.setFontSize(fontSize);
    doc.setTextColor(color.r, color.g, color.b);
    const lh = lineH(fontSize);
    let cx = startX, cy = startY;

    for (const seg of segments) {
      doc.setFont('Helvetica', fontStyle(seg.bold, seg.italic));
      const words = seg.text.split(/(\s+)/);
      for (const word of words) {
        if (!word) continue;
        const w = doc.getTextWidth(word);
        if (cx > startX && cx + w > startX + maxWidth) {
          cx = startX;
          cy += lh;
          cy = checkPageBreak(cy, lh);
        }
        if (word.trim()) {
          doc.text(word, cx, cy);
        }
        cx += w;
      }
    }
    return cy + lh;
  }

  let y = MT;

  // Logo (top-right)
  try {
    const logoPng = await svgToPngDataUrl('/logo-phoro.svg', 400, 137);
    const logoW = 35, logoH = logoW / (192 / 66);
    doc.addImage(logoPng, 'PNG', PW - MR - logoW, MT, logoW, logoH);
  } catch { /* graceful degradation */ }

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(BLUE.r, BLUE.g, BLUE.b);
  doc.text('PHORO Read', ML, y + 7);

  // Subtitle
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(M_SIZE);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.text(modeLabel(readingMode), ML, y + 13);

  // Separator
  y += 18;
  doc.setDrawColor(BLUE.r, BLUE.g, BLUE.b);
  doc.setLineWidth(0.4);
  doc.line(ML, y, PW - MR, y);
  y += 6;

  // Content blocks
  for (const block of textBlocks) {
    if (block.type === 'separator') {
      y = checkPageBreak(y, 6);
      y += 2;
      doc.setDrawColor(SLATE.r, SLATE.g, SLATE.b);
      doc.setLineWidth(0.2);
      doc.line(ML + 20, y, PW - MR - 20, y);
      y += 4;
      continue;
    }
    if (block.type === 'heading') {
      y = checkPageBreak(y, lineH(H_SIZE) + 6);
      y += 3;
      const segs = parseInlineSegments(block.text).map(s => ({ ...s, bold: true }));
      doc.setTextColor(BLUE.r, BLUE.g, BLUE.b);
      y = renderStyledText(segs, ML, y, CW, H_SIZE, BLUE);
      y += 1;
    } else if (block.type === 'list') {
      for (let i = 0; i < block.items.length; i++) {
        y = checkPageBreak(y, lineH(B_SIZE));
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(B_SIZE);
        doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
        const prefix = block.ordered ? `${i + 1}.` : '\u2022';
        doc.text(prefix, ML + 2, y);
        const segs = parseInlineSegments(block.items[i]);
        y = renderStyledText(segs, ML + LIST_INDENT, y, CW - LIST_INDENT, B_SIZE, SLATE);
      }
      y += 2;
    } else if (block.type === 'paragraph') {
      const fullText = block.sentences.join('');
      const segs = parseInlineSegments(fullText);
      y = checkPageBreak(y, lineH(B_SIZE));
      y = renderStyledText(segs, ML, y, CW, B_SIZE, SLATE);
      y += 2;
    }
  }

  // Page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${i} / ${totalPages}`, PW / 2, PH - 10, { align: 'center' });
  }

  doc.save('phoro-read.pdf');
}

// ── DOCX Export ──────────────────────────────────────────────────

export async function exportDocx({ textBlocks, readingMode }: ExportParams): Promise<void> {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun,
    AlignmentType, BorderStyle, LevelFormat,
  } = await import('docx');

  // Logo
  let logoImageData: Uint8Array | null = null;
  try {
    const logoPngDataUrl = await svgToPngDataUrl('/logo-phoro.svg', 400, 137);
    const response = await fetch(logoPngDataUrl);
    logoImageData = new Uint8Array(await response.arrayBuffer());
  } catch { /* graceful degradation */ }

  const children: InstanceType<typeof Paragraph>[] = [];

  // Logo (right-aligned)
  if (logoImageData) {
    children.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new ImageRun({
        data: logoImageData,
        transformation: { width: 140, height: 48 },
        type: 'png',
      })],
    }));
  }

  // Title
  children.push(new Paragraph({
    children: [new TextRun({
      text: 'PHORO Read',
      bold: true,
      size: 40,
      color: '1A3550',
      font: 'Calibri',
    })],
  }));

  // Subtitle
  children.push(new Paragraph({
    children: [new TextRun({
      text: modeLabel(readingMode),
      size: 18,
      color: '3D405B',
      font: 'Calibri',
    })],
    spacing: { after: 200 },
  }));

  // Separator
  children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1A3550' } },
    spacing: { after: 240 },
  }));

  // Content blocks
  for (const block of textBlocks) {
    if (block.type === 'separator') {
      children.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '3D405B' } },
        spacing: { before: 100, after: 100 },
      }));
    } else if (block.type === 'heading') {
      const segments = parseInlineSegments(block.text);
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: segments.map(s => new TextRun({
          text: s.text,
          bold: true,
          italics: s.italic,
          size: 28,
          color: '1A3550',
          font: 'Calibri',
        })),
        spacing: { before: 240, after: 120 },
      }));
    } else if (block.type === 'list') {
      for (let i = 0; i < block.items.length; i++) {
        const segments = parseInlineSegments(block.items[i]);
        children.push(new Paragraph({
          bullet: block.ordered ? undefined : { level: 0 },
          numbering: block.ordered ? { reference: 'default-numbering', level: 0 } : undefined,
          children: segments.map(s => new TextRun({
            text: s.text,
            bold: s.bold,
            italics: s.italic,
            size: 22,
            color: '3D405B',
            font: 'Calibri',
          })),
        }));
      }
    } else if (block.type === 'paragraph') {
      const fullText = block.sentences.join('');
      const segments = parseInlineSegments(fullText);
      children.push(new Paragraph({
        children: segments.map(s => new TextRun({
          text: s.text,
          bold: s.bold,
          italics: s.italic,
          size: 22,
          color: '3D405B',
          font: 'Calibri',
        })),
        spacing: { after: 200 },
      }));
    }
  }

  const docx = new Document({
    numbering: {
      config: [{
        reference: 'default-numbering',
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.START,
        }],
      }],
    },
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(docx);
  downloadBlob(blob, 'phoro-read.docx');
}

// ── Markdown Export ──────────────────────────────────────────────

export function exportMarkdown({ currentText, readingMode }: ExportParams): void {
  const content = `# PHORO Read\n*${modeLabel(readingMode)}*\n\n---\n\n${currentText}`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, 'phoro-read.md');
}

// ── Plain Text Export ────────────────────────────────────────────

export function exportPlainText({ currentText, readingMode }: ExportParams): void {
  const strippedText = stripMarkdown(currentText);
  const content = `PHORO Read\n${modeLabel(readingMode)}\n\n${strippedText}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, 'phoro-read.txt');
}
