# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-19

## Zuletzt bearbeitet (diese Session)

- **PR-009**: Bildbearbeitung vor Analyse — **erledigt** ✅
  - **Ursache des OCR-Fehlers:** Next.js Server Action Body-Size-Limit (Default 1 MB) — iPhone-Fotos als base64 waren 3–7 MB
  - **Fix 1:** `experimental.serverActions.bodySizeLimit: '10mb'` in `next.config.ts`
  - **Fix 2:** Bild-Downscaling auf max 2048px + JPEG-Qualität 0.85 vor Senden (~200–500 KB)

## Nächste Schritte (Priorität)

1. **PR-008** — Open Dyslexic Schriftoption (niedrige Prio)

## Deployment

Alle Änderungen gepusht. GitHub Actions deployt automatisch auf Firebase (~5 Min).

## Erledigte Tickets

- [x] PR-001: "Read" Label Alignment
- [x] PR-002: Button umbenennen
- [x] PR-003: Banner volle Breite
- [x] PR-004: Panel-Höhe angleichen
- [x] PR-005: Sprachniveau Segmented Control
- [x] PR-006: PDF-Export verbessern (Logo + Markdown)
- [x] PR-007: Export-Formate (DOCX, MD, TXT)
- [x] PR-009: Bildbearbeitung vor Analyse (Crop, Helligkeit, Kontrast, OCR-Fix)
- [x] PR-010: Header-Text anpassen
- [x] PR-011: Bildbeschreibung bei textlosen Fotos deaktivieren
- [x] PR-012: iOS – Buttons auf Textrahmenbreite ausrichten
- [x] PR-013: System-Prompt für Textvereinfachung überarbeiten
- [x] PR-014: Markdown-Rendering in Textausgabe
- [x] PR-015: Footer mit Copyright, Impressum und Datenschutz

## Offene / In Arbeit

- [ ] **PR-008**: Open Dyslexic Schriftoption 💤

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
- `next.config.ts` — Server Actions Body-Size-Limit (10mb)
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
