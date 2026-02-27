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

## 10. Logo — Bauanleitung für alle PHORO-Produkte

> **Diese Anleitung ist verbindlich für jedes PHORO-Produkt.** Das Logo ist bei allen Produkten identisch aufgebaut — nur der Produktname ändert sich (z.B. "read", "kasus", "studio"). Farben werden hier bewusst generisch gehalten (`FARBE_*`), da jedes Produkt ein eigenes Farbkonzept haben kann. Im Zweifel die Farb-Tokens aus Abschnitt 1 dieses Dokuments verwenden.

### 10.1 Architektur-Überblick

Das Logo besteht aus **zwei getrennten Teilen**, die per Flexbox nebeneinander stehen:

1. **SVG-Datei** (`public/logo-phoro.svg`) — enthält die Buchstaben "PHORO" als SVG-Pfade (kein Font-Rendering!), einen dekorativen Bogen darunter und drei kleine Strahlen rechts oben
2. **HTML `<span>`** — der Produktname (z.B. "read", "kasus") als normaler Text in Lexend font-light

Diese Trennung ist wichtig: "PHORO" ist **kein Text**, sondern ein SVG mit exakten Pfaden. Der Produktname daneben ist **echter HTML-Text**.

### 10.2 Die SVG-Datei (`public/logo-phoro.svg`)

**ViewBox:** `"76 34 192 66"` — nicht ändern, ausser Elemente werden verschoben.

#### Bestandteile (in dieser Reihenfolge im SVG)

| # | Element | Beschreibung |
|---|---------|--------------|
| 1–5 | `<path>` × 5 | Buchstaben P, H, O, R, O als individuelle SVG-Pfade |
| 6 | `<path>` | Dekorativer geschwungener Bogen unter dem gesamten Schriftzug (x≈84 bis x≈239) |
| 7 | `<rect>` | Strahl 1 — vertikaler Strich, rechts oben |
| 8 | `<rect>` | Strahl 2 — 45°-gedrehter Strich |
| 9 | `<rect>` | Strahl 3 — 90°-gedrehter (horizontaler) Strich |

#### Die drei Strahlen (Sun-Rays / Leuchtturm-Motiv)

Drei `<rect>`-Elemente bilden eine fächerartige Progression von vertikal nach horizontal:

```xml
<!-- Strahl 1: vertikal -->
<rect fill="FARBE" x="229.2" y="40.2" width="4.5" height="12.1" rx="2.3" ry="2.3"/>

<!-- Strahl 2: 45° gedreht -->
<rect fill="FARBE" x="246.4" y="47.4" width="4.5" height="12.1" rx="2.3" ry="2.3"
      transform="translate(110.7 -160.2) rotate(45)"/>

<!-- Strahl 3: 90° gedreht (horizontal) -->
<rect fill="FARBE" x="253.5" y="64.8" width="4.5" height="12.1" rx="2.3" ry="2.3"
      transform="translate(326.6 -184.9) rotate(90)"/>
```

Alle drei haben:
- **Gleiche Grösse:** `4.5 × 12.1` SVG-Einheiten
- **Abgerundete Enden:** `rx="2.3" ry="2.3"` (Pill-Form)
- **Gleiche Farbe** wie die Buchstaben

Die `transform`-Werte (`translate` + `rotate`) sind exakt kalibriert — der `translate` korrigiert den Drehpunkt. **Nicht manuell anpassen**, sondern 1:1 übernehmen.

#### Der Bogen

Der Bogen (Element 6) ist ein einziger langer `<path>`, der sich unter dem gesamten "PHORO"-Schriftzug erstreckt. Er kann eine leicht abweichende Farbe haben (in der Referenz: Buchstaben `#1c3d5a`, Bogen `#214057` — etwas dunkler). Optional, je nach Farbkonzept.

#### SVG-Datei übernehmen

Die SVG-Datei 1:1 aus dem Referenzprojekt kopieren. Die Pfade für P-H-O-R-O sind für **alle PHORO-Produkte identisch**. Nur die `fill`-Attribute auf die eigenen Farben ändern (6× Buchstaben/Strahlen, 1× Bogen).

### 10.3 Der Produktname als HTML-Text

Der Produktname wird **nicht** ins SVG gepackt, sondern als separates HTML-Element daneben gesetzt.

**Warum so?**
- Skaliert unabhängig vom SVG
- Nutzt die System-Schriftart (Lexend via `next/font`)
- Lässt sich per Tailwind stylen
- Die Baseline-Ausrichtung zum SVG wird über `margin-bottom` feingesteuert

#### Markup (Desktop & Mobile Input — Standardgrösse)

```tsx
<div className="flex items-end gap-1.5">
  <img src="/logo-phoro.svg" alt="PHORO" className="h-10" />
  <span className="text-FARBE_ACCENT text-lg font-light tracking-wide mb-2">
    produktname
  </span>
</div>
```

#### Markup (Kompakte Variante, z.B. Mobile Reading Header)

```tsx
<div className="flex items-end gap-1 mx-auto">
  <img src="/logo-phoro.svg" alt="PHORO" className="h-8" />
  <span className="text-FARBE_ACCENT text-base font-light tracking-wide mb-1.5">
    produktname
  </span>
</div>
```

#### Tailwind-Klassen erklärt

| Klasse | Wert | Zweck |
|--------|------|-------|
| `flex items-end` | — | Flex-Container, Kinder am **unteren Rand** ausgerichtet |
| `gap-1.5` / `gap-1` | 6px / 4px | Horizontaler Abstand zwischen SVG und Text |
| `h-10` / `h-8` | 40px / 32px | SVG-Höhe (Standard / Kompakt) |
| `text-lg` / `text-base` | 18px / 16px | Schriftgrösse des Produktnamens |
| `font-light` | weight 300 | Dünner Schriftschnitt — Kontrast zum kräftigen SVG |
| `tracking-wide` | letter-spacing 0.05em | Leicht gesperrte Buchstaben |
| `mb-2` / `mb-1.5` | 8px / 6px | **Vertikale Baseline-Korrektur** (siehe unten) |

#### Die `mb-2` / `mb-1.5` Baseline-Korrektur

Das ist das Herzstück der Ausrichtung. `items-end` allein reicht nicht, weil:
- Das SVG hat den Bogen am unteren Rand → die visuell wahrgenommene Unterkante der Buchstaben sitzt **höher** als der SVG-Rand
- Der Text hat eine Descender-Line (bei "g", "y", "p") → die Baseline sitzt **höher** als der tatsächliche untere Textrand

Der `margin-bottom` auf dem `<span>` korrigiert das, sodass der Produktname visuell auf derselben Höhe wie die PHORO-Buchstaben im SVG sitzt — **nicht** auf Höhe des Bogens.

**Zum Kalibrieren:** Wert schrittweise anpassen (`mb-1`, `mb-1.5`, `mb-2`, `mb-2.5`), bis die Unterkante des Textes bündig mit der Unterkante der SVG-Buchstaben (nicht des Bogens!) aussieht.

### 10.4 Grössentabelle

| Kontext | SVG-Höhe | Gap | Textgrösse | mb-Korrektur |
|---------|----------|-----|------------|--------------|
| Desktop Header | `h-10` (40px) | `gap-1.5` (6px) | `text-lg` (18px) | `mb-2` (8px) |
| Mobile Input Header | `h-10` (40px) | `gap-1.5` (6px) | `text-lg` (18px) | `mb-2` (8px) |
| Mobile Reading Header | `h-8` (32px) | `gap-1` (4px) | `text-base` (16px) | `mb-1.5` (6px) |

### 10.5 Header-Container

Das Logo sitzt in einem `<header>`. Drei Varianten:

#### Desktop Header (über volle Breite, zentriert)

```tsx
<header className="hidden md:flex px-4 pt-4 pb-2 border-b border-FARBE/15 bg-FARBE_HEADER flex-col items-center shrink-0">
  <div className="flex items-end gap-1.5">
    <img src="/logo-phoro.svg" alt="PHORO" className="h-10" />
    <span className="text-FARBE_ACCENT text-lg font-light tracking-wide mb-2">produktname</span>
  </div>
  <p className="text-center text-FARBE_TEXT/60 mt-1 text-sm">
    Untertitel / Tagline hier.
  </p>
</header>
```

- `hidden md:flex` → Nur ab md-Breakpoint (768px+) sichtbar
- `flex-col items-center` → Logo und Untertitel vertikal gestapelt, zentriert
- `shrink-0` → Header schrumpft nicht wenn Content scrollt

#### Mobile Input Header

```tsx
<header className="md:hidden px-4 pt-4 pb-2 border-b border-FARBE/15 bg-FARBE_HEADER flex flex-col items-center shrink-0">
  <!-- Identisches Logo-Markup wie Desktop -->
</header>
```

- `md:hidden` → Nur unter md-Breakpoint sichtbar
- Sonst identisch zum Desktop Header

#### Mobile Reading Header (kompakt, mit Zurück-Button)

```tsx
<header className="md:hidden px-4 py-3 border-b border-FARBE/15 bg-FARBE_HEADER flex items-center shrink-0">
  <Button variant="ghost" size="icon" onClick={handleBack}>
    <ArrowLeft className="h-5 w-5" />
  </Button>
  <div className="flex items-end gap-1 mx-auto">
    <img src="/logo-phoro.svg" alt="PHORO" className="h-8" />
    <span className="text-FARBE_ACCENT text-base font-light tracking-wide mb-1.5">produktname</span>
  </div>
  <div className="w-9" />
</header>
```

- `flex items-center` → Horizontales Layout (nicht `flex-col`!)
- Zurück-Button links, Logo zentriert via `mx-auto`, leeres `<div className="w-9">` rechts als Gegengewicht für die Zentrierung
- Kleineres Logo (`h-8`, `text-base`) und kein Untertitel

### 10.6 Schriftart

Der Produktname nutzt **Lexend** — die gleiche Schrift wie der Rest der App. Import via `next/font/google` im Root-Layout:

```tsx
// src/app/layout.tsx
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={lexend.className}>
      <body>{children}</body>
    </html>
  )
}
```

Der Produktname erbt die Schriftart automatisch. Gewicht `font-light` (300) wird explizit auf dem `<span>` gesetzt.

### 10.7 Brand-Regeln

- 3-Ray Sun mit Bogen — **NICHT** 8 Rays
- Tier-Farben (Dawn/Light/Beacon/Pharos) können auf die Strahlen oder den Bogen angewendet werden
- Animation: Staggered Ray Rotation, dezent, nur beim "Thinking"-State (optional)
- Favicon: Vereinfachte Version (Circle + 3 Rays)
- Wortmarke "PHORO" immer als SVG-Pfade, **nie** als Font-Text gerendert

### 10.8 Checkliste für neue Produkte

1. SVG-Datei aus dem Referenzprojekt kopieren → `public/logo-phoro.svg`
2. `fill`-Attribute im SVG auf eigene Farben ändern (6× Buchstaben/Strahlen, 1× Bogen)
3. Header-Markup mit den drei Varianten (Desktop, Mobile Input, Mobile Reading) einbauen
4. Produktname als `<span>` mit `font-light tracking-wide` — **nicht** ins SVG
5. `mb-2` Baseline-Korrektur visuell prüfen und ggf. feinjustieren (`mb-1` bis `mb-2.5`)
6. Sicherstellen, dass Lexend im Root-Layout geladen wird
7. Untertitel / Tagline anpassen
8. Auf Desktop und Mobile testen — alle drei Header-Varianten prüfen

---

## Zusammenfassung: Der PHORO-Look in einem Satz

> **Ruhig, technisch, seriös, "infrastructure-grade" – nicht didaktisch, nicht verspielt.**

Wenn es verspielt wirkt, liegt es fast immer an: zu vielen Farben, zu runden Ecken, Icons/Illustrationen, zu dicken Linien, zu wenig Weissraum, Schatten.
