# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-19

## Zuletzt bearbeitet (diese Session)

- **PR-009**: Bildbearbeitung vor Analyse — **teilweise implementiert**
  - **Funktioniert:** ImageEditor-UI (Crop, Helligkeit, Kontrast, Live-Vorschau, Fehleranzeige, Loading-State)
  - **Blockiert:** OCR-Übermittlung nach "Übernehmen" — bearbeitetes Bild kommt nicht bei der Claude API an
  - Mehrere Ansätze getestet (programmatischer Dispatch, direkter Server-Action-Aufruf, Hidden Form) — alle scheitern mit "Server error: Failed to connect to Claude API"
  - Textvereinfachung funktioniert → API-Key ist OK → Problem liegt bei der Bild-Übermittlung via Server Action
  - **Vermutung:** Next.js Server Action Body-Size-Limit (Standard 1 MB) oder FormData-Serialisierung bei grossen base64-Bildern
  - Neue Dateien: `src/components/image-editor.tsx`, `src/components/ui/slider.tsx`
  - Neue Dependency: `react-image-crop`

## Nächste Schritte (Priorität)

1. **PR-009 fertigstellen** — OCR-Submission fixen:
   - `serverActions.bodySizeLimit` in next.config erhöhen (z.B. `'5mb'`)
   - Falls das nicht reicht: Bild vor Übermittlung herunterskalieren oder chunken
   - Server-Logs auf Firebase prüfen für den tatsächlichen Fehler
2. **PR-008** — Open Dyslexic Schriftoption

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
- [x] PR-010: Header-Text anpassen
- [x] PR-011: Bildbeschreibung bei textlosen Fotos deaktivieren
- [x] PR-012: iOS – Buttons auf Textrahmenbreite ausrichten
- [x] PR-013: System-Prompt für Textvereinfachung überarbeiten
- [x] PR-014: Markdown-Rendering in Textausgabe
- [x] PR-015: Footer mit Copyright, Impressum und Datenschutz

## Offene / In Arbeit

- [ ] **PR-009**: Bildbearbeitung vor Analyse 🟡 (UI fertig, OCR-Submission blockiert)
- [ ] **PR-008**: Open Dyslexic Schriftoption 💤

## Bekannte technische Schulden

1. **Zod** nicht explizit in package.json (nur transitiv)
2. **Ungenutzte Dependencies**: genkit, @google-cloud/vertexai, @google/generative-ai
3. **GitHub Actions** referenziert GEMINI_API_KEY statt ANTHROPIC_API_KEY
4. **GEMINI.md** kann gelöscht werden
5. **Next.js Server Action Body-Size-Limit** prüfen — möglicherweise Ursache für OCR-Fehler bei Bildern aus dem ImageEditor

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
