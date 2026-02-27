# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-27

## READY TO SHIP — Meilenstein v1.0

PHORO Read ist feature-complete und produktionsbereit. Alle geplanten Funktionen sind implementiert, alle Tickets erledigt, keine offenen Bugs oder technischen Schulden.

### Was PHORO Read kann

- **Textvereinfachung** in 2 Modi: Einfache Sprache (B1-B2) und Leichte Sprache (A1-A2)
- **15 Sprachen** mit sprachspezifischen Regelwerken (de, fr, it, rm, en, es, pt, nl, tr, sq, mk, sr, ru, uk, ti)
- **OCR per Foto** — Kamera-Aufnahme oder Bild-Upload, inkl. Bildbearbeitung (Crop, Helligkeit, Kontrast)
- **Vorlesefunktion** via OpenAI TTS (Stimme: nova)
- **Fokus-Modus** — Satz-für-Satz-Hervorhebung zum Mitlesen
- **Erweiterter Zeichenabstand** für bessere Lesbarkeit
- **Copy-Button** — Vereinfachten Text in die Zwischenablage kopieren
- **Export** in 4 Formate: PDF, DOCX, Markdown, Plaintext
- **Responsive** — Desktop (Side-by-Side) und Mobile (View-Switching)
- **Markdown-Rendering** in der Textausgabe (Überschriften, Listen, Fett/Kursiv)

### Erledigte Tickets (22 total, 1 verworfen)

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
- [x] PR-018: Vereinfachung ignoriert Quellsprache – 15 Sprachen implementiert
- [x] PR-019: Vorlesefunktion auf OpenAI TTS umgestellt
- [x] PR-020: Technische Schulden aufräumen (Zod, Gemini-Deps, GEMINI_API_KEY, GEMINI.md)
- [x] PR-021: Russisch und Ukrainisch als Sprachen hinzufügen (13 → 15)
- [x] PR-022: Copy-Button im Ergebnis-Textrahmen
- [ ] ~~PR-008: Open Dyslexic Schriftoption~~ (verworfen)

## Letzte Session (2026-02-27)

- DESIGN-SYSTEM.md Abschnitt 10 komplett überarbeitet: Aus dem kurzen Logo-Abschnitt eine vollständige, generische Bauanleitung für alle PHORO-Produkte gemacht (SVG-Struktur, Baseline-Korrektur, Header-Varianten, Grössentabelle, Checkliste)
- Keine Code-Änderungen, nur Dokumentation

## Offene / In Arbeit

Keine offenen Tickets. Keine bekannten Issues. Keine technischen Schulden.

## Deployment

Alles committed und gepusht. GitHub Actions deployt automatisch auf Firebase Hosting (SSR).

## Wichtige Dateien

- `src/app/page.tsx` — Gesamte App-Logik (Desktop: Side-by-Side, Mobile: View-Switching)
- `src/app/actions.ts` — Server Actions (OCR + Vereinfachung via Claude API), sprachspezifische Regeln, media_type-Erkennung via Magic Bytes
- `src/lib/language-rules.ts` — Sprachspezifische Vereinfachungsregeln für 15 Sprachen (Prompt-Bausteine)
- `src/components/image-editor.tsx` — Bildbearbeitung (Crop, Helligkeit, Kontrast) vor OCR, JPEG-Verifikation
- `src/app/api/tts/route.ts` — API-Route: OpenAI TTS (Text → mp3 Audio-Stream)
- `src/lib/text-parser.ts` — Shared Parsing-Logik (TextBlock, parseTextBlocks, parseInlineSegments, stripMarkdown, truncateAtSentenceBoundary)
- `src/lib/export.ts` — Alle Export-Funktionen (PDF, DOCX, MD, TXT)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `next.config.ts` — Server Actions Body-Size-Limit (10mb)
- `docs/rules/LS_ES_*.md` — 15 Regelwerke für Leichte/Einfache Sprache (Dokumentation)
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
