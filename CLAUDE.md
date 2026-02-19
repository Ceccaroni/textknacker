# PHORO Read

## Beschreibung

PHORO Read ist eine Web-App, die Texte mithilfe von KI vereinfacht (Einfache Sprache B1-B2 oder Leichte Sprache A1-A2). Nutzer können Text eintippen oder ein Foto eines Dokuments machen. Die KI (Claude) extrahiert den Text per OCR und vereinfacht ihn. Ausgabe immer in der Eingabesprache, bei Deutsch in Schweizer Rechtschreibung (ss statt ß).

## Tech-Stack

| Bereich | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.0.8 |
| Runtime | React | 19.2.1 |
| Sprache | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS | v4 |
| UI-Komponenten | shadcn/ui (New York Style) | via components.json |
| Icons | Lucide React | ^0.563.0 |
| Font | Lexend (Google Fonts) | via next/font |
| AI-Backend | Anthropic Claude API (Sonnet 4.5) | SDK ^0.32.1 |
| Validierung | Zod | transitiv (nicht explizit in package.json!) |
| PDF | jsPDF | ^4.0.0 |
| DOCX | docx | ^9.x (dynamisch importiert) |
| Hosting | Firebase Hosting (SSR via frameworksBackend) | Region us-central1 |
| CI/CD | GitHub Actions → Firebase Deploy | bei Push auf main |

### Ungenutzte Dependencies (Altlasten)

- `genkit`, `@google-cloud/vertexai`, `@google/generative-ai` — Überbleibsel aus einer früheren Gemini-Phase, werden nirgends importiert.

## Projektstruktur

```
src/
├── app/
│   ├── layout.tsx        # Root-Layout (Lexend Font, html lang="de")
│   ├── page.tsx          # Einzige Seite — Desktop: Side-by-Side (Input|Result), Mobile: View-Switching
│   ├── actions.ts        # Server Actions: runOCR() + simplifyText() → Claude API (system prompt + Basis-Instruktionen + modus-spezifische Regeln)
│   ├── globals.css       # Tailwind + shadcn/ui CSS-Variablen (oklch)
│   └── favicon.ico
├── components/ui/        # shadcn/ui Komponenten (button, tabs, textarea, toggle, toggle-group)
└── lib/
    ├── utils.ts          # cn() Helper (clsx + tailwind-merge)
    ├── text-parser.ts    # Shared Typen (TextBlock, StyledSegment) + Parsing-Funktionen
    └── export.ts         # Export-Funktionen (PDF, DOCX, MD, TXT)

public/                   # Statische Assets (SVGs)
docs/
└── tickets/              # Ticket-System (PR-001 bis PR-xxx)
    ├── TICKETS.md        # Ticket-Index
    ├── TEMPLATE.md       # Vorlage für neue Tickets
    └── completed/        # Erledigte Tickets
firebase.json             # Firebase Hosting Config (inkl. Secrets, Region, Service Account)
.firebaserc               # Firebase Projekt-ID
.github/workflows/
  firebase-deploy.yml     # CI/CD: npm ci → build → deploy
blueprint.md              # Ursprüngliche Feature-Spezifikation
DEPLOYMENT.md             # Deployment-Anleitung (GitHub Secrets etc.)
```

## API Keys / Services

- **Anthropic Claude API** — Textvereinfachung + OCR (Vision). Key wird als `ANTHROPIC_API_KEY` über Firebase Secrets bereitgestellt.
- **Firebase Hosting** — Deployment mit SSR-Backend (frameworksBackend).
- **GitHub Actions** — CI/CD, nutzt `FIREBASE_SERVICE_ACCOUNT` Secret.

## Deployment

- **Ziel:** Firebase Hosting (SSR-fähig via `frameworksBackend`)
- **Trigger:** Push auf `main` → GitHub Actions Workflow
- **Pipeline:** Checkout → Node 20 → `npm ci` → `npm run build` → Firebase Deploy
- **Live-URLs:** Siehe Firebase Console (Hosting-URL)
- **Secrets (GitHub):** `FIREBASE_SERVICE_ACCOUNT`, `GEMINI_API_KEY` (veraltet, sollte durch `ANTHROPIC_API_KEY` ersetzt werden)
- **Secrets (Firebase):** `ANTHROPIC_API_KEY`

## Wichtige Regeln

- **Nie API Keys oder Secrets committen.** `.env*` ist in `.gitignore` — das muss so bleiben.
- **Vor jeder Änderung prüfen, ob der Build durchläuft** (`npm run build`).
- **Dokumentation aktuell halten** — insbesondere diese Datei und STATUS.md (siehe Dokumentationsstrategie).
- **Firebase-Projekt-IDs und Service-Account-Referenzen NICHT umbenennen** — diese sind an das Google-Cloud-Projekt gebunden und dürfen nur über die Firebase/GCP Console geändert werden.

## Bekannte Issues

1. **Zod nicht in package.json** — `actions.ts` importiert `zod`, aber es ist keine explizite Dependency. Funktioniert nur transitiv. Sollte explizit hinzugefügt werden.
2. **Ungenutzte Dependencies** — `genkit`, `@google-cloud/vertexai`, `@google/generative-ai` können entfernt werden (Altlast aus Gemini-Phase).
3. **GitHub Actions Workflow referenziert `GEMINI_API_KEY`** — nicht mehr benötigt, sollte durch `ANTHROPIC_API_KEY` ersetzt oder entfernt werden.
4. **GEMINI.md** — Veraltete Datei aus der Gemini-Phase, kann entfernt werden.

## Design-System

Alle visuellen Entscheidungen (Farben, Typografie, Abstände, Borders, Komponenten-Patterns, Anti-Patterns) sind in **[DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)** definiert. Diese Datei ist **verbindlich** für alle UI-Änderungen — bei Layout- oder Styling-Fragen immer zuerst dort nachschlagen.

Kurzfassung der wichtigsten Farben:
- **Warmbeige** `#F5F0E6` — Seitenhintergrund
- **Pharos Blue** `#1A3550` — Titel, Buttons, Key-Elemente
- **Slate** `#3D405B` — Fliesstext, Labels
- **Morgenrot** `#E07A5F` — CTA/Accent, extrem sparsam (1x pro View)
- **Horizon Green** `#6B9080` — Fortschritt/Validierung, sparsam

## Ticket-System

Alle Aufgaben werden als Tickets in **[docs/tickets/TICKETS.md](./docs/tickets/TICKETS.md)** verwaltet. Format: `PR-XXX` (PR = PHORO Read).

### Regeln

- **Keine Arbeit ohne Ticket.** Jede Aufgabe bekommt ein Ticket, bevor mit der Arbeit begonnen wird.
- Tickets werden fortlaufend nummeriert: `PR-001`, `PR-002`, ...
- Ticket-Dateien liegen in `docs/tickets/`, Vorlage in `docs/tickets/TEMPLATE.md`.
- **Vor Arbeitsbeginn:** Status auf 🟡 setzen, `TICKETS.md` aktualisieren.
- **Nach Abschluss:** Status auf 🟢, Erledigungsdatum eintragen, Datei nach `docs/tickets/completed/` verschieben, `TICKETS.md` aktualisieren.
- **Bei jedem Session-Start:** `TICKETS.md` lesen, um zu wissen, wo wir stehen.
- Fällt dir etwas auf → Ticket vorschlagen, User bestätigt.

### Session abschliessen

Am Ende jeder Arbeitssession alle Projektdokumente aktualisieren:

1. **`STATUS.md`** — Was wurde erledigt? Nächste Schritte? Deployment-Stand?
2. **`docs/tickets/TICKETS.md`** — Stimmt die Übersicht? Alle Status korrekt? Erledigte Tickets in `completed/` verschoben?
3. **`CLAUDE.md`** — Falls sich Architektur, Struktur oder Regeln geändert haben: anpassen. Falls nicht: so lassen.
4. **Commit und Push** aller Doku-Änderungen.

### Legacy

Alte Aufgaben (T-01 bis T-11) sind noch in **[TASKS.md](./TASKS.md)** dokumentiert. Neue Aufgaben werden ausschliesslich als Tickets angelegt.

## Dokumentationsstrategie

Dieses Projekt ist klein (Single-Page-App, Frühphase). Die Dokumentation soll **minimal aber effektiv** sein — gerade genug, damit eine neue Claude-Code-Session sofort den Kontext hat.

### Dateien

| Datei | Zweck |
|---|---|
| `CLAUDE.md` | **Zentrale Referenz.** Tech-Stack, Struktur, Regeln, bekannte Issues. Wird bei Architekturänderungen aktualisiert. |
| `DESIGN-SYSTEM.md` | **Verbindliches Design-System.** Farben, Typografie, Abstände, Komponenten, Anti-Patterns. Bei allen UI-Entscheidungen konsultieren. |
| `docs/tickets/TICKETS.md` | **Ticket-Index.** Alle Aufgaben mit Status. Bei Session-Start hier starten. |
| `docs/tickets/PR-XXX.md` | **Einzeltickets.** Beschreibung, Schritte, betroffene Dateien. Erledigte → `completed/`. |
| `TASKS.md` | **Legacy-Backlog.** Alte Aufgaben (T-01 bis T-11). Keine neuen Einträge mehr. |
| `STATUS.md` | **Session-Handoff.** Was wurde zuletzt gemacht? Was ist der nächste Schritt? Wird am Ende jeder Arbeitssession aktualisiert. |

### Regeln

- `CLAUDE.md` beschreibt das **Was** (Architektur, Stack, Konventionen).
- `STATUS.md` beschreibt das **Wo** (aktueller Stand, nächste Schritte).
- `docs/tickets/` enthält das Ticket-System (siehe oben).
- `blueprint.md` bleibt als ursprüngliche Spezifikation erhalten, wird aber nicht mehr aktiv gepflegt — `CLAUDE.md` + `STATUS.md` sind die lebenden Dokumente.
- Bei signifikantem Wachstum (z.B. mehrere Routes, eigene API-Endpoints, Datenbankanbindung) kann ein `docs/`-Verzeichnis eingeführt werden.
