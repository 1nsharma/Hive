# Responsive Design Audit (v1.0)

This audit documents how DukaanMitra (BazaarSync) adapts its layouts across varying screen sizes and touch form factors.

---

## 1. Viewport Adaptation Blueprint

DukaanMitra is optimized for running on mobile, tablet, and desktop displays:

| Device Category | Screen Resolution Width | Layout Behavior | Navigation System |
| :--- | :---: | :--- | :--- |
| **Small Mobile** | `<375px` | Dense single-column layout, compact cards, small avatar sizes | Dynamic Bottom Tab Bar |
| **Standard Mobile** | `375px - 640px` | Single-column spacious cards, full 44px tap target heights | Dynamic Bottom Tab Bar |
| **Tablet** | `641px - 1024px` | Dual-column grids (e.g. recent bills on the side of collection charts) | Top Action Bar / Settings Panel |
| **Desktop / Laptop** | `>1024px` | Unified dashboard panel with a centered `max-w-7xl` layout shell to prevent infinite stretching | Top Action Bar / Settings Panel |

---

## 2. Touch Form Factors & Target Thresholds

Since shopkeepers operate behind counters where interactions are quick and hands might be busy, touch inputs are prioritized:
- **Interactive Targets**: All interactive actions (tabs, chips, selector lists, and buttons) feature touch-active dimensions of at least `44px x 44px` to prevent selection slips.
- **Scroll Optimization**: Overflows inside the core dashboard and catalog lists use custom CSS parameters (`hide-scrollbar` with `-webkit-overflow-scrolling: touch`) to ensure silky-smooth native momentum scrolling.
- **Swipe Interactions**: Quick-access modals slide gracefully from the bottom of the viewport rather than blocking the screen, making them easy to dismiss with one-hand interactions.

---

## 3. Verified Responsive Layout Rules

To ensure layouts remain solid across varying screen parameters, we follow these guidelines:
1. **No Fixed Widths on Content**: Containers must use relative sizing parameters (e.g., `w-full max-w-md mx-auto`) with appropriate margins rather than hardcoded pixel lengths like `width: 450px;`.
2. **Flexible Grid Columns**: Grids like the Quick Actions buttons adjust dynamically using Tailwind responsive utility prefixes (e.g., `grid-cols-4 sm:grid-cols-4 md:grid-cols-4`).
3. **No Vertical Layout Breaks**: Viewport lengths use fluid units (`h-[100dvh]` or `min-h-[100dvh]`) to prevent browser chrome or virtual keyboards from cropping off checkout totalizers.
