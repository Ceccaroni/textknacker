# PHORO Read — Status

> Letzte Aktualisierung: 2026-02-21

## Zuletzt bearbeitet (diese Session)

- **PR-018 Teil 1**: Bug-Ursache identifiziert ✅
  - Schweizer Rechtschreibungsregel (`ss statt ß`) war generisch für ALLE Sprachen → drängte Claude Richtung Deutsch
  - Keine sprachspezifischen Regelwerke vorhanden, nur generische englische Regeln
- **PR-018 Teil 2**: Mehrsprachige Regelwerke implementiert ✅
  - 13 Regelwerke (vom User erstellt) in `docs/rules/` abgelegt
  - `src/lib/language-rules.ts` NEU: Kondensierte Prompt-Bausteine für alle 13 Sprachen
  - `src/app/actions.ts` refaktoriert: System-Prompt mit sprachspezifischen Regeln, verstärkte Spracherkennung, Schweizer Rechtschreibung nur noch in `de`-Regeln
  - Build erfolgreich ✅
- **PR-018 Teil 3**: Testen — NOCH OFFEN 🔴

## Nächste Schritte (Priorität)

1. **PR-018 Teil 3** — Manuell testen (🔥 Hoch)
   - Französischer Text → FR-Vereinfachung?
   - Italienischer Text → IT-Vereinfachung?
   - Englischer Text → EN-Vereinfachung?
   - Deutscher Text → DE-Vereinfachung (Regression)?
   - Rätoromanisch testen
   - Stichproben: ES, TR, NL, etc.
2. **PR-008** — Open Dyslexic Schriftoption (💤 Niedrig)

## Deployment

Lokale Änderungen noch NICHT committed/gepusht. Build läuft lokal durch.

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

## Offene / In Arbeit

- [ ] **PR-018**: Vereinfachung ignoriert Quellsprache – Ausgabe immer Deutsch 🔥
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
- `src/lib/text-parser.ts` — Shared Parsing-Logik (TextBlock, parseTextBlocks, parseInlineSegments, stripMarkdown)
- `src/lib/export.ts` — Alle Export-Funktionen (PDF, DOCX, MD, TXT)
- `src/app/globals.css` — Tailwind-Theme + PHORO-Farbtokens
- `next.config.ts` — Server Actions Body-Size-Limit (10mb)
- `docs/rules/LS_ES_*.md` — 13 Regelwerke für Leichte/Einfache Sprache (Dokumentation)
- `DESIGN-SYSTEM.md` — Verbindliches Design-System
- `docs/tickets/TICKETS.md` — Ticket-Übersicht
- `CLAUDE.md` — Architektur-Referenz
