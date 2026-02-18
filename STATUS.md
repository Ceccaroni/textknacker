# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-18

## Zuletzt erledigt (diese Session)

- **PR-005**: Sprachniveau-Leiste redesigned — Segmented Control mit Pharos Blue Active-State, Labels "Einfache Sprache" / "Leichte Sprache", Icons entfernt, Höhe exakt an linke Tabs angeglichen (h-9)
- **PR-010**: Header-Tagline geändert → "Gib mir einen Text – ich mache den Rest."
- **PR-011**: OCR-Prompt angepasst — textlose Bilder liefern "Kein Text im Bild erkannt." statt Bildbeschreibung
- **PR-014**: Markdown-Rendering in Textausgabe — inline **fett**, *kursiv*, ***fett+kursiv*** + Listen (ol/ul) werden jetzt korrekt gerendert, Fokus-Modus bleibt funktional
- **6 neue Tickets importiert** (PR-009 bis PR-014), Prioritäten gesetzt

## Deployment

Alle Änderungen auf GitHub gepusht und via GitHub Actions auf Firebase deployed. Letzter Commit: `2afbb6f`. Firebase Deploys laufen durch, brauchen aber ~5 Min.

## Erledigte Tickets

- [x] PR-001: "Read" Label Alignment
- [x] PR-002: Button umbenennen
- [x] PR-003: Banner volle Breite
- [x] PR-004: Panel-Höhe angleichen
- [x] PR-005: Sprachniveau Segmented Control
- [x] PR-010: Header-Text anpassen
- [x] PR-011: Bildbeschreibung bei textlosen Fotos deaktivieren
- [x] PR-014: Markdown-Rendering in Textausgabe

## Offene Tickets

- [ ] **PR-006**: PDF-Export verbessern ⚡
- [ ] **PR-007**: Zusätzliche Export-Formate (DOCX, MD, TXT) 💤
- [ ] **PR-008**: Open Dyslexic Schriftoption 💤
- [ ] **PR-009**: Bildbearbeitung vor Analyse (Crop, Helligkeit, Kontrast) ⚡
- [ ] **PR-012**: iOS – Buttons auf Textrahmenbreite ausrichten ⚡
- [ ] **PR-013**: System-Prompt für Textvereinfachung überarbeiten 🔥 (wartet auf User-Input)

## Nächste Schritte

1. **PR-013** — System-Prompt überarbeiten (wartet auf neuen Prompt vom User)
2. **PR-006** — PDF-Export: Logo, A4-Format, Markdown-Rendering
3. **PR-012** — iOS Button-Alignment (kleiner Fix)
4. **PR-009** — Bildbearbeitung (Crop, Helligkeit, Kontrast) — grösseres Feature
5. Danach PR-007 (Export-Formate) und PR-008 (Open Dyslexic)

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
