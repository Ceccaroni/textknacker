# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-18

## Zuletzt erledigt (diese Session)

- **Desktop Side-by-Side Layout**: Eingabe links, Ergebnis rechts (Mobile unverändert)
- **Ticket-System** eingerichtet (`docs/tickets/`), 8 Tickets importiert, Regeln in CLAUDE.md
- **PR-001**: "Read" Label vertikal an Logo-Textbaseline ausgerichtet
- **PR-002**: Button "Text knacken" → "Vereinfachen", Icon entfernt
- **PR-003**: Desktop-Banner edge-to-edge (volle Breite)
- **PR-004**: Panel-Höhen auf Desktop angeglichen
- **Desktop-Ergebnisfeld**: Rahmen passend zum Textarea, Toolbar aufgeteilt (Sprachniveau oben, Aktionen unten)
- **Tab-Ausrichtung**: Kamera/Text-Tabs vom Banner gelöst, am Textfeldrand ausgerichtet
- **Texte aktualisiert**: Tagline → "Gib mir einen Text – ich kümmere mich um den Rest.", Placeholder → "Hier Text reinkopieren oder Datei reinziehen."
- **Session-Abschluss-Regeln** in CLAUDE.md dokumentiert

## Deployment

Alle Änderungen auf GitHub gepusht und via GitHub Actions auf Firebase deployed. Letzter Commit: `886f0f8`. Firebase Deploys laufen durch, brauchen aber ~5 Min.

## Erledigte Tickets

- [x] PR-001: "Read" Label Alignment
- [x] PR-002: Button umbenennen
- [x] PR-003: Banner volle Breite
- [x] PR-004: Panel-Höhe angleichen

## Offene Tickets

- [ ] **PR-005**: Funktionsleiste (Sprachniveaus) Redesign ⚡
- [ ] **PR-006**: PDF-Export verbessern ⚡
- [ ] **PR-007**: Zusätzliche Export-Formate (DOCX, MD, TXT) 💤
- [ ] **PR-008**: Open Dyslexic Schriftoption 💤

## Nächste Schritte

1. **PR-005** — Toolbar-Redesign: Designvorschläge erarbeiten (Desktop + Mobile)
2. **PR-006** — PDF-Export: Logo, A4-Format, Markdown-Rendering fixen
3. Danach PR-007 (Export-Formate) und PR-008 (Open Dyslexic)

## Bekannte technische Schulden

1. **Zod** nicht explizit in package.json (nur transitiv)
2. **Ungenutzte Dependencies**: genkit, @google-cloud/vertexai, @google/generative-ai
3. **GitHub Actions** referenziert GEMINI_API_KEY statt ANTHROPIC_API_KEY
4. **GEMINI.md** kann gelöscht werden
5. **GitHub Remote-URL** veraltet — GitHub meldet Repo-Umzug nach `Ceccaroni/textknacker`

## Wichtige Dateien

- `src/app/page.tsx` — Gesamte App-Logik (Desktop: Side-by-Side, Mobile: View-Switching)
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
