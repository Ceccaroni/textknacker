# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-18

## Zuletzt erledigt (diese Session)

- **T-02**: Spracherkennung — Ausgabe immer in Eingabesprache
- **T-03**: Regelwerk Einfache/Leichte Sprache in Prompts eingebettet
- **T-04**: Toggle Einfach/Leicht ersetzt alten Text/Liste-Switch, Listenmodus entfernt
- **T-05**: PHORO Design System als `DESIGN-SYSTEM.md` abgelegt, alle Farben auf PHORO-Branding umgestellt (globals.css + page.tsx)
- **Schweizer Rechtschreibung** (ss statt ß) in beiden Simplify-Prompts erzwungen
- **Default-Tab** auf Text (statt Kamera) geändert
- **Branding**: "read" in Morgenrot-Akzentfarbe neben PHORO-Logo (beide Headers)

## Deployment-Hinweis

Die letzten Änderungen (ab Commit `33762b2`) sind auf GitHub gepusht, aber **nicht in Firebase deployed**. GitHub Actions Deploy für T-02 (`8655bcf`) schlug fehl; nachfolgende Deploys liefen durch, aber der letzte Commit (`0eb47f7`) muss noch verifiziert werden.

**Aktion nötig:** Firebase-Deployment prüfen bzw. manuell deployen (`firebase deploy`).

## Erledigte Tasks

- [x] T-01: Responsive Fullscreen-Layout
- [x] T-02: Ausgabe in Eingabesprache + CH-Rechtschreibung
- [x] T-03: Einfache vs. Leichte Sprache Regelwerk
- [x] T-04: Umschalter Einfache/Leichte Sprache
- [x] T-05: Farbgestaltung PHORO-Branding + Design-System im Repo
- [x] T-08: Name "Textknacker" entfernt
- [x] T-10: Lexend konsequent durchgesetzt
- [x] T-11: Textausgabe-Formatierung

## Offene Tasks

- [ ] **T-06**: Datei-Upload (Word, PDF+OCR, ODT, TXT, MD)
- [ ] **T-07**: Download-Optionen (Word, PDF, TXT, MD)
- [ ] **T-09**: Fotomodus Vollbild + Crop + Helligkeit/Kontrast

## Bekannte technische Schulden

1. **Zod** nicht explizit in package.json (nur transitiv)
2. **Ungenutzte Dependencies**: genkit, @google-cloud/vertexai, @google/generative-ai
3. **GitHub Actions** referenziert GEMINI_API_KEY statt ANTHROPIC_API_KEY
4. **GEMINI.md** kann gelöscht werden

## Wichtige Dateien

- `src/app/page.tsx` — Gesamte App-Logik (Input + Reading Mode)
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `DESIGN-SYSTEM.md` — Verbindliches Design-System (Farben, Typo, Spacing, Anti-Patterns)
- `TASKS.md` — Alle Tasks mit Status
- `CLAUDE.md` — Architektur-Referenz
