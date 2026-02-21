# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-21

## Zuletzt bearbeitet (diese Session)

- **PR-018**: Mehrsprachige Vereinfachung — ERLEDIGT ✅
  - Bug: Schweizer Rechtschreibung (`ss statt ß`) war generisch für alle Sprachen → drängte Claude Richtung Deutsch
  - 13 Regelwerke implementiert, User bestätigt: «funktioniert in allen Sprachen»
  - Ticket geschlossen und nach `completed/` verschoben
- **PR-019**: Vorlesefunktion auf OpenAI TTS umgestellt ✅
  - `src/app/api/tts/route.ts` NEU: API-Route (OpenAI TTS, tts-1, Stimme nova, mp3)
  - `src/app/page.tsx`: Web Speech API → Audio-Objekt mit echtem Pause/Resume
  - `src/lib/text-parser.ts`: `truncateAtSentenceBoundary()` für 4096-Zeichen-Limit
  - `firebase.json`: OPENAI_API_KEY zu secrets hinzugefügt
  - Fix: Build-Fehler (env-check von module-level zu runtime verschoben)
  - Fix: Audio-Cleanup bei neuem Text (altes Audio wird gestoppt/freigegeben)
  - Deployed und getestet: Arabisch ✅, Französisch ✅

## Nächste Schritte (Priorität)

1. **PR-019** — TTS weitere Sprachen testen (DE, IT, EN, Pause/Resume) (⚡ Mittel)
2. **PR-008** — Open Dyslexic Schriftoption (💤 Niedrig)

## Deployment

Alles committed und gepusht. GitHub Actions deployt automatisch auf Firebase.

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
- [x] PR-017: Bugfix – HEIC/JPEG Media-Type Mismatch bei Bild-Upload (iPhone)
- [x] PR-018: Vereinfachung ignoriert Quellsprache – 13 Sprachen implementiert

## Offene / In Arbeit

- [ ] **PR-019**: Vorlesefunktion auf OpenAI TTS umstellen (Implementation ✅, Testen läuft) 🔥
- [ ] **PR-008**: Open Dyslexic Schriftoption 💤

## Bekannte technische Schulden

1. **Zod** nicht explizit in package.json (nur transitiv)
2. **Ungenutzte Dependencies**: genkit, @google-cloud/vertexai, @google/generative-ai
3. **GitHub Actions** referenziert GEMINI_API_KEY statt ANTHROPIC_API_KEY
4. **GEMINI.md** kann gelöscht werden

## Wichtige Dateien

- `src/app/page.tsx` — Gesamte App-Logik (Desktop: Side-by-Side, Mobile: View-Switching)
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API), sprachspezifische Regeln, media_type-Erkennung via Magic Bytes
- `src/lib/language-rules.ts` — Sprachspezifische Vereinfachungsregeln für 13 Sprachen (Prompt-Bausteine)
- `src/components/image-editor.tsx` — Bildbearbeitung (Crop, Helligkeit, Kontrast) vor OCR, JPEG-Verifikation
- `src/app/api/tts/route.ts` — API-Route: OpenAI TTS (Text → mp3 Audio-Stream)
- `src/lib/text-parser.ts` — Shared Parsing-Logik (TextBlock, parseTextBlocks, parseInlineSegments, stripMarkdown, truncateAtSentenceBoundary)
- `src/lib/export.ts` — Alle Export-Funktionen (PDF, DOCX, MD, TXT)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `next.config.ts` — Server Actions Body-Size-Limit (10mb)
- `docs/rules/LS_ES_*.md` — 13 Regelwerke für Leichte/Einfache Sprache (Dokumentation)
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
