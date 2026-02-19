// ── Types ────────────────────────────────────────────────────────

export type StyledSegment = { text: string; bold: boolean; italic: boolean };

export type TextBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; sentences: string[] }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'separator' };

// ── Inline Markdown Parser ───────────────────────────────────────

export function parseInlineSegments(text: string): StyledSegment[] {
  const segments: StyledSegment[] = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bold: false, italic: false });
    }
    if (match[2]) segments.push({ text: match[2], bold: true, italic: true });
    else if (match[3]) segments.push({ text: match[3], bold: true, italic: false });
    else if (match[4]) segments.push({ text: match[4], bold: false, italic: true });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bold: false, italic: false });
  }
  return segments.length > 0 ? segments : [{ text, bold: false, italic: false }];
}

// ── Block Parser ─────────────────────────────────────────────────

function parseHeading(line: string): string | null {
  const md = line.match(/^#{1,3}\s+(.+)$/);
  if (md) return md[1];
  const bold = line.match(/^\*\*(.+)\*\*$/);
  if (bold) return bold[1];
  return null;
}

export function parseTextBlocks(rawText: string): TextBlock[] {
  if (!rawText) return [];
  const normalized = rawText.replace(/\r\n/g, '\n');
  return normalized.split(/\n\n+/).filter(b => b.trim()).map(block => {
    const trimmed = block.trim();
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) return { type: 'separator' } as TextBlock;
    const heading = parseHeading(trimmed);
    if (heading) return { type: 'heading', text: heading };
    const lines = trimmed.split('\n');
    const isUnordered = lines.every(l => /^[-*]\s+/.test(l.trim()));
    const isOrdered = lines.every(l => /^\d+[.)]\s+/.test(l.trim()));
    if (isUnordered) return { type: 'list', ordered: false, items: lines.map(l => l.trim().replace(/^[-*]\s+/, '')) };
    if (isOrdered) return { type: 'list', ordered: true, items: lines.map(l => l.trim().replace(/^\d+[.)]\s+/, '')) };
    const sentences = trimmed.match(/[^.!?]*[.!?]+[\s]?|[^.!?]+$/g)?.filter(s => s.trim()) || [trimmed];
    return { type: 'paragraph', sentences };
  });
}

// ── Markdown Stripper (for TXT export) ───────────────────────────

export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,3}\s+/gm, '')            // heading markers
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')    // bold-italic
    .replace(/\*\*(.+?)\*\*/g, '$1')        // bold
    .replace(/\*(.+?)\*/g, '$1')            // italic
    .replace(/^(\*{3,}|-{3,}|_{3,})$/gm, '---') // normalize separators
    .trim();
}
