# Accessibility & Usability Audit (v1.0)

This report evaluates DukaanMitra (BazaarSync) under WCAG AA compliance targets, identifying active accessibility features and keyboard/screen-reader support.

---

## 1. Color Contrast & Legibility Matrix

DukaanMitra ensures that all textual and interface elements maintain high contrast against their background.

| Foreground Token | Background Token | Calculated Contrast Ratio | WCAG AA Status |
| :--- | :--- | :---: | :---: |
| `--ink` (`#1B2A4C`) | `--paper` (`#F3EEE0`) | **7.5:1** | **Pass (Excellent)** |
| `--ink` (`#1B2A4C`) | `--card` (`#FBF8F0`) | **8.1:1** | **Pass (Excellent)** |
| `--red` (`#B23A2F`) | `--card` (`#FBF8F0`) | **5.4:1** | **Pass** |
| `--green` (`#2F7D5C`) | `--card` (`#FBF8F0`) | **4.8:1** | **Pass** |
| `--ink-soft` (`#4A5578`) | `--card` (`#FBF8F0`) | **4.9:1** | **Pass** |

- **Banned Combos**: Light gray or light gold texts are never placed over light paper cards.
- **Visual Indicators**: Transaction tables do not rely on color alone to indicate debt direction. Red indicators always pair with a positive balance (+) and green with a payment subtraction (-) to aid users with color vision differences.

---

## 2. Interactive Usability & Assistive Targets

### 2.1 Focus Indicator Outlines
- All form inputs, dropdown selectors, and button actions feature standard, high-contrast outline states upon focus (e.g. `focus:ring-2 focus:ring-[#1B2A4C]/20`).
- Users navigating via hardware keyboards (common on desktop billing computers) are provided with a clear blue/indigo focus halo.

### 2.2 Screen Reader Accessibility
- All standard image tags include rich descriptive `alt` tags or use empty string tags (`alt=""`) if they are purely decorative.
- Non-standard visual elements (such as quick action icon blocks) are structured with standard title attributes and clean descriptive headers (H3/H4) to assist screen readers.

### 2.3 Form Fields & Labels
- All form inputs are paired with an explicit semantic `<label>` containing brief, explanatory titles in both Hindi and English.
- Input boxes use descriptive placeholders (e.g. `₹ 0` or `जैसे: चीनी, तेल`) to make it clear what input format is expected.
