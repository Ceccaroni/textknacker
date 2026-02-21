# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-22

## Zuletzt bearbeitet (diese Session)

- **PR-021**: Russisch und Ukrainisch als Sprachen hinzufügen ✅
  - Regelwerke `LS_ES_ru.md` und `LS_ES_uk.md` nach `docs/rules/` kopiert
  - `ru` (Русский) und `uk` (Українська) in `language-rules.ts` eingetragen
  - Regeln aus Section 7 der Regelwerke extrahiert (Leichte Sprache + Einfache Sprache)
  - Alle Referenzen von 13 → 15 Sprachen aktualisiert
  - Build verifiziert: OK
- **PR-022**: Copy-Button im Ergebnis-Textrahmen ✅
  - Clipboard-Icon (Lucide `Copy`) oben rechts im Ergebnis-Textrahmen
  - Kopiert Plaintext (via `stripMarkdown`) in die Zwischenablage
  - Visuelles Feedback: Icon wechselt zu Häkchen (`Check`, grün) für 2s
  - Dezent: `text-phoro-slate/40` → Hover: `text-phoro-blue`
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
- [x] PR-018: Vereinfachung ignoriert Quellsprache – 15 Sprachen implementiert
- [x] PR-019: Vorlesefunktion auf OpenAI TTS umgestellt
- [x] PR-020: Technische Schulden aufräumen (Zod, Gemini-Deps, GEMINI_API_KEY, GEMINI.md)
- [x] PR-021: Russisch und Ukrainisch als Sprachen hinzufügen (13 → 15)
- [x] PR-022: Copy-Button im Ergebnis-Textrahmen

## Offene / In Arbeit

Keine offenen Tickets.

## Bekannte technische Schulden

Keine offenen Schulden.

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
