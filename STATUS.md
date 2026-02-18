# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-18

## Zuletzt erledigt (diese Session)

- **PR-013**: System-Prompt komplett überarbeitet — neuer didaktischer Rollen-Prompt als System-Message, Basis-Instruktionen für Inhaltserhaltung (Kohärenz, Fliesstextcharakter, keine Informationskürzung), Glossar-Feature (schwierige Begriffe werden inline + in Glossar am Textende erklärt), max_tokens auf 4096 erhöht
- **Git Remote-URL** korrigiert: `Ceccaroni/textknacker` (Gross-/Kleinschreibung)

## Deployment

Änderungen auf GitHub gepusht (`2073f1c`). GitHub Actions deployt automatisch auf Firebase (~5 Min).

## Erledigte Tickets

- [x] PR-001: "Read" Label Alignment
- [x] PR-002: Button umbenennen
- [x] PR-003: Banner volle Breite
- [x] PR-004: Panel-Höhe angleichen
- [x] PR-005: Sprachniveau Segmented Control
- [x] PR-010: Header-Text anpassen
- [x] PR-011: Bildbeschreibung bei textlosen Fotos deaktivieren
- [x] PR-013: System-Prompt für Textvereinfachung überarbeiten
- [x] PR-014: Markdown-Rendering in Textausgabe

## Offene Tickets

- [ ] **PR-006**: PDF-Export verbessern ⚡
- [ ] **PR-007**: Zusätzliche Export-Formate (DOCX, MD, TXT) 💤
- [ ] **PR-008**: Open Dyslexic Schriftoption 💤
- [ ] **PR-009**: Bildbearbeitung vor Analyse (Crop, Helligkeit, Kontrast) ⚡
- [ ] **PR-012**: iOS – Buttons auf Textrahmenbreite ausrichten ⚡

## Nächste Schritte

1. **PR-006** — PDF-Export: Logo, A4-Format, Markdown-Rendering
2. **PR-012** — iOS Button-Alignment (kleiner Fix)
3. **PR-009** — Bildbearbeitung (Crop, Helligkeit, Kontrast) — grösseres Feature
4. Danach PR-007 (Export-Formate) und PR-008 (Open Dyslexic)

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
