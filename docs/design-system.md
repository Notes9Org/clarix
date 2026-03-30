# Clarix Design System

> **Principle: Grayscale first. Color only when it means something.**
> Inspired by Uber's Base system, VS Code's theme model, and Astra's shadcn/Tailwind v4 implementation.

---

## 0. Philosophy

### The Uber Rule

Uber's design philosophy uses neutral grayscale for 90% of the UI and reserves color for **meaning only** — not decoration. This reduces visual noise, improves scanning speed, and lets critical signals (red = danger, amber = caution, green = clear) cut through instantly. In a cleanroom pharmaceutical environment, this discipline is non-negotiable: a technician must read a deviation alert in 0.3 seconds without hunting for it.

### The VS Code Rule

Theme must be a first-class citizen. Users choose from a **scale** (light → mid → dark), not from arbitrary color palettes. Every token is semantic (`--background`, `--foreground`, `--muted`) so swapping a theme swaps the entire visual character instantly. The user should be able to move between "White" and "Black" just like switching VS Code themes.

### HCI Principles Applied

| Principle                             | Application in Clarix                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Fitts's Law**                 | Action buttons sized ≥ 36px web, ≥ 56px iPad. Primary action always bottom-right or full-width on mobile. |
| **Hick's Law**                  | Never show > 7 options in a single interaction. Role-conditional nav hides irrelevant items entirely.       |
| **Signal vs. Noise**            | Grayscale base eliminates chromatic noise. Only 5 semantic colors permitted in the entire app.              |
| **Recognition over Recall**     | Status badges always combine icon + text + color (never color-only — colorblind-accessible).               |
| **Error Prevention**            | Tolerances shown inline before entry. Destructive actions require confirmation + reason text.               |
| **Consistency**                 | All tables look the same. All modals behave the same. All forms validate the same way.                      |
| **Visibility of System Status** | Every async operation shows a spinner in the button. Every offline state shows a persistent banner.         |

---

## 1. Theme Architecture

### 1.1 Theme Scales (VS Code Model)

Clarix offers **two axes of theme control**:

**Axis 1: Lightness Scale** (like VS Code light/dark toggle)

| Class                                    | Description                              | Background           | Foreground           |
| ---------------------------------------- | ---------------------------------------- | -------------------- | -------------------- |
| `.theme-scale-white`                   | Pure white canvas. Most airy.            | `oklch(1 0 0)`     | `oklch(0.145 0 0)` |
| `.theme-scale-light` *(default)*     | Warm off-white. Like paper.              | `oklch(0.985 0 0)` | `oklch(0.145 0 0)` |
| `.theme-scale-mid`                     | Mid-gray canvas. Low fatigue.            | `oklch(0.93 0 0)`  | `oklch(0.145 0 0)` |
| `.theme-scale-dim`                     | Dimmed environment. Like VS Code "Gray". | `oklch(0.22 0 0)`  | `oklch(0.94 0 0)`  |
| `.theme-scale-dark` *(dark default)* | True dark. Like VS Code "Dark+".         | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `.theme-scale-black`                   | OLED black. Maximum contrast.            | `oklch(0.08 0 0)`  | `oklch(0.985 0 0)` |

**Axis 2: Accent Color** (only affects interactive primary elements — buttons, links, active nav, focus rings)

| Class                                   | Accent                   | Use Case                        |
| --------------------------------------- | ------------------------ | ------------------------------- |
| `.theme-accent-neutral` *(default)* | Pure gray/black          | Maximum grayscale — Uber-style |
| `.theme-accent-blue`                  | `oklch(0.55 0.18 240)` | Classic product blue            |
| `.theme-accent-slate`                 | `oklch(0.45 0.03 240)` | Slate-toned neutral             |

> **Rule:** Accent color ONLY affects `--primary`, `--ring`, and `--sidebar-primary`. Nothing else picks an accent color. Status colors are always semantic and never change with accent.

### 1.2 Full Token Map

```css
/* ─── LIGHT DEFAULT (theme-scale-light + theme-accent-neutral) ─── */
:root,
.theme-scale-light {
  /* Canvas */
  --background:            oklch(0.985 0 0);   /* near-white */
  --foreground:            oklch(0.145 0 0);   /* near-black */

  /* Surfaces (card, popover, sidebar) */
  --card:                  oklch(1 0 0);        /* pure white card */
  --card-foreground:       oklch(0.145 0 0);
  --popover:               oklch(1 0 0);
  --popover-foreground:    oklch(0.145 0 0);
  --sidebar:               oklch(0.975 0 0);   /* slightly off-white */
  --sidebar-foreground:    oklch(0.145 0 0);
  --sidebar-border:        oklch(0.918 0 0);
  --sidebar-ring:          oklch(0.708 0 0);
  --sidebar-accent:        oklch(0.955 0 0);
  --sidebar-accent-foreground: oklch(0.145 0 0);

  /* Primary (interactive — changes with accent) */
  --primary:               oklch(0.145 0 0);   /* black buttons */
  --primary-foreground:    oklch(0.985 0 0);   /* white text on black */
  --sidebar-primary:       oklch(0.145 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);

  /* Secondary / Muted / Accent */
  --secondary:             oklch(0.955 0 0);   /* light gray surfaces */
  --secondary-foreground:  oklch(0.145 0 0);
  --muted:                 oklch(0.955 0 0);   /* section backgrounds */
  --muted-foreground:      oklch(0.50 0 0);    /* secondary text */
  --accent:                oklch(0.945 0 0);   /* hover backgrounds */
  --accent-foreground:     oklch(0.145 0 0);

  /* Borders & Inputs */
  --border:                oklch(0.918 0 0);   /* table lines, card edges */
  --input:                 oklch(0.918 0 0);   /* input borders */
  --ring:                  oklch(0.708 0 0);   /* focus rings */

  /* Status — NEVER change with theme or accent */
  --status-success:        oklch(0.52 0.17 142);   /* emerald */
  --status-success-bg:     oklch(0.95 0.04 142);
  --status-warning:        oklch(0.62 0.16 75);    /* amber */
  --status-warning-bg:     oklch(0.97 0.04 90);
  --status-error:          oklch(0.58 0.22 25);    /* red */
  --status-error-bg:       oklch(0.97 0.04 25);
  --status-info:           oklch(0.55 0.18 240);   /* blue */
  --status-info-bg:        oklch(0.96 0.04 240);
  --destructive:           oklch(0.58 0.22 25);

  /* Radius */
  --radius:                0.5rem;    /* matches Astra's 0.625rem, slightly tighter */

  /* Charts — grayscale by default, vivid in alternate accent modes */
  --chart-1:  oklch(0.30 0 0);
  --chart-2:  oklch(0.45 0 0);
  --chart-3:  oklch(0.60 0 0);
  --chart-4:  oklch(0.73 0 0);
  --chart-5:  oklch(0.86 0 0);
}

/* ─── DARK DEFAULT (theme-scale-dark + theme-accent-neutral) ─── */
.dark,
.theme-scale-dark {
  --background:            oklch(0.145 0 0);
  --foreground:            oklch(0.95 0 0);
  --card:                  oklch(0.20 0 0);
  --card-foreground:       oklch(0.95 0 0);
  --popover:               oklch(0.20 0 0);
  --popover-foreground:    oklch(0.95 0 0);
  --sidebar:               oklch(0.18 0 0);
  --sidebar-foreground:    oklch(0.95 0 0);
  --sidebar-border:        oklch(1 0 0 / 8%);
  --sidebar-ring:          oklch(0.45 0 0);
  --sidebar-accent:        oklch(0.26 0 0);
  --sidebar-accent-foreground: oklch(0.95 0 0);
  --primary:               oklch(0.92 0 0);
  --primary-foreground:    oklch(0.145 0 0);
  --sidebar-primary:       oklch(0.92 0 0);
  --sidebar-primary-foreground: oklch(0.145 0 0);
  --secondary:             oklch(0.26 0 0);
  --secondary-foreground:  oklch(0.95 0 0);
  --muted:                 oklch(0.26 0 0);
  --muted-foreground:      oklch(0.60 0 0);
  --accent:                oklch(0.26 0 0);
  --accent-foreground:     oklch(0.95 0 0);
  --border:                oklch(1 0 0 / 10%);
  --input:                 oklch(1 0 0 / 12%);
  --ring:                  oklch(0.50 0 0);
  --destructive:           oklch(0.65 0.20 25);

  /* Status — identical semantic colors, slightly brighter for dark contexts */
  --status-success:        oklch(0.60 0.17 142);
  --status-success-bg:     oklch(0.20 0.04 142);
  --status-warning:        oklch(0.70 0.16 75);
  --status-warning-bg:     oklch(0.20 0.04 90);
  --status-error:          oklch(0.65 0.22 25);
  --status-error-bg:       oklch(0.20 0.04 25);
  --status-info:           oklch(0.65 0.18 240);
  --status-info-bg:        oklch(0.20 0.04 240);

  --chart-1:  oklch(0.85 0 0);
  --chart-2:  oklch(0.70 0 0);
  --chart-3:  oklch(0.55 0 0);
  --chart-4:  oklch(0.40 0 0);
  --chart-5:  oklch(0.28 0 0);
}

/* ─── SCALE VARIANTS ─── */
.theme-scale-white {
  --background: oklch(1 0 0);
  --card: oklch(0.99 0 0);
  --sidebar: oklch(0.99 0 0);
}

.theme-scale-mid {
  --background: oklch(0.93 0 0);
  --card: oklch(0.97 0 0);
  --sidebar: oklch(0.90 0 0);
  --border: oklch(0.875 0 0);
  --input: oklch(0.875 0 0);
}

.theme-scale-dim {
  --background: oklch(0.22 0 0);
  --card: oklch(0.27 0 0);
  --sidebar: oklch(0.20 0 0);
  --foreground: oklch(0.94 0 0);
  --primary: oklch(0.92 0 0);
  --primary-foreground: oklch(0.20 0 0);
  --border: oklch(1 0 0 / 9%);
  --input: oklch(1 0 0 / 12%);
  --muted: oklch(0.28 0 0);
  --muted-foreground: oklch(0.60 0 0);
}

.theme-scale-black {
  --background: oklch(0.075 0 0);
  --card: oklch(0.13 0 0);
  --sidebar: oklch(0.10 0 0);
  --foreground: oklch(0.97 0 0);
  --primary: oklch(0.97 0 0);
  --primary-foreground: oklch(0.075 0 0);
  --border: oklch(1 0 0 / 8%);
  --input: oklch(1 0 0 / 10%);
  --muted: oklch(0.17 0 0);
  --muted-foreground: oklch(0.55 0 0);
}

/* ─── ACCENT VARIANTS (only override primary + ring + sidebar-primary) ─── */
.theme-accent-blue {
  --primary:               oklch(0.47 0.16 240);
  --primary-foreground:    oklch(0.97 0 0);
  --sidebar-primary:       oklch(0.47 0.16 240);
  --sidebar-primary-foreground: oklch(0.97 0 0);
  --ring:                  oklch(0.65 0.14 240);
}

.dark .theme-accent-blue,
.theme-scale-dark .theme-accent-blue,
.theme-scale-dim .theme-accent-blue,
.theme-scale-black .theme-accent-blue {
  --primary:               oklch(0.60 0.16 240);
  --sidebar-primary:       oklch(0.55 0.16 240);
  --ring:                  oklch(0.45 0.15 240);
}

.theme-accent-slate {
  --primary:               oklch(0.42 0.04 240);
  --primary-foreground:    oklch(0.97 0 0);
  --sidebar-primary:       oklch(0.42 0.04 240);
  --sidebar-primary-foreground: oklch(0.97 0 0);
  --ring:                  oklch(0.62 0.04 240);
}
```

---

## 2. Typography

### 2.1 Fonts (matches Astra)

| Role                                                     | Font       | Variable                   |
| -------------------------------------------------------- | ---------- | -------------------------- |
| **Sans-serif (default)**                           | Geist Sans | `var(--font-geist-sans)` |
| **Monospace (batch IDs, lot numbers, timestamps)** | Geist Mono | `var(--font-geist-mono)` |
| **Alternative (tablet-optimized)**                 | Inter      | `var(--font-inter)`      |

> Geist is chosen for its excellent legibility at small sizes (critical for dense table cells) and its neutral character that supports grayscale-first design without "character."

### 2.2 Type Scale

Inherits Astra's `--text-*` scale. The `theme-scale-*` variants use the same scaled text as Astra's `theme-scaled`:

| Token           | Default Value   | Desktop (scaled)  |
| --------------- | --------------- | ----------------- |
| `--text-xs`   | 0.75rem / 12px  | 0.75rem           |
| `--text-sm`   | 0.875rem / 14px | **0.80rem** |
| `--text-base` | 1rem / 16px     | **0.85rem** |
| `--text-lg`   | 1.125rem / 18px | **1.00rem** |
| `--text-xl`   | 1.25rem / 20px  | **1.10rem** |
| `--text-2xl`  | 1.5rem / 24px   | **1.20rem** |
| `--text-3xl`  | 1.875rem / 30px | **1.30rem** |

### 2.3 Typography Rules

| Element                 | Size                  | Weight       | Color                  |
| ----------------------- | --------------------- | ------------ | ---------------------- |
| Page title (H1)         | `text-2xl`          | 600 semibold | `foreground`         |
| Section heading (H2)    | `text-lg`           | 600 semibold | `foreground`         |
| Card title              | `text-sm`           | 600 semibold | `foreground`         |
| Card description        | `text-sm`           | 400          | `muted-foreground`   |
| Table header            | `text-sm`           | 500          | `foreground`         |
| Table cell              | `text-sm`           | 400          | `foreground`         |
| Secondary/meta text     | `text-xs`           | 400          | `muted-foreground`   |
| Button (default)        | `text-sm`           | 500          | `primary-foreground` |
| Batch IDs / Lot numbers | `text-sm font-mono` | 400          | `foreground`         |
| Timestamps              | `text-xs font-mono` | 400          | `muted-foreground`   |
| Status badge            | `text-xs`           | 500          | semantic               |

---

## 3. Spacing & Sizing

Inherits Astra's 4pt base grid (`--spacing: 0.25rem`).

### 3.1 Component Sizes (matches Astra exactly)

#### Buttons

| Size                   | Height          | H-Padding | Font        | Use When                  |
| ---------------------- | --------------- | --------- | ----------- | ------------------------- |
| `xs`                 | `h-6` (24px)  | `px-2`  | `text-xs` | Inline table actions      |
| `sm`                 | `h-8` (32px)  | `px-3`  | `text-sm` | Secondary toolbar actions |
| `default`            | `h-9` (36px)  | `px-4`  | `text-sm` | Primary forms, dialogs    |
| `lg`                 | `h-10` (40px) | `px-6`  | `text-sm` | Page-level CTAs           |
| **iPad primary** | `h-14` (56px) | `px-8`  | `text-lg` | Cleanroom touch targets   |

#### Inputs

| Context              | Height          | Font                   |
| -------------------- | --------------- | ---------------------- |
| Web default          | `h-9` (36px)  | `text-sm`            |
| Web large            | `h-10` (40px) | `text-base`          |
| iPad (numeric entry) | `h-16` (64px) | `text-3xl font-mono` |

#### Tables (matches Astra's `table.tsx`)

| Element            | Spec                                                            |
| ------------------ | --------------------------------------------------------------- |
| Header cell height | `h-10` (40px) via `th`                                      |
| Body cell padding  | `p-2` (8px)                                                   |
| Row hover          | `hover:bg-muted/50`                                           |
| Header text        | `text-sm font-medium text-foreground`                         |
| Border style       | `border-b` (bottom only — horizontal-only rules, Uber-style) |
| Striped rows       | `even:bg-muted/30` (optional, off by default)                 |

#### Cards (matches Astra's `card.tsx`)

| Property       | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Background     | `bg-card`                                              |
| Border         | `border border-border`                                 |
| Border radius  | `rounded-xl`                                           |
| Padding        | `py-6` vertical, `px-6` horizontal                   |
| Gap (internal) | `gap-6` between header/content/footer                  |
| Shadow         | `shadow-sm` (light mode) / `shadow-none` (dark mode) |

### 3.2 Layout Grid

| Zone                   | Width                            |
| ---------------------- | -------------------------------- |
| Sidebar (collapsed)    | `w-16` (64px) — icon only     |
| Sidebar (expanded)     | `w-60` (240px)                 |
| Main content max-width | `max-w-7xl` (1280px)           |
| Page padding           | `px-6 py-6`                    |
| Card grid gap          | `gap-4`                        |
| Section gap            | `gap-6` between major sections |

---

## 4. Color Semantics — The Only 5 Allowed Colors

> **Rule: If it's not one of these 5, use gray.**

| Semantic Role                                             | Light Token                  | Dark Token       | When to Use                                            |
| --------------------------------------------------------- | ---------------------------- | ---------------- | ------------------------------------------------------ |
| **Success / Released / Within Spec / Clean EM**     | `--status-success` emerald | brighter emerald | Batch released, lot passed QC, EM clean, tolerance met |
| **Warning / Pending / Alert Limit / Due Soon**      | `--status-warning` amber   | brighter amber   | Pending review, approaching limit, calibration due     |
| **Error / Rejected / OOS / Action Limit / Overdue** | `--status-error` red       | brighter red     | Rejection, OOS value, excursion, overdue CAPA          |
| **Info / In Progress / Active / Link**              | `--status-info` blue       | brighter blue    | In-progress batches, links, informational notices      |
| **Destructive**                                     | `--destructive` red        | brighter red     | Delete actions, form validation errors                 |

### 4.1 Status Badge Spec

All status indicators MUST use **all three channels**: icon + text + color (never color-alone — colorblind accessible).

```text
<CheckCircle2 />  Released        → emerald bg, "Released" text
<Clock />         Pending Review  → amber bg, "Pending Review" text
<XCircle />       Rejected        → red bg, "Rejected" text
<Loader2 />       In Progress     → blue bg, "In Progress" text  (animate-spin class)
<FileEdit />      Draft           → muted bg, "Draft" text        ← gray
<Lock />          Quarantined     → muted bg, "Quarantined" text  ← gray
```

**Badge CSS pattern:**

```css
/* Success badge */
.badge-success {
  background: var(--status-success-bg);
  color: var(--status-success);
  border: 1px solid color-mix(in oklch, var(--status-success) 20%, transparent);
}

/* Warning badge */
.badge-warning {
  background: var(--status-warning-bg);
  color: var(--status-warning);
  border: 1px solid color-mix(in oklch, var(--status-warning) 20%, transparent);
}

/* Default / draft — always gray */
.badge-neutral {
  background: var(--muted);
  color: var(--muted-foreground);
  border: 1px solid var(--border);
}
```

---

## 5. Component Design Rules

### 5.1 Navigation Sidebar

- Default collapsed: icons only. Hover expands. Active state: `bg-accent text-foreground` (gray, not colored)
- Active with accent: active item shows a left-border `border-l-2 border-primary` + `bg-accent`
- Section headers: `text-xs uppercase text-muted-foreground tracking-wider font-medium`
- No colored icons in nav — all `text-muted-foreground`, active = `text-foreground`

### 5.2 Data Tables

- **Column headers**: left-aligned, `text-sm font-medium text-foreground`. Sortable with `↑↓` icons. No background fill.
- **Rows**: `border-b border-border`. Hover = `bg-muted/40`. Selected = `bg-muted`.
- **Numeric cells** (weights, quantities, pH): right-aligned, `font-mono text-sm`.
- **Status cells**: use badge component.
- **Action cells**: right-aligned icon buttons, `size-icon-sm variant-ghost`.
- **Empty state**: centered, `text-muted-foreground`, an icon + heading + optional CTA.
- **Loading state**: skeleton rows, matching row height.
- **No zebra striping by default.** Clean white rows. Hover provides enough affordance.

### 5.3 Forms

- Label above input, `text-sm font-medium text-foreground mb-1`.
- Helper text below, `text-xs text-muted-foreground`.
- Error text below, `text-xs text-destructive`.
- Input height `h-9` (web), `h-16` (iPad numeric).
- Required fields: asterisk `*` after label, `text-destructive`.
- All forms show validation state inline — never a toast for validation errors.

### 5.4 KPI / Stat Cards

```text
+---------------------------+
|  Label (text-sm muted)    |
|                           |
|  VALUE (text-3xl semi)    |
|                           |
|  ^ +12% vs last week      |  <- text-xs muted
+---------------------------+
```

- Cards are always white (`bg-card`), never colored backgrounds for KPI cards.
- The value can be colored ONLY if it represents a status (e.g., "0 Deviations" = no color, "3 Deviations" = red text).
- Trend indicators: `↑` green / `↓` red — only for directional metrics. Not for count metrics.

### 5.5 Alerts & Banners

```css
/* In-page alert */
.alert-success  { border-left: 3px solid var(--status-success); background: var(--status-success-bg); }
.alert-warning  { border-left: 3px solid var(--status-warning); background: var(--status-warning-bg); }
.alert-error    { border-left: 3px solid var(--status-error);   background: var(--status-error-bg);   }
.alert-info     { border-left: 3px solid var(--status-info);    background: var(--status-info-bg);    }
```

- Alerts use left-border accent + very light semantic background.
- NOT colorful full-background banners.
- Dismiss button (`×`) on the right.
- Icon on the left, always.

### 5.6 E-Signature Modal (iPad specific)

- Full-screen takeover (prevent accidental dismissal)
- Dark gray overlay behind: `bg-black/60`
- Modal: `bg-card`, `rounded-2xl`, `p-8`
- Large PIN dots: `size-5` filled circles, `gap-4`
- Biometric prompt: full-width button, `h-14`
- Shows: signer name, role, action being signed, timestamp
- Cannot be dismissed without either completing auth or explicit "Cancel"

---

## 6. iPad-Specific Rules

| Rule                      | Spec                                                            | Reason                                 |
| ------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| Minimum tap target        | 56×56px                                                        | Nitrile gloves degrade touch precision |
| No hover states           | Use active/pressed states instead                               | iPads are touch-only                   |
| Orientation               | Landscape locked on batch execution screens                     | More horizontal space for data         |
| Font size (instructions)  | `text-xl` (20px+)                                             | Readable through face shield           |
| Font size (numeric input) | `text-4xl font-mono` (36px+)                                  | Clear value reading                    |
| Inputs                    | Full-width,`h-14` min                                         | Easy target, readable at arm's length  |
| Primary action button     | Full-width,`h-14`, at bottom of screen                        | Thumb reach from landscape grip        |
| Step navigation           | Single back arrow, never swipeable                              | Prevent accidental step navigation     |
| Confirmation modals       | Always require explicit typed/signed acknowledgment             | No accidental dismissal                |
| Offline indicator         | Persistent amber banner at top: "Offline — data saved locally" | Always visible, non-dismissible        |

---

## 7. Theme Switcher Implementation

### 7.1 How Themes Compose

Apply `theme-scale-*` on `<html>` or `<body>`. Apply `theme-accent-*` next to it. The `dark` class from system preference or explicit toggle enables dark-mode semantics.

```html
<!-- Example: Dark + Black scale + Blue accent -->
<html class="dark theme-scale-black theme-accent-blue">

<!-- Example: Light default + Neutral accent (Uber-style) -->
<html class="theme-scale-light theme-accent-neutral">

<!-- Example: Mid-gray + Neutral (cleanroom low-fatigue) -->
<html class="theme-scale-mid theme-accent-neutral">
```

### 7.2 Persisted User Preference

```ts
// Stored in localStorage: clarix-theme-scale + clarix-theme-accent
const SCALE_OPTIONS = [
  { id: 'white',  label: 'White',   preview: '#FFFFFF' },
  { id: 'light',  label: 'Light',   preview: '#FAFAFA' },  // default
  { id: 'mid',    label: 'Gray',    preview: '#EDEDED' },
  { id: 'dim',    label: 'Dim',     preview: '#383838' },
  { id: 'dark',   label: 'Dark',    preview: '#252525' },  // default dark
  { id: 'black',  label: 'Black',   preview: '#131313' },
]

const ACCENT_OPTIONS = [
  { id: 'neutral', label: 'Neutral', preview: '#000000' }, // default
  { id: 'blue',    label: 'Blue',    preview: '#3b82f6' },
  { id: 'slate',   label: 'Slate',   preview: '#64748b' },
]
```

### 7.3 Theme Picker UI

A compact palette picker in the user profile dropdown:

```text
Scale:   o o * o o o    (6 grayscale swatches: White -> Black)
Accent:  * o o           (3 options: Neutral - Blue - Slate)
```

---

## 8. Iconography

### 8.1 Library Decision: Lucide

Clarix uses **Lucide** (`lucide-react`) — the same library already used in Astra's `packages/ui`. This is the right choice for this project for three concrete reasons:

| Criteria | Lucide | Phosphor | Heroicons |
| -------- | ------ | -------- | --------- |
| **shadcn/ui native** | Yes — already wired in `components.json` | No | No |
| **Icon coverage** | 1,500+ consistent glyphs | 9,000+ (6 weights) | 300 curated |
| **Stroke consistency** | Single `strokeWidth` prop — visually uniform | Weight system adds complexity | Outline/solid only |
| **Astra alignment** | Direct match — zero config overhead | Requires new dep + alias | Requires new dep |
| **Grayscale suitability** | Thin stroke look scales cleanly in gray | Bold/duotone weights clash with grayscale-first | Solid variant too heavy for dense tables |

**Install:** Already present in Astra monorepo via `lucide-react`. No additional setup needed.

### 8.2 Usage Rules

- **Import**: `import { IconName } from 'lucide-react'`
- **Default size**: `size-4` (16px) in buttons/table cells, `size-5` (20px) in standalone contexts, `size-6` (24px) on iPad
- **Stroke width**: `strokeWidth={1.5}` default (Lucide default). Use `strokeWidth={2}` only for emphasis in empty states or primary actions.
- **Color**: Always `currentColor` — inherited from the surrounding text. Never hardcoded fill colors on icons.
- **Animation**: Only `className="animate-spin"` on `<Loader2 />`. No other icon animations.

### 8.3 Status Icon Map (always paired with text — never icon alone)

| Context | Icon | Lucide Name |
| ------- | ---- | ----------- |
| Success / Released / Within Spec | `<CheckCircle2 />` | `CheckCircle2` |
| Warning / Pending Review / Alert | `<Clock />` | `Clock` |
| Error / Rejected / OOS / Overdue | `<XCircle />` | `XCircle` |
| Info / In Progress (with spin) | `<Loader2 className="animate-spin" />` | `Loader2` |
| Draft | `<FileEdit />` | `FileEdit` |
| Quarantined / Locked | `<Lock />` | `Lock` |
| Deviation / Excursion | `<AlertTriangle />` | `AlertTriangle` |
| E-Signature Required | `<Fingerprint />` | `Fingerprint` |
| Offline | `<WifiOff />` | `WifiOff` |
| Scan / Barcode | `<ScanBarcode />` | `ScanBarcode` |
| Calibration / Equipment | `<Gauge />` | `Gauge` |
| Temperature / EM | `<Thermometer />` | `Thermometer` |
| CAPA / Corrective Action | `<ClipboardCheck />` | `ClipboardCheck` |
| Formula / Recipe | `<FlaskConical />` | `FlaskConical` |
| Lab Sample | `<TestTube2 />` | `TestTube2` |
| Inventory / Warehouse | `<Boxes />` | `Boxes` |
| Vendor | `<Truck />` | `Truck` |
| Training | `<GraduationCap />` | `GraduationCap` |
| Document / SOP | `<FileText />` | `FileText` |
| Audit Trail | `<ScrollText />` | `ScrollText` |
| User / Personnel | `<User />` | `User` |
| Report / Analytics | `<BarChart2 />` | `BarChart2` |
| Notification | `<Bell />` | `Bell` |
| Settings | `<Settings />` | `Settings` |
| Admin | `<ShieldCheck />` | `ShieldCheck` |
| Cleaning | `<Waves />` | `Waves` |
| Batch Record | `<ClipboardList />` | `ClipboardList` |
| Environmental Monitoring | `<Wind />` | `Wind` |
| Production / Manufacturing | `<Factory />` | `Factory` |

### 8.4 Navigation Icon Map

| Nav Item | Icon |
| -------- | ---- |
| Dashboard | `<LayoutDashboard />` |
| Production / Batches | `<FlaskConical />` |
| Inventory | `<Boxes />` |
| Environmental | `<Wind />` |
| Quality | `<ClipboardCheck />` |
| Equipment | `<Gauge />` |
| Cleaning | `<Waves />` |
| Training | `<GraduationCap />` |
| Lab | `<TestTube2 />` |
| Reports | `<BarChart2 />` |
| Admin | `<ShieldCheck />` |
| Notifications | `<Bell />` |
| User Profile | `<User />` |

---

## 9. Motion & Animation

**Principle: Motion communicates state change. Not decoration.**

| Motion                    | Duration              | Easing   | When            |
| ------------------------- | --------------------- | -------- | --------------- |
| Sidebar expand/collapse   | 200ms                 | ease-out | User toggle     |
| Modal open                | 150ms scale + fade    | ease-out | Dialog open     |
| Toast notification        | 200ms slide-in        | ease-out | System feedback |
| Table row highlight       | 300ms background      | ease     | Row updated     |
| Step completion checkmark | 400ms scale 0→1      | spring   | Step signed     |
| Spinner                   | 750ms infinite rotate | linear   | Loading states  |
| Page transition           | 150ms fade            | ease     | Route change    |

**No**: parallax, decorative floating animations, scroll-triggered reveals. These are distracting in a work tool.

---

## 10. Accessibility Minimums

| Requirement           | Standard                         | Implementation                                                        |
| --------------------- | -------------------------------- | --------------------------------------------------------------------- |
| Text contrast         | WCAG AA (4.5:1 body, 3:1 large)  | All `foreground` on `background` combinations checked in oklch    |
| Focus visible         | WCAG 2.1 §2.4.7                 | `focus-visible:ring-[3px]` on all interactive elements (from Astra) |
| Status not color-only | WCAG 1.4.1                       | Badge: icon + text + color always                                     |
| Touch target          | WCAG 2.5.5 AA (44px), AAA (56px) | iPad: 56px, Web: 36-40px                                              |
| Keyboard navigation   | WCAG 2.1.1                       | Radix UI primitives handle this                                       |
| Screen reader         | WCAG 1.3.1                       | Semantic HTML,`aria-label` on icon-only buttons                     |
| Error identification  | WCAG 3.3.1                       | Inline error text +`aria-invalid` on inputs                         |

---

## 11. What NOT To Do

| Do Not | Do Instead |
| ------ | ---------- |
| Use color to differentiate categories of data | Use shape/position/labels |
| Use dark navy (`#0F172A`) backgrounds by default | Use `theme-scale-dark` only when user chooses |
| Colorful sidebar with gradient background | Neutral sidebar with a single left-border active indicator |
| Big colorful KPI card backgrounds | White card, semantic text color for status values only |
| Animated hero sections or decorative motion | Only functional motion (state transitions) |
| Toasts for form validation errors | Inline field-level errors |
| Abbreviations without tooltips | `title` attr or `<Tooltip>` from Radix |
| Different button shapes per context | Consistent `rounded-md` from Astra's button sizes |
| Use emoji characters in UI or documentation | Use Lucide icon references (`<IconName />`) throughout |

---

*Author: Nithin (Solo Developer / Product Lead)*
*Aligned with: Astra monorepo `packages/ui`, shadcn/ui New York style, Tailwind v4, Lucide icons*
*Inspiration: Uber Base Design System, VS Code theme architecture, Nielsen's 10 Usability Heuristics*
