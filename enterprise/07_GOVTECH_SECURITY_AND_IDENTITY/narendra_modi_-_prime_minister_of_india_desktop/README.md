# 🇮🇳 The Years of Modi — 3D Hybrid Cinematic Experience

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-green.svg)](https://greensock.com/)
[![License](https://img.shields.io/badge/3D%20Model%20License-CC--BY--4.0-orange.svg)](https://creativecommons.org/licenses/by/4.0/)

An award-winning hybrid digital exhibition and interactive 3D WebGL timeline illustrating the life, transformative governance milestones, space missions, and global leadership of Prime Minister Narendra Modi.

---

## 🌟 Key Features & Dual-Mode Architecture

### 🎬 1. Story Mode (Scroll-Driven Narrative)
- **Inertia-Driven Smooth Scrolling**: Powered by **Lenis** (`@studio-freight/lenis`) synchronized with GSAP ScrollTrigger for organic, fluid progression.
- **Scroll-Choreographed 3D Model**: Real-time camera interpolation (`THREE.MathUtils.damp`) and model re-orientation in a fixed background WebGL canvas as you scroll through eras.
- **12 Comprehensive Story Chapters**: From humble beginnings in Vadnagar (1950) to the G20 New Delhi Summit, Chandrayaan-3 lunar landing, and the Viksit Bharat 2047 roadmap.
- **Velocity-Reactive Particles**: Floating tricolor particle field accelerates and stretches dynamically into light trails with scroll speed.
- **Dynamic Web Audio Drone Synth**: Indian classical drone chords (D3, A3, D4) with low-pass filter frequency dynamically responsive to scroll speed.

### 🌐 2. 3D Explore Mode (Interactive Spline Timeline)
- **Spline Walking Locomotion**: The 3D model traverses a continuous Catmull-Rom 3D ribbon path with natural walking bounce, tangent facing, and an illuminated holographic pedestal.
- **Full OrbitControls Freedom**: 360° rotation, panning, and zoom controls.
- **Anti-Occlusion Framing**: Smart camera choreography shifts viewport framing when information cards are open, ensuring the 3D model is never obscured.
- **Minimizable Information Cards**: Cards can collapse into an ultra-compact floating badge to give 100% unobstructed views of the scene.

---

## ⌨️ Keyboard Navigation Shortcuts

| Key | Mode | Action |
|---|---|---|
| <kbd>M</kbd> | Global | Toggle between **Story Mode** and **3D Explore Mode** |
| <kbd>A</kbd> | Global | Toggle ambient drone synthesizer (Sound On / Mute) |
| <kbd>↓</kbd> / <kbd>PageDown</kbd> / <kbd>Space</kbd> | Story | Smooth scroll to next chapter |
| <kbd>↑</kbd> / <kbd>PageUp</kbd> | Story | Smooth scroll to previous chapter |
| <kbd>Home</kbd> / <kbd>End</kbd> | Story | Jump to Prologue / Epilogue |
| <kbd>→</kbd> / <kbd>←</kbd> | Explore | Walk model to next / previous milestone |

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 + Vite 5
- **3D & WebGL**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: GSAP (GreenSock) + ScrollTrigger
- **Smooth Scroll**: `@studio-freight/lenis`
- **Typography**: Google Fonts (`Outfit` & `Inter`)
- **Icons**: `lucide-react`
- **Styling**: Vanilla Modern CSS (Glassmorphism, custom design system, responsive clamp typography)

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Production Deployment

Pre-configured for instant deployment on **Vercel** and **Netlify** with `.glb` MIME types (`model/gltf-binary`) and immutable caching rules:

### Deploy with Vercel:
```bash
npx vercel
```
*(Or import the repository directly on [vercel.com](https://vercel.com/new))*

### Deploy with Netlify:
```bash
npx netlify deploy --prod
```
*(Or connect your GitHub repository on [netlify.com](https://app.netlify.com/start))*

---

## 📜 3D Model Attribution

The 3D model of Prime Minister Narendra Modi used in this project is based on:
- **Title**: *"Narendra Modi - Prime Minister of INDIA"*
- **Author**: [bhagathartworks](https://sketchfab.com/bhagathartworks) on Sketchfab
- **License**: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)
