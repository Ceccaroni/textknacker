# PHORO Read — Tasks

> Offene Aufgaben, sauber nummeriert. Jede neue Claude-Code-Session startet hier.
> Status-Legende: `[ ]` offen · `[~]` in Arbeit · `[x]` erledigt

---

## T-01: Responsive Fullscreen-Layout

App füllt den gesamten Viewport (`h-dvh`) auf allen Geräten. Kein äusseres Scrollen — Content scrollt intern. Kamera und Textarea wachsen mit dem verfügbaren Platz (`flex-1`). Footer entfernt. Auf Desktop begrenzt `max-w-2xl` die Breite für Lesbarkeit.

**Status:** `[x]`

---

## T-02: Spracherkennung — Ausgabe in Eingabesprache

Die Vereinfachung muss **immer in der Sprache ausgegeben werden, in der der Input erfolgte**. Deutsch rein → Deutsch raus. Englisch rein → Englisch raus. Etc.

Umgesetzt: Beide Prompts (Text- und Listenmodus) in `actions.ts` enthalten jetzt die Anweisung, immer in der Eingabesprache zu antworten.

**Status:** `[x]`

---

## T-03: Einfache Sprache vs. Leichte Sprache — Regelwerk

Zwei Vereinfachungsstufen:
- **Einfache Sprache** (Standard)
- **Leichte Sprache** (strikter, regelbasiert)

Umgesetzt: Regelwerk aus User-Datei in die Prompts in `actions.ts` eingebettet. Einfache Sprache (B1-B2) mit lockereren Regeln, Leichte Sprache (A1-A2) mit strikten Regeln (max 10-12 Wörter/Satz, SVO, keine Fremdwörter, etc.).

**Status:** `[x]`

---

## T-04: Umschalter Einfache / Leichte Sprache

Schieberegler oder Button zum Umschalten zwischen:
- **Einfache Sprache** (Standard/Default)
- **Leichte Sprache**

Umgesetzt: Toggle in der Toolbar ersetzt den bisherigen Text/Liste-Switch. Ergebnisse werden pro Modus gecached. Listenmodus entfernt — beide Stufen liefern Fliesstext mit Überschriften und Absätzen.

**Status:** `[x]`

---

## T-05: Farbgestaltung anpassen auf PHORO-Branding

Farbschema der gesamten App an PHORO-Branding anpassen. Betrifft:
- Hintergrund, Karten, Buttons, Toolbar
- Aktive/inaktive Zustände
- Text- und Akzentfarben

**Aktion nötig:** User nach konkreten Farbcodes fragen.

**Status:** `[ ]`

---

## T-06: Datei-Upload erweitern (Word, PDF mit OCR, ODT, TXT, MD)

Folgende Dateiformate als Upload ermöglichen:
- **PDF** (mit OCR-Fähigkeit für gescannte PDFs!)
- **Word** (.docx)
- **OpenOffice/LibreOffice** (.odt)
- **TXT** (.txt)
- **Markdown** (.md)

Textextraktion serverseitig in `actions.ts`.

**Status:** `[ ]`

---

## T-07: Download-Optionen erweitern (Word, PDF, TXT, MD)

Vereinfachten Text in folgenden Formaten zum Download anbieten:
- **PDF** (bereits vorhanden via jsPDF — erweitern/verbessern)
- **Word** (.docx)
- **TXT** (.txt)
- **Markdown** (.md)

**Status:** `[ ]`

---

## T-08: Name "Textknacker" vollständig entfernen

Alter Projektname aus allen sichtbaren Stellen entfernt. Verbleibende Referenzen sind ausschliesslich Firebase-Projekt-IDs in Infrastruktur-Configs (`.firebaserc`, `firebase.json`, `firebase-deploy.yml`) — diese können nur über die Firebase/GCP Console geändert werden.

**Status:** `[x]`

---

## T-09: Fotomodus — Vollbild + Bildbearbeitung

Der Kamera-/Fotomodus muss:
- In **Vollbild wechseln** auf dem Gerät
- **Zuschnitt (Crop)** ermöglichen vor dem Upload
- **Helligkeit** anpassen
- **Kontrast** anpassen
- Erst nach Bearbeitung wird das Bild zur OCR geschickt

**Status:** `[ ]`

---

## T-10: Schrift Lexend konsequent durchsetzen

`globals.css`: `--font-sans` auf `var(--font-lexend)` gemappt (war fälschlich auf `--font-geist-sans`). Lexend wird jetzt über die gesamte App via `font-sans` angewendet — alle UI-Elemente, Buttons, Labels, Textausgaben.

**Status:** `[x]`

---

## T-11: Textausgabe — Formatierung und Styling

Umgesetzt:
- **Schrift:** Lexend (via T-10)
- **Schriftfarbe:** `#1c3d5a` (PHORO-Logo-Farbe) auf gesamtem Content-Bereich
- **Überschriften:** Markdown-Headings (`##`) und `**bold**`-Zeilen werden als fette `<h3>` gerendert
- **Absätze:** Text wird an `\n\n` in `<p>`-Blöcke gesplittet mit `mb-4` Abstand
- **Listen:** Headings zwischen Stichpunkten werden ebenfalls erkannt und fett dargestellt
- **Fokus-Modus:** Funktioniert weiterhin auf Satz-/Item-Ebene (Headings sind nicht fokussierbar)

**Status:** `[x]`
