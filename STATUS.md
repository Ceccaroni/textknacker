# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-19

## Zuletzt erledigt (diese Session)

- **PR-007**: Export-Formate (DOCX, MD, TXT) implementiert
  - Neues Export-Dropdown ersetzt den alten PDF-Button: `[Vorlesen] [Fokus] [Abstand] [Export ▾]`
  - 4 Formate: PDF, Word (DOCX), Markdown, Text
  - Code-Refactoring: Export-Logik + Parsing aus `page.tsx` extrahiert (~200 Zeilen weniger)
  - Neue Dateien: `src/lib/text-parser.ts`, `src/lib/export.ts`
  - Neue Dependencies: `docx`, `@radix-ui/react-dropdown-menu`
  - `@types/jspdf` entfernt (veraltet, kollidierte mit jsPDF v4)
  - shadcn/ui `dropdown-menu` Komponente hinzugefügt

## Deployment

Noch nicht gepusht. Nach Commit + Push deployt GitHub Actions automatisch auf Firebase (~5 Min).

## Erledigte Tickets

- [x] PR-001: "Read" Label Alignment
- [x] PR-002: Button umbenennen
- [x] PR-003: Banner volle Breite
- [x] PR-004: Panel-Höhe angleichen
- [x] PR-005: Sprachniveau Segmented Control
- [x] PR-007: Export-Formate (DOCX, MD, TXT)
- [x] PR-010: Header-Text anpassen
- [x] PR-011: Bildbeschreibung bei textlosen Fotos deaktivieren
- [x] PR-012: iOS – Buttons auf Textrahmenbreite ausrichten
- [x] PR-013: System-Prompt für Textvereinfachung überarbeiten
- [x] PR-014: Markdown-Rendering in Textausgabe

## Offene Tickets

- [ ] **PR-006**: PDF-Export verbessern ⚡ — Code ist da, aber Logo + Markdown-Rendering funktionieren nicht. Lokales Debugging nötig.
- [ ] **PR-008**: Open Dyslexic Schriftoption 💤
- [ ] **PR-009**: Bildbearbeitung vor Analyse (Crop, Helligkeit, Kontrast) ⚡

## Nächste Schritte

1. **PR-006** — PDF-Export debuggen (lokal mit DevTools: Logo-Konvertierung prüfen, textBlocks-Inhalt loggen, Rendering-Pipeline testen)
2. **PR-009** — Bildbearbeitung (Crop, Helligkeit, Kontrast) — grösseres Feature
3. Danach PR-008 (Open Dyslexic)

## Bekannte technische Schulden

1. **Zod** nicht explizit in package.json (nur transitiv)
2. **Ungenutzte Dependencies**: genkit, @google-cloud/vertexai, @google/generative-ai
3. **GitHub Actions** referenziert GEMINI_API_KEY statt ANTHROPIC_API_KEY
4. **GEMINI.md** kann gelöscht werden

## Wichtige Dateien

- `src/app/page.tsx` — Gesamte App-Logik (Desktop: Side-by-Side, Mobile: View-Switching)
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API)
- `src/lib/text-parser.ts` — Shared Parsing-Logik (TextBlock, parseTextBlocks, parseInlineSegments, stripMarkdown)
- `src/lib/export.ts` — Alle Export-Funktionen (PDF, DOCX, MD, TXT)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
