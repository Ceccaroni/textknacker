# PHORO Read — Deployment

## Automatisches Deployment via GitHub Actions

Der Workflow in `.github/workflows/firebase-deploy.yml` deployt bei jedem Push auf `main` automatisch:

1. Next.js App bauen
2. Auf Firebase Hosting deployen

## GitHub Secrets

Folgende Secrets müssen im GitHub-Repo hinterlegt sein:

### FIREBASE_SERVICE_ACCOUNT

1. Firebase Console → Projekteinstellungen → Dienstkonten
2. "Neuen privaten Schlüssel generieren" → JSON herunterladen
3. GitHub → Repository Settings → Secrets → "New repository secret"
4. Name: `FIREBASE_SERVICE_ACCOUNT`, Value: kompletter JSON-Inhalt

### ANTHROPIC_API_KEY

1. GitHub → Repository Settings → Secrets → "New repository secret"
2. Name: `ANTHROPIC_API_KEY`, Value: Dein Anthropic API Key

## Live-URL

Die App ist nach Deployment verfügbar unter der in der Firebase Console konfigurierten URL.

## Workflow-Details

- **Trigger:** Push auf `main`
- **Schritte:** Checkout → Node.js 20 → `npm ci` → `npm run build` → Firebase Deploy
- **Hinweis:** Das erste Deployment kann ein paar Minuten dauern.
