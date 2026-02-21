# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-22

## Zuletzt bearbeitet (diese Session)

- **PR-020**: Technische Schulden aufräumen ✅
  - Zod als explizite Dependency hinzugefügt (`^3.25.0`)
  - Ungenutzte Dependencies entfernt: `genkit`, `@google-cloud/vertexai`, `@google/generative-ai` (417 Pakete weniger)
  - `GEMINI_API_KEY` aus GitHub Actions Workflow entfernt
  - `GEMINI.md` gelöscht
  - CLAUDE.md + STATUS.md aktualisiert (bekannte Issues bereinigt)
  - Build verifiziert: OK

## Nächste Schritte (Priorität)

Keine offenen Schritte. Alle Tickets erledigt oder verworfen.

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
- [x] PR-019: Vorlesefunktion auf OpenAI TTS umgestellt

## Offene / In Arbeit

Keine offenen Tickets.

## Bekannte technische Schulden

Keine offenen Schulden.

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
