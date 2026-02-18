# PHORO Read

## Beschreibung

PHORO Read ist eine Web-App, die deutsche Texte mithilfe von KI vereinfacht (Leichte Sprache, A2-Niveau). Nutzer können Text eintippen oder ein Foto eines Dokuments machen. Die KI (Claude) extrahiert den Text per OCR und vereinfacht ihn — wahlweise als Fliesstext oder als Stichpunktliste.

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
| PDF | jsPDF | ^4.0.0 (installiert, noch nicht genutzt) |
| Hosting | Firebase Hosting (SSR via frameworksBackend) | Region us-central1 |
| CI/CD | GitHub Actions → Firebase Deploy | bei Push auf main |

### Ungenutzte Dependencies (Altlasten)

- `genkit`, `@google-cloud/vertexai`, `@google/generative-ai` — Überbleibsel aus einer früheren Gemini-Phase, werden nirgends importiert.

## Projektstruktur

```
src/
├── app/
│   ├── layout.tsx        # Root-Layout (Lexend Font, html lang="de")
│   ├── page.tsx          # Einzige Seite — Single-View mit Tabs (Text/Camera)
│   ├── actions.ts        # Server Actions: runOCR() + simplifyText() → Claude API
│   ├── globals.css       # Tailwind + shadcn/ui CSS-Variablen (oklch)
│   └── favicon.ico
├── components/ui/        # shadcn/ui Komponenten (button, tabs, textarea, toggle, toggle-group)
└── lib/
    └── utils.ts          # cn() Helper (clsx + tailwind-merge)

public/                   # Statische Assets (SVGs)
firebase.json             # Firebase Hosting Config (inkl. Secrets, Region, Service Account)
.firebaserc               # Firebase Projekt-ID: textknacker-76464080-e8b74
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
- **Live-URLs:** `textknacker-76464080-e8b74.web.app` / `.firebaseapp.com`
- **Secrets (GitHub):** `FIREBASE_SERVICE_ACCOUNT`, `GEMINI_API_KEY` (veraltet, sollte durch `ANTHROPIC_API_KEY` ersetzt werden)
- **Secrets (Firebase):** `ANTHROPIC_API_KEY`

## Wichtige Regeln

- **Nie API Keys oder Secrets committen.** `.env*` ist in `.gitignore` — das muss so bleiben.
- **Vor jeder Änderung prüfen, ob der Build durchläuft** (`npm run build`).
- **Dokumentation aktuell halten** — insbesondere diese Datei und STATUS.md (siehe Dokumentationsstrategie).
- **Firebase-Projekt-IDs und Service-Account-Referenzen NICHT umbenennen** — diese sind an das Google-Cloud-Projekt gebunden und dürfen nur über die Firebase/GCP Console geändert werden.

## Bekannte Issues

1. **Zod nicht in package.json** — `actions.ts` importiert `zod`, aber es ist keine explizite Dependency. Funktioniert nur transitiv. Sollte explizit hinzugefügt werden.
2. **Font-Mismatch in globals.css** — CSS referenziert `--font-geist-sans`/`--font-geist-mono`, aber die App nutzt Lexend (`--font-lexend`). Font wird vermutlich nicht korrekt angewendet.
3. **Ungenutzte Dependencies** — `genkit`, `@google-cloud/vertexai`, `@google/generative-ai` können entfernt werden (Altlast aus Gemini-Phase).
4. **GitHub Actions Workflow referenziert `GEMINI_API_KEY`** — nicht mehr benötigt, sollte durch `ANTHROPIC_API_KEY` ersetzt oder entfernt werden.
5. **GEMINI.md** — Veraltete Datei aus der Gemini-Phase, kann entfernt werden.

## Tasks

Alle offenen Aufgaben sind in **[TASKS.md](./TASKS.md)** dokumentiert (T-01 bis T-11). Neue Session? Dort starten.

## Dokumentationsstrategie

Dieses Projekt ist klein (Single-Page-App, Frühphase). Die Dokumentation soll **minimal aber effektiv** sein — gerade genug, damit eine neue Claude-Code-Session sofort den Kontext hat.

### Dateien

| Datei | Zweck |
|---|---|
| `CLAUDE.md` | **Zentrale Referenz.** Tech-Stack, Struktur, Regeln, bekannte Issues. Wird bei Architekturänderungen aktualisiert. |
| `TASKS.md` | **Backlog.** Alle offenen Aufgaben, nummeriert (T-01 bis T-xx), mit Status und Abhängigkeiten. |
| `STATUS.md` | **Session-Handoff.** Was wurde zuletzt gemacht? Was ist der nächste Schritt? Wird am Ende jeder Arbeitssession aktualisiert. |

### Regeln

- `CLAUDE.md` beschreibt das **Was** (Architektur, Stack, Konventionen).
- `STATUS.md` beschreibt das **Wo** (aktueller Stand, nächste Schritte).
- Kein `docs/`-Verzeichnis nötig, solange die App eine Single-Page-App mit einer Handvoll Dateien ist.
- `blueprint.md` bleibt als ursprüngliche Spezifikation erhalten, wird aber nicht mehr aktiv gepflegt — `CLAUDE.md` + `STATUS.md` sind die lebenden Dokumente.
- Bei signifikantem Wachstum (z.B. mehrere Routes, eigene API-Endpoints, Datenbankanbindung) kann ein `docs/`-Verzeichnis eingeführt werden.
