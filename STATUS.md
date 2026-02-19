# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-19

## Zuletzt bearbeitet (diese Session)

- **PR-009**: Bildbearbeitung vor Analyse — **erledigt** ✅
  - **Eigentliche Ursache des OCR-Fehlers:** Hardcoded `media_type: "image/jpeg"` in `actions.ts`, aber das tatsächliche Bildformat stimmte nicht überein (Anthropic API: "Image does not match the provided media type image/jpeg")
  - **Fix 1 (Hauptfix):** `actions.ts` — `detectMediaType()` erkennt Format aus base64 Magic Bytes statt hardcoded `image/jpeg`
  - **Fix 2:** `image-editor.tsx` — Prüft `image.complete` vor Canvas-Zugriff, verifiziert JPEG-Output nach `toDataURL()`, zeigt Fehlermeldung bei Konvertierungsproblemen
  - **Fix 3:** `next.config.ts` — `experimental.serverActions.bodySizeLimit: '10mb'` (präventiv, Default war 1 MB)
  - **Fix 4:** `image-editor.tsx` — Bild-Downscaling auf max 2048px + JPEG-Qualität 0.85 (Bandbreite)
  - **Diagnose-Verbesserung:** Catch-Block in `runOCR()` gibt jetzt echte Fehlermeldung zurück statt generischem String
- **CLAUDE.md**: Regressionsschutz-Regeln hinzugefügt

## Nächste Schritte (Priorität)

1. **PR-009 auf iPhone verifizieren** — Deploy abwarten, Kamera-Foto testen
2. **PR-008** — Open Dyslexic Schriftoption (niedrige Prio)

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
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API), media_type-Erkennung via Magic Bytes
- `src/components/image-editor.tsx` — Bildbearbeitung (Crop, Helligkeit, Kontrast) vor OCR, JPEG-Verifikation
- `src/lib/text-parser.ts` — Shared Parsing-Logik (TextBlock, parseTextBlocks, parseInlineSegments, stripMarkdown)
- `src/lib/export.ts` — Alle Export-Funktionen (PDF, DOCX, MD, TXT)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `next.config.ts` — Server Actions Body-Size-Limit (10mb)
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
