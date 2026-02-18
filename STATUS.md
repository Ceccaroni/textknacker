# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-18

## Zuletzt erledigt

- **Projekt umbenannt** von "Textknacker" zu "PHORO Read" (package.json, UI, Doku)
- **CLAUDE.md** erstellt (Architektur, Stack, Regeln, Doku-Strategie)
- **Logo + Favicon** eingebettet (logo-phoro.svg, icon.svg)
- **App komplett umgebaut** gemäss Blueprint:
  - State A (Input): Kamera-Tab + Text-Tab, deutsche UI
  - State B (Reading Mode): Vereinfachter Text mit Toolbar
  - Toolbar: Text/Liste-Switch (gecached), TTS, Fokus-Modus, Abstand, PDF-Export
- **Fullscreen-Layout** (h-dvh, flex, internes Scrolling, alle Geräte)
- **Lexend-Font** korrekt durchgesetzt (globals.css Fix)
- **Textausgabe-Formatierung**: Logo-Farbe #1c3d5a, Absätze, Überschriften-Erkennung

## Erledigte Tasks

- [x] T-01: Responsive Fullscreen-Layout
- [x] T-02: Ausgabe in Eingabesprache
- [x] T-03: Einfache vs. Leichte Sprache Regelwerk
- [x] T-04: Umschalter Einfache/Leichte Sprache
- [x] T-05: Farbgestaltung PHORO-Branding
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
- `src/app/globals.css` — Tailwind-Theme + Font-Mapping
- `TASKS.md` — Alle Tasks mit Status
- `CLAUDE.md` — Architektur-Referenz
