# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-19

## Zuletzt erledigt (diese Session)

- **PR-012**: iOS Button-Alignment gefixt — Button-Container von `flex` auf `grid grid-cols-4` umgestellt, `min-w-0` auf Buttons für korrekte Breitenberechnung (überschreibt shadcn `shrink-0`/`whitespace-nowrap`)
- **PR-006 (WIP, zurückgestellt)**: PDF-Export überarbeitet — neue Hilfsfunktionen (`parseInlineSegments`, `svgToPngDataUrl`, `renderStyledText`, `checkPageBreak`), Markdown-Rendering (Headings, Listen, Bold/Italic), Logo-Einbettung via SVG→Canvas→PNG, Design-System-Farben, Seitenzahlen. **Funktioniert aber noch nicht korrekt** (Logo erscheint nicht, Markdown-Zeichen werden roh ausgegeben). Braucht lokales Debugging mit Browser-DevTools.
- **Separator-Support**: `***`/`---`/`___` werden jetzt als Trennlinien erkannt (neuer `separator`-Blocktyp) statt als roher Text — betrifft sowohl UI (`<hr>`) als auch PDF (feine Linie)
- **Zeilenenden-Normalisierung**: `\r\n` → `\n` im Block-Parser, falls Claude-API Windows-Zeilenenden liefert

## Deployment

Änderungen auf GitHub gepusht (`bc33397`). GitHub Actions deployt automatisch auf Firebase (~5 Min).

## Erledigte Tickets

- [x] PR-001: "Read" Label Alignment
- [x] PR-002: Button umbenennen
- [x] PR-003: Banner volle Breite
- [x] PR-004: Panel-Höhe angleichen
- [x] PR-005: Sprachniveau Segmented Control
- [x] PR-010: Header-Text anpassen
- [x] PR-011: Bildbeschreibung bei textlosen Fotos deaktivieren
- [x] PR-012: iOS – Buttons auf Textrahmenbreite ausrichten
- [x] PR-013: System-Prompt für Textvereinfachung überarbeiten
- [x] PR-014: Markdown-Rendering in Textausgabe

## Offene Tickets

- [ ] **PR-006**: PDF-Export verbessern ⚡ — Code ist da, aber Logo + Markdown-Rendering funktionieren nicht. Lokales Debugging nötig.
- [ ] **PR-007**: Zusätzliche Export-Formate (DOCX, MD, TXT) 💤
- [ ] **PR-008**: Open Dyslexic Schriftoption 💤
- [ ] **PR-009**: Bildbearbeitung vor Analyse (Crop, Helligkeit, Kontrast) ⚡

## Nächste Schritte

1. **PR-006** — PDF-Export debuggen (lokal mit DevTools: Logo-Konvertierung prüfen, textBlocks-Inhalt loggen, Rendering-Pipeline testen)
2. **PR-009** — Bildbearbeitung (Crop, Helligkeit, Kontrast) — grösseres Feature
3. Danach PR-007 (Export-Formate) und PR-008 (Open Dyslexic)

## Bekannte technische Schulden

1. **Zod** nicht explizit in package.json (nur transitiv)
2. **Ungenutzte Dependencies**: genkit, @google-cloud/vertexai, @google/generative-ai
3. **GitHub Actions** referenziert GEMINI_API_KEY statt ANTHROPIC_API_KEY
4. **GEMINI.md** kann gelöscht werden

## Wichtige Dateien

- `src/app/page.tsx` — Gesamte App-Logik (Desktop: Side-by-Side, Mobile: View-Switching)
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
