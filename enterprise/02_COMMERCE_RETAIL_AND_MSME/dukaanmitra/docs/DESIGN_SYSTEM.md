# Design System Guide (v1.0)

This guide documents the design tokens, visual style, layout principles, and anti-pattern boundaries governing DukaanMitra (BazaarSync).

---

## 1. Visual Style & Theme Principles

The application is inspired by the classic **high-fidelity ledger book** combined with modern, high-contrast, minimalist software layouts (reminiscent of Stripe and Linear). 

- **The Paper Paradigm**: Rather than using sterile white backgrounds, DukaanMitra is set against a warm paper canvas (`--paper: #F3EEE0`) with subtle horizontal ledger guidelines (`--paper-line: #E2D9C2`) rendering a classic bahi-khata look.
- **Atmospheric Warm Neutrals**: Rather than using pure blacks, deep slate and indigo shades are chosen (`--ink: #1B2A4C` and `--ink-soft: #4A5578`) for clear legibility and high contrast.

---

## 2. Core Design Tokens

### 2.1 The Color System
DukaanMitra uses custom theme tokens representing specific, semantic roles:

| Token Name | Hex Code | Utility Role |
| :--- | :---: | :--- |
| `--paper` | `#F3EEE0` | Primary application canvas background |
| `--paper-line`| `#E2D9C2` | Ledger lines and thin container borders |
| `--ink` | `#1B2A4C` | Display headers, primary body text, primary dark buttons |
| `--ink-soft` | `#4A5578` | Subheadings, input labels, secondary descriptions |
| `--gold` | `#D98E04` | Brand highlights, primary call-to-actions, category tags |
| `--gold-soft` | `#F3D9A0` | Light amber buttons, alert borders, icon backgrounds |
| `--red` | `#B23A2F` | Debt values, stock-out alerts, decrease indicators |
| `--red-soft` | `#F1D9D4` | High-alert backgrounds, deleted log details |
| `--green` | `#2F7D5C` | Payments collected, stock-in increments, WhatsApp links |
| `--green-soft`| `#D7E8DE` | Confirmed receipts, active sync indicators |
| `--card` | `#FBF8F0` | Primary content panels and cards |

### 2.2 Typographic Hierarchy
DukaanMitra pairs classic display typography with clean sans-serif and monospace fonts:

- **Display Headings**: **Fraunces** (serif) — Used exclusively for brand banners, store titles, and critical h2 page titles (e.g. `font-family: 'Fraunces', serif;`).
- **Body & Labels**: **Inter** (sans-serif) — Used for list items, inputs, navigation, and description blocks.
- **Numerical & Financial Data**: **IBM Plex Mono** (monospace) — Used for currencies, transaction amounts, timestamps, and barcodes (e.g. `font-family: 'IBM Plex Mono', monospace;`).

### 2.3 Mathematical Spacing
Following the **8-point grid rule**, all element margins, paddings, and flex gap attributes are designed in increments of 8px (or 4px for tight element clusters):
- **Container Padding**: Standard card components always feature `padding: 16px;`.
- **Button Sizing**: Vertical padding is exactly 12px or 14px, with horizontal paddings keeping a balanced proportion.
- **Outer Margins**: Major sections use `margin-bottom: 12px;` or `margin-bottom: 16px;` to maintain visual breathing space.

---

## 3. Anti-Slop Visual Rules (Strict Negative Constraints)

To prevent the low-fidelity "AI template" look, we adhere to the following visual boundaries:
1. **No Gradients**: Never use purple-to-blue background gradients, cyan highlights, or neon glowing borders. All actions rely on flat, organic colors.
2. **Rounded Corners Consistency**: Card elements must be restricted to a radius of `16px` (`rounded-2xl` in Tailwind), and primary buttons use `14px` (`rounded-xl`). Extreme capsule pills are reserved strictly for filters and status tags.
3. **No Nested Cards**: Do not render cards inside cards. Group content using dashed separators or subtle spacing dividers.
4. **Legible Contrast**: Never render gray text on gold or green button backgrounds. All labels on colored button surfaces must be pure white (`#FFF`).
5. **No Clutter**: Hide secondary features under progressive disclosure buttons (e.g., hidden drawer panels) to reduce user cognitive load.
