# PHORO Design System – Code-Anweisungen

Abgeleitet aus: Brand Identity (Revised 2026) + InDesign Style Guide
Für: Next.js / Tailwind CSS / React Components

---

## 1. Farb-Tokens (verbindlich)

```css
:root {
  /* Primärfarben */
  --phoro-warmbeige: #F5F0E6;       /* Background – Seitenhintergrund, Cards */
  --phoro-pharos-blue: #1A3550;     /* Primary – Titel, Linien, Key-Elemente */
  --phoro-morgenrot: #E07A5F;       /* Accent/CTA – Buttons, Highlights, EXTREM sparsam */
  --phoro-horizon-green: #6B9080;   /* Progress – Fortschritt, Validierung, sparsam */
  --phoro-slate: #3D405B;           /* Body Text – Fliesstext, Labels */

  /* Tier-Farben (angewendet auf Sun-O Icon) */
  --phoro-tier-dawn: #6B9F8A;       /* Gratis */
  --phoro-tier-light: #1A3550;      /* Pro (= Pharos Blue) */
  --phoro-tier-beacon: #E07A5F;     /* School (= Morgenrot) */
  --phoro-tier-pharos: #C9A227;     /* Enterprise / Gold */

  /* Abgeleitete Töne */
  --phoro-slate-80: #3D405B80;      /* Slate 80% – Sublines, sekundärer Text */
  --phoro-slate-60: #3D405B99;      /* Slate 60% – Header/Footer, Meta */
  --phoro-slate-30: #3D405B4D;      /* Slate 30% – Hairlines, Hilfslinien */
  --phoro-slate-20: #3D405B33;      /* Slate 20% – Spaltentrenner */
  --phoro-slate-15: #3D405B26;      /* Slate 15% – Subtile vertikale Linien */
  --phoro-blue-60: #1A355099;       /* Blue 60% – Header/Footer */
  --phoro-blue-35: #1A355059;       /* Blue 35% – Tabellenlinien */
  --phoro-blue-15: #1A355026;       /* Blue 15% – Kapitel-Wasserzeichen */
  --phoro-blue-8: #1A355014;        /* Blue 8% – Kopfzeilen-Hintergrund, Swimlane-Köpfe */
  --phoro-green-8: #6B908014;       /* Green 8% – Highlight genau 1x pro View */
}
```

### Tailwind-Config Erweiterung

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'phoro': {
          'warmbeige': '#F5F0E6',
          'blue': '#1A3550',
          'morgenrot': '#E07A5F',
          'green': '#6B9080',
          'slate': '#3D405B',
          'gold': '#C9A227',
        }
      }
    }
  }
}
```

### Farbregeln (aus Checkliste)

- **Pro View/Screen maximal 1 Akzentfarbe** zusätzlich zu Blue + Slate + Warmbeige
- Morgenrot NUR für CTAs und maximal 1 Stelle pro sichtbarem Bereich
- Horizon-Grün NUR für Fortschritt/Validierung/Human-Check, sparsam
- Gold NUR für Pharos-Tier-Kennzeichnung
- Wenn es „bunt" wirkt → Farbe reduzieren

---

## 2. Typografie

### Font: Lexend

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap');

:root {
  --font-primary: 'Lexend', sans-serif;
}
```

**Warum Lexend:** Dyslexie-optimiert (Brand Identity: "Balanced, Dyslexie-Optimized Typography"). Einzige Schriftfamilie für alles – keine zweite Font.

### Typografie-Skala

```css
/* Seitentitel / H1 */
.phoro-h1 {
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 1.75rem;      /* 28px */
  line-height: 1.3;
  color: var(--phoro-pharos-blue);
  letter-spacing: -0.01em;
}

/* Abschnittstitel / H2 */
.phoro-h2 {
  font-family: var(--font-primary);
  font-weight: 500;         /* Medium */
  font-size: 1.25rem;       /* 20px */
  line-height: 1.4;
  color: var(--phoro-pharos-blue);
}

/* Body Text */
.phoro-body {
  font-family: var(--font-primary);
  font-weight: 400;         /* Regular */
  font-size: 0.9375rem;     /* 15px */
  line-height: 1.7;
  color: var(--phoro-slate);
}

/* Label (in Boxen, Spaltenköpfe, Sidebar) */
.phoro-label {
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 0.8125rem;     /* 13px */
  line-height: 1.4;
  color: var(--phoro-pharos-blue);
}

/* Subline / Sekundärtext */
.phoro-subline {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: 0.75rem;       /* 12px */
  line-height: 1.5;
  color: var(--phoro-slate-80);
}

/* Meta (Header, Footer, Timestamps, Badges) */
.phoro-meta {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: 0.6875rem;     /* 11px */
  line-height: 1.4;
  color: var(--phoro-slate-60);
  letter-spacing: 0.02em;
}

/* Overline / Kategorie-Label */
.phoro-overline {
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 0.625rem;      /* 10px */
  line-height: 1.4;
  color: var(--phoro-slate-60);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

### Typografie-Regeln

- **Nur Lexend** – keine zweite Schriftfamilie, keine Serif-Font
- Gewichte: 400 (Regular), 500 (Medium), 600 (Semibold) – kein Bold 700 im UI
- Keine manuelle Fettschrift als Ersatz für Struktur
- Titel immer in Pharos Blue, Body immer in Slate

---

## 3. Abstände & Spacing

```css
:root {
  /* Basis-Raster: 4px */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
}
```

### Spacing-Regel

- **Weissraum ist Autorität** – im Zweifel mehr Platz lassen
- Padding in Boxen: mindestens 12px (kleine), 16–20px (normal), 24–32px (Key-Box)
- Abstand zwischen Karten/Elementen: 8–12px

---

## 4. Borders, Linien, Konturen

```css
:root {
  /* Linienstärken (aus InDesign übertragen) */
  --border-hairline: 1px solid var(--phoro-slate-30);    /* 0.25pt → Hilfslinien */
  --border-standard: 1px solid var(--phoro-blue-35);     /* 0.5pt → Grid, Tabellen */
  --border-key: 1.5px solid var(--phoro-pharos-blue);    /* 0.75pt → Boxen, Key-Lines */
  --border-divider: 2px solid var(--phoro-pharos-blue);  /* 1.0pt → Header-Divider */
}
```

### Border-Regeln

- Linien sollen **strukturell** wirken, nicht dekorativ
- Keine dicken Borders (>2px) – wirkt plakativ
- Vertikale Linien vermeiden oder extrem subtil (slate-15)
- Trennlinien horizontal bevorzugen

---

## 5. Border-Radius

```css
:root {
  --radius-sm: 6px;      /* Standard-Box (≈ 3mm bei Print) */
  --radius-md: 8px;      /* Key-Box (≈ 4mm bei Print) */
  --radius-lg: 10px;     /* Buttons, Input-Felder */
  --radius-full: 9999px; /* Pills, Badges, Avatare */
}
```

### Radius-Regeln

- **Maximum 8-10px** für Boxen – darüber wirkt es "UI-Baukasten"
- Keine 16px+ Border-Radius auf Content-Boxen
- Pills/Badges dürfen full-rounded sein (radius-full)

---

## 6. Schatten

```css
:root {
  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

### Schatten-Regeln

- **Im Zweifel: kein Schatten** (Schatten = "Canva-Moment")
- Wenn überhaupt: extrem subtil, kaum sichtbar
- Keine Drop-Shadows, keine Glow-Effekte, keine 3D-Effekte
- Tiefe über Border-Kontrast erzeugen, nicht über Schatten

---

## 7. Komponenten-Patterns

### Cards / Boxen

```css
.phoro-card {
  background: #FFFFFF;
  border: 1px solid rgba(26, 53, 80, 0.12);  /* Blue 12% */
  border-radius: var(--radius-sm);
  padding: var(--space-4);
}

/* Key-Box (strategisch wichtige Inhalte) */
.phoro-key-box {
  background: var(--phoro-pharos-blue);
  color: #FFFFFF;
  border-radius: var(--radius-md);
  padding: var(--space-6) var(--space-8);
  /* Kein Schatten, kein Icon, max 60-80 Wörter */
}

/* Hinweis-Box (Datenschutz, Warnungen) */
.phoro-notice {
  background: rgba(224, 122, 95, 0.08);  /* Morgenrot 8% */
  border-left: 3px solid var(--phoro-morgenrot);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: var(--space-3) var(--space-4);
}
```

### Tabellen

```css
.phoro-table {
  width: 100%;
  border-collapse: collapse;
}

.phoro-table th {
  background: var(--phoro-blue-8);        /* Blue 8% */
  font-weight: 500;                       /* Medium */
  font-size: 0.8125rem;
  color: var(--phoro-pharos-blue);
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--phoro-blue-35);
}

.phoro-table td {
  font-size: 0.8125rem;
  color: var(--phoro-slate);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid rgba(61, 64, 91, 0.08);  /* Slate 8% */
}

/* Zebra-Striping: subtil */
.phoro-table tr:nth-child(even) {
  background: rgba(61, 64, 91, 0.03);    /* Slate 3% */
}

/* KEINE vertikalen Linien */
/* KEINE harten Kontraste */
/* Soll editorial wirken, nicht wie Excel */
```

### Buttons

```css
/* Primary CTA */
.phoro-btn-primary {
  background: var(--phoro-pharos-blue);
  color: #FFFFFF;
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 0.875rem;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: filter 0.15s;
}
.phoro-btn-primary:hover {
  filter: brightness(1.15);
}

/* Secondary */
.phoro-btn-secondary {
  background: transparent;
  color: var(--phoro-pharos-blue);
  border: 1px solid var(--phoro-blue-35);
  border-radius: var(--radius-lg);
  padding: 10px 20px;
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
}

/* Accent CTA (extrem sparsam – 1x pro View) */
.phoro-btn-accent {
  background: var(--phoro-morgenrot);
  color: #FFFFFF;
  /* Gleiche Specs wie Primary */
}
```

### Tier-Badges

```css
.phoro-badge-dawn    { color: #6B9F8A; background: rgba(107, 159, 138, 0.1); }
.phoro-badge-light   { color: #1A3550; background: rgba(26, 53, 80, 0.1); }
.phoro-badge-beacon  { color: #E07A5F; background: rgba(224, 122, 95, 0.1); }
.phoro-badge-pharos  { color: #C9A227; background: rgba(201, 162, 39, 0.1); }

/* Alle Badges */
.phoro-badge {
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 0.625rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
```

---

## 8. Layout-Struktur (3-Spalten App)

```
┌──────────────┬────────────────────────────────┬──────────────────┐
│              │                                │                  │
│  LEFT        │  CENTER                        │  RIGHT           │
│  Sidebar     │  Chat Core                     │  Fokus-Tools     │
│              │                                │                  │
│  260px       │  flex: 1                       │  280px           │
│  #EAE6DF     │  #FAF8F5                       │  #F0EDE8         │
│              │  (leicht heller als warmbeige)  │                  │
│  Chat-       │                                │  Kategorie-Tabs  │
│  Historie    │  Willkommensbeschreibung        │  Unterricht      │
│              │  ODER                          │  Leadership      │
│  Neuer Chat  │  Chat-Verlauf                  │  Administration  │
│              │                                │                  │
│  User-Info   │  Input-Bereich                 │  Tool-Cards      │
│  + Tier      │                                │  + Tier-Info     │
│              │                                │                  │
└──────────────┴────────────────────────────────┴──────────────────┘
```

### Hintergrundfarben

```css
--bg-sidebar-left: #EAE6DF;    /* Warmbeige dunkler */
--bg-center: #FAF8F5;           /* Fast weiss, warm */
--bg-sidebar-right: #F0EDE8;    /* Zwischen Warmbeige und Sidebar */
--bg-card: #FFFFFF;              /* Karten auf den Hintergründen */

/* Borders zwischen Bereichen */
--border-panel: 1px solid #DDD8CE;
```

---

## 9. Anti-Patterns (Checkliste)

Aus dem InDesign Style Guide übertragen auf Code:

| ❌ Nicht machen | ✅ Stattdessen |
|---|---|
| Icons (Rakete, Glühbirne, Emojis) | Typografie + Linien + Flächen |
| Mehr als 1 Akzentfarbe pro View | Blue + Slate + Warmbeige + 1 Akzent |
| Border-Radius > 10px auf Boxen | 6-8px max |
| Drop-Shadows auf Karten | Subtile Borders (1px) |
| Farbige Hintergründe in Boxen | Weiss oder Warmbeige + Kontur |
| Fette Linien (>2px) | 1-1.5px Linien |
| Mehrere visuelle Anker pro Screen | 1 dominanter Fokus |
| "Süsse" Micro-Details, Ornamente | Präzise, ruhig, technisch |
| Zu viele Textstile | H1, H2, Body, Label, Subline, Meta – fertig |
| Verlaufs-Hintergründe, Glow | Flache Farben, subtile Transparenz |
| Inter, Roboto, Arial | Lexend (einzige Font) |
| Purple Gradients | Pharos Blue + Warmbeige |

---

## 10. Logo-Verwendung im Code

### Sun-O Icon (aus Brand Identity)

- 3-Ray Sun mit Bogen – NICHT 8 Rays
- Farbe wechselt nach Tier (Dawn/Light/Beacon/Pharos)
- Animation: Staggered Ray Rotation, dezent, nur beim "Thinking"-State
- Favicon: Vereinfachte Version (Circle + 3 Rays)

### Wortmarke

- Font: Lexend (passend zum Brand – Dyslexie-optimiert)
- Gewicht: 700 (Bold) für Wortmarke
- Bogen unter dem Text (aus Brand Identity)
- Farbe: Pharos Blue (#1A3550)

---

## Zusammenfassung: Der PHORO-Look in einem Satz

> **Ruhig, technisch, seriös, "infrastructure-grade" – nicht didaktisch, nicht verspielt.**

Wenn es verspielt wirkt, liegt es fast immer an: zu vielen Farben, zu runden Ecken, Icons/Illustrationen, zu dicken Linien, zu wenig Weissraum, Schatten.
