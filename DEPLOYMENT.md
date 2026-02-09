# Automatisches Firebase Deployment via GitHub Actions

## ✅ Was bereits eingerichtet ist:

Der GitHub Actions Workflow ist fertig konfiguriert in `.github/workflows/firebase-deploy.yml`.

Bei jedem Push auf `main` wird automatisch:
1. Die Next.js App gebaut
2. Auf Firebase Hosting deployed

## 🔧 Einmalige Einrichtung - GitHub Secrets

Du musst noch 2 Secrets in GitHub hinterlegen:

### 1. FIREBASE_SERVICE_ACCOUNT

**So erhältst du den Service Account:**

```bash
# Im Terminal ausführen:
firebase login
firebase projects:list
# Wähle dein Projekt: textknacker-76464080-e8b74

# Service Account Key generieren:
# Gehe zu: https://console.firebase.google.com/project/textknacker-76464080-e8b74/settings/serviceaccounts/adminsdk
# Klicke auf "Generate new private key"
# Lade die JSON-Datei herunter
```

**In GitHub hinterlegen:**
1. Gehe zu: https://github.com/Ceccaroni/textknacker/settings/secrets/actions
2. Klicke "New repository secret"
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: Den kompletten Inhalt der heruntergeladenen JSON-Datei
5. Klicke "Add secret"

### 2. GEMINI_API_KEY

**In GitHub hinterlegen:**
1. Gehe zu: https://github.com/Ceccaroni/textknacker/settings/secrets/actions
2. Klicke "New repository secret"
3. Name: `GEMINI_API_KEY`
4. Value: Dein Gemini API Key
5. Klicke "Add secret"

## 🚀 Deployment starten

Nach dem Einrichten der Secrets:

1. Merge den Pull Request: https://github.com/Ceccaroni/textknacker/pull/new/claude/auto-deploy-setup-4qDJX
2. Sobald der PR in `main` gemerged ist, startet das Deployment automatisch
3. Du kannst den Fortschritt unter "Actions" in deinem GitHub Repo verfolgen

## 📍 Deine Live-URL

Nach erfolgreichem Deployment ist deine App verfügbar unter:
```
https://textknacker-76464080-e8b74.web.app
```

oder

```
https://textknacker-76464080-e8b74.firebaseapp.com
```

## ⚙️ Workflow Details

Der Workflow wird getriggert bei:
- Push auf `main` Branch

Der Workflow führt aus:
1. Code checkout
2. Node.js 20 setup
3. Dependencies installieren (`npm ci`)
4. Next.js App bauen (`npm run build`)
5. Deployment zu Firebase Hosting

---

**Hinweis:** Das erste Deployment kann ein paar Minuten dauern.
