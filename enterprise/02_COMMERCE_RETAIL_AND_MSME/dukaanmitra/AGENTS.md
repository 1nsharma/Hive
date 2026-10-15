# World-Class UI/UX Design System Rules (Apple, Google, Stripe, Linear)

When building UI for this project, you must approach it as a combination of **Product Design System + Experience Engineering + Motion System**. 

## 1. Product Design Pillars (The Foundation)
- **Visual Hierarchy (Hierarchy & Focus):** The eye should naturally go to the most important element. Use size, weight, and color contrast to guide attention.
- **Cognitive Load Reduction:** Do not overwhelm the user. Use Progressive Disclosure. If there are 10 options, show the main 3 and hide the rest behind "More".
- **Consistency:** Use consistent patterns. A primary button should always look the same everywhere.

## 2. Visual Style & UI Trends
- **Glassmorphism (Apple VisionOS / iOS style):** Use frosted glass effects (blur, semi-transparent backgrounds, subtle borders) to create depth.
- **Material 3 / Neumorphism (Google):** Use soft shadows, rounded corners, and fluid shapes.
- **Brutalism / Minimalist (Linear, Notion):** Monochromatic, high-contrast text, sharp borders, very little decoration. Focus 100% on data.

## 3. The 4 Core Elements of a Design System
- **Typography (Text):**
  - Use a clear hierarchy: H1 (Hero), H2 (Section), H3 (Card title), Body (Standard), Caption (Small info).
  - Use modern fonts like Inter, SF Pro, or Roboto. Never use too many font styles.
- **Spacing System (The 8-point Grid):**
  - All margins and paddings MUST be multiples of 8 (8px, 16px, 24px, 32px). This creates mathematical harmony.
- **Color System (Tokens):**
  - Define Primary (Brand), Secondary, Background, Surface (Cards), Error (Red), Success (Green).
  - Never use pure black (`#000000`). Use `#1A1A1A` or `#111827` (slate-900).
- **Component Library:**
  - Build reusable, modular components (Buttons, Cards, Inputs, Modals) instead of repeating code.

## 4. Experience Engineering (UX)
- **Micro-interactions:** Small animations when hovering over a button or clicking a checkbox.
- **Feedback Loops:** If a user clicks something, they MUST instantly know it worked (loading spinner, success toast, haptic feedback on mobile).
- **Empty States:** When a list is empty, don't just show a blank screen. Show a nice illustration and a call-to-action (e.g., "Add your first item").
- **Accessibility (a11y):** Ensure high contrast. Make touch targets on mobile large enough (at least 44x44px).

## 5. Motion System (Animation)
- Animations should feel natural, not robotic. Use spring physics, not linear easing.
- **State Changes:** Smoothly transition between states (e.g., a button expanding into a loading state).

**Summary Formula:**
Best app UI = Design System + Motion System + Visual Effects + UX Psychology + Performance Optimization.
