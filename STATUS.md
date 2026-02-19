# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-19

## Zuletzt erledigt (diese Session)

- **PR-009**: Bildbearbeitung vor Analyse (Crop, Helligkeit, Kontrast)
  - Neuer ImageEditor-Zwischenschritt nach Foto-Aufnahme/Bild-Upload, vor OCR
  - Crop: Frei ziehbare Rechteck-Auswahl via `react-image-crop`
  - Helligkeit/Kontrast: Slider (50–150%), Live-Vorschau via CSS-Filter
  - Canvas-Verarbeitung bei Bestätigung (Crop + Filter → base64 JPEG)
  - Kamera-Stream wird gestoppt wenn Editor offen
  - Neue Dateien: `src/components/image-editor.tsx`, `src/components/ui/slider.tsx`
  - Neue Dependency: `react-image-crop`
  - CSS-Overrides für Crop-Border in Pharos Blue

## Deployment

Änderungen commited, noch nicht gepusht. Nach Push deployt GitHub Actions automatisch auf Firebase (~5 Min).

## Erledigte Tickets

- [x] PR-001: "Read" Label Alignment
- [x] PR-002: Button umbenennen
- [x] PR-003: Banner volle Breite
- [x] PR-004: Panel-Höhe angleichen
- [x] PR-005: Sprachniveau Segmented Control
- [x] PR-006: PDF-Export verbessern (Logo + Markdown)
- [x] PR-007: Export-Formate (DOCX, MD, TXT)
- [x] PR-009: Bildbearbeitung vor Analyse (Crop, Helligkeit, Kontrast)
- [x] PR-010: Header-Text anpassen
- [x] PR-011: Bildbeschreibung bei textlosen Fotos deaktivieren
- [x] PR-012: iOS – Buttons auf Textrahmenbreite ausrichten
- [x] PR-013: System-Prompt für Textvereinfachung überarbeiten
- [x] PR-014: Markdown-Rendering in Textausgabe
- [x] PR-015: Footer mit Copyright, Impressum und Datenschutz

## Offene Tickets

- [ ] **PR-008**: Open Dyslexic Schriftoption 💤

## Nächste Schritte

1. **PR-008** — Open Dyslexic Schriftoption

## Bekannte technische Schulden

1. **Zod** nicht explizit in package.json (nur transitiv)
2. **Ungenutzte Dependencies**: genkit, @google-cloud/vertexai, @google/generative-ai
3. **GitHub Actions** referenziert GEMINI_API_KEY statt ANTHROPIC_API_KEY
4. **GEMINI.md** kann gelöscht werden

## Wichtige Dateien

- `src/app/page.tsx` — Gesamte App-Logik (Desktop: Side-by-Side, Mobile: View-Switching)
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API)
- `src/components/image-editor.tsx` — Bildbearbeitung (Crop, Helligkeit, Kontrast) vor OCR
- `src/lib/text-parser.ts` — Shared Parsing-Logik (TextBlock, parseTextBlocks, parseInlineSegments, stripMarkdown)
- `src/lib/export.ts` — Alle Export-Funktionen (PDF, DOCX, MD, TXT)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
