# PHORO Read

Texte einfacher verstehen — eine Web-App, die deutsche Texte mithilfe von KI (Claude) in Leichte Sprache (A2-Niveau) vereinfacht.

## Features

- **Kamera-OCR:** Foto eines Dokuments machen, Text wird automatisch extrahiert
- **Textvereinfachung:** KI vereinfacht Texte als Fliesstext oder Stichpunktliste
- **Barrierefreiheit:** Optimiert für einfache Bedienung mit Lexend-Schrift

## Tech-Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui
- Anthropic Claude API (Sonnet 4.5)
- Firebase Hosting (SSR)

## Entwicklung

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

Benötigt eine `.env.local` mit:

```
ANTHROPIC_API_KEY=dein-key-hier
```

## Deployment

Automatisch via GitHub Actions bei Push auf `main` → Firebase Hosting.

Details siehe [DEPLOYMENT.md](./DEPLOYMENT.md).
