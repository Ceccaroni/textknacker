# PHORO Read — Tasks

> Offene Aufgaben, sauber nummeriert. Jede neue Claude-Code-Session startet hier.
> Status-Legende: `[ ]` offen · `[~]` in Arbeit · `[x]` erledigt

---

## T-01: Responsive Fullscreen-Layout

Die Seite muss auf **allen Geräten bildschirmfüllend** funktionieren:
- Mobil (Hochformat + Querformat)
- Tablet (Hochformat + Querformat)
- Desktop

Kein Scrollen der äusseren Seite — die App füllt den Viewport. Content scrollt intern.

**Status:** `[ ]`

---

## T-02: Spracherkennung — Ausgabe in Eingabesprache

Die Vereinfachung muss **immer in der Sprache ausgegeben werden, in der der Input erfolgte**. Deutsch rein → Deutsch raus. Englisch rein → Englisch raus. Etc.

**Status:** `[ ]`

---

## T-03: Einfache Sprache vs. Leichte Sprache — Regelwerk

Zwei Vereinfachungsstufen:
- **Einfache Sprache** (Standard)
- **Leichte Sprache** (strikter, regelbasiert)

Die konkreten Regeln für die Vereinfachung werden als **separate MD-Datei** vom User bereitgestellt. Erst dann kann dieser Task umgesetzt werden.

**Abhängigkeit:** MD-Datei mit Regelwerk muss vom User geliefert werden.

**Status:** `[ ]`

---

## T-04: Umschalter Einfache / Leichte Sprache

Schieberegler oder Button zum Umschalten zwischen:
- **Einfache Sprache** (Standard/Default)
- **Leichte Sprache**

Ersetzt den bisherigen "Text / Liste"-Toggle im Reading Mode.

**Abhängigkeit:** T-03 (Regelwerk muss definiert sein)

**Status:** `[ ]`

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

Der Name "Textknacker" muss auf **sichtbarer Ebene gänzlich verschwinden**:
- UI-Texte, Titel, Meta-Tags
- README, Dokumentation
- Blueprint, DEPLOYMENT.md
- Alle Stellen prüfen (Grep durchführen)

Hinweis: Firebase-Projekt-IDs (`textknacker-76464080-e8b74`) sind infrastruktur-gebunden und können nur über die Firebase Console geändert werden.

**Status:** `[ ]`

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

Die Schrift **Lexend** muss überall konsequent angewendet werden:
- Alle UI-Elemente
- Alle Textausgaben
- Buttons, Labels, Placeholder, Fehlermeldungen

Aktuell bekanntes Problem: `globals.css` referenziert `--font-geist-sans`, aber die App nutzt Lexend. Font-Variable muss korrekt gemappt werden.

**Status:** `[ ]`

---

## T-11: Textausgabe — Formatierung und Styling

Die vereinfachte Textausgabe (Reading Mode) muss:
- **Schrift:** Lexend
- **Schriftfarbe:** Gleiche Farbe wie das PHORO-Logo (`#1c3d5a`)
- **Überschriften:** Fett
- **Absätze:** Sichtbare Lücken/Abstände nach Absätzen
- **Saubere Formatierung** insgesamt

**Abhängigkeit:** T-05 (Farbcodes) und T-10 (Lexend)

**Status:** `[ ]`
