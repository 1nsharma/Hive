# PetJanu Performance Optimization Guide

## Overview
This guide covers performance metrics, optimization strategies, and monitoring for the PetJanu platform.

## Current Build Performance

### Bundle Analysis
```
Total Build Size: ~1.5 MB (uncompressed)
- vendor-firebase: 643 KB (gzipped: 160 KB)
- vendor-react: 225 KB (gzipped: 67 KB)
- vendor-supabase: 217 KB (gzipped: 57 KB)
- vendor-motion: 132 KB (gzipped: 43 KB)
- Main app: 213 KB (gzipped: 54 KB)
- CSS: 123 KB (gzipped: 21 KB)
```

### Build Time
- Vite build: ~16.5s
- Server build: ~17ms

## Performance Metrics

### Core Web Vitals Targets

| Metric | Target | Good | Needs Improvement | Poor |
|--------|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | <2.5s | <2.5s | 2.5-4.0s | >4.0s |
| FID (First Input Delay) | <100ms | <100ms | 100-300ms | >300ms |
| CLS (Cumulative Layout Shift) | <0.1 | <0.1 | 0.1-0.25 | >0.25 |
| INP (Interaction to Next Paint) | <200ms | <200ms | 200-500ms | >500ms |
| TTFB (Time to First Byte) | <800ms | <800ms | 800-1800ms | >1800ms |

## Optimization Strategies

### 1. Code Splitting ✅ Already Implemented
```typescript
// vite.config.ts - Manual chunks configured
manualChunks(id: string) {
  if (id.includes('node_modules')) {
    if (id.includes('react') || id.includes('react-dom')) {
      return 'vendor-react';
    }
    if (id.includes('firebase')) {
      return 'vendor-firebase';
    }
    // ... more chunks
  }
}
```

### 2. Lazy Loading Components
```typescript
// Example: Lazy load heavy components
const AIChatAssistant = lazy(() => import('./components/AIChatAssistant'));
const MCPConsole = lazy(() => import('./components/MCPConsole'));

// Use in component
<Suspense fallback={<Loading />}>
  <AIChatAssistant />
</Suspense>
```

### 3. Image Optimization
```typescript
// Use WebP format with fallback
<picture>
  <source srcSet="/images/pet-tag.webp" type="image/webp" />
  <img src="/images/pet-tag.jpg" alt="Pet Tag" loading="lazy" />
</picture>

// Implement responsive images
<img 
  srcSet="pet-tag-400.jpg 400w, pet-tag-800.jpg 800w"
  sizes="(max-width: 600px) 400px, 800px"
  src="pet-tag-800.jpg"
  alt="Pet Tag"
  loading="lazy"
/>
```

### 4. Font Optimization
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />

<!-- Use font-display: swap in CSS -->
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap;
}
```

### 5. API Response Caching
```typescript
// Implement service worker caching
// public/firebase-messaging-sw.js already exists

// Add HTTP caching headers in server.ts
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  next();
});
```

### 6. Database Query Optimization
```typescript
// Supabase: Use selective queries
const { data } = await supabase
  .from('pets')
  .select('id, name, slug') // Only needed fields
  .eq('user_id', userId)
  .limit(10);

// Add indexes in migrations
// migrations/003_scan_pings.sql
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_pets_slug ON pets(slug);
```

## Monitoring Tools

### 1. Lighthouse Audits
```bash
# Run Lighthouse audit
npx lighthouse http://localhost:5173 --output html --output-path ./lighthouse-report.html

# Or use Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Generate report
```

### 2. Web Vitals Measurement
```typescript
// Add web-vitals package (already installed)
import { onLCP, onFID, onCLS, onINP } from 'web-vitals';

onLCP(console.log);
onFID(console.log);
onCLS(console.log);
onINP(console.log);

// Send to analytics
function sendToAnalytics(metric) {
  const body = {
    dlc: navigator.sendBeacon,
    url: window.location.href,
    ...metric,
  };
  
  navigator.sendBeacon('/api/analytics', JSON.stringify(body));
}
```

### 3. Bundle Analysis
```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({ open: true }),
  ],
});

# Run build to see visualization
npm run build
```

### 4. Performance Testing Scripts
```bash
# SEO & Performance Audit
npm run seo:audit

# Full validation including performance checks
npm run check-all
```

## RAIL Model Implementation

### Response (0-100ms)
- Immediate feedback on user actions
- Optimistic UI updates
- Touch feedback within 100ms

### Animation (10ms per frame)
- 60 FPS animations using CSS transforms
- Hardware acceleration with `will-change`
- Avoid layout thrashing

### Idle (Load additional resources)
- Lazy load non-critical components
- Prefetch likely navigation targets
- Background sync for offline data

### Load (Content visible <1s)
- Critical CSS inlined
- Above-the-fold content prioritized
- Skeleton screens for loading states

## PRPL Pattern

### Push
- Critical resources pushed via HTTP/2
- Preload key assets
```html
<link rel="preload" href="/assets/index.css" as="style" />
<link rel="preload" href="/assets/vendor-react.js" as="script" />
```

### Render
- Initial route rendered immediately
- Server-side rendering for critical pages
- Minimal JavaScript for initial paint

### Pre-cache
- Service Worker caches remaining routes
```javascript
// Already configured in public/firebase-messaging-sw.js
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
```

### Lazy-load
- Other routes loaded on demand
- Dynamic imports for code splitting

## Mobile Performance

### Best Practices
1. **Reduce JavaScript execution time**
   - Code split by route
   - Defer non-critical scripts
   
2. **Minimize main thread work**
   - Web Workers for heavy computations
   - Debounce/throttle event handlers

3. **Avoid large layout shifts**
   - Reserve space for images/ads
   - Use aspect-ratio CSS property

4. **Optimize for slow networks**
   - Implement offline mode
   - Use compression (gzip/brotli)
   - CDN for static assets

## Vercel Deployment Optimization

### Already Configured
```json
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### Edge Functions
```typescript
// Move lightweight logic to Edge
// api/edge/pets.ts
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Fast edge processing
}
```

## Performance Budget

| Resource Type | Budget | Current | Status |
|--------------|--------|---------|--------|
| Total JS | 500 KB | 578 KB | ⚠️ Over |
| Total CSS | 50 KB | 21 KB | ✅ Good |
| Total Images | 200 KB | - | 📊 Monitor |
| LCP | 2.5s | - | 📊 Monitor |
| TTI | 3.8s | - | 📊 Monitor |

## Action Items

### Immediate
1. ✅ Setup Vitest & Playwright testing
2. ✅ Configure code splitting
3. ✅ Enable gzip compression
4. 🔄 Add performance monitoring
5. 🔄 Implement image optimization

### Short-term
1. Add Service Worker for offline support
2. Implement lazy loading for all routes
3. Set up bundle size monitoring in CI
4. Add skeleton screens for loading states
5. Optimize Firebase initialization

### Long-term
1. Migrate to React Server Components
2. Implement partial hydration
3. Add edge computing for API routes
4. Set up real-user monitoring (RUM)
5. Achieve 95+ Lighthouse scores

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/overview/)
- [Web Vitals](https://web.dev/vitals/)
