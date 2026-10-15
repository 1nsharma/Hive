import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { authRouter } from './server/routes/auth.js';
import { shopsRouter } from './server/routes/shops.js';
import { privilegedRouter } from './server/routes/privileged.js';
import { auditRouter } from './server/routes/audit.js';
import { securityRouter } from './server/routes/security.js';
import { m02Router } from './server/routes/m02.js';
import { m03Router } from './server/routes/m03.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Security headers & CORS for preview iframe compatibility
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-razorpay-signature');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      milestone: 'Milestone 01: Foundation & Security',
      stack: 'Next.js 14 / Supabase (Postgres + Auth + Realtime + Storage)',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API route handlers
  app.use('/api/auth', authRouter);
  app.use('/api/shops', shopsRouter);
  app.use('/api/privileged-action', privilegedRouter);
  app.use('/api/audit-logs', auditRouter);
  app.use('/api/security', securityRouter);
  app.use('/api', m02Router);
  app.use('/api', m03Router);
  app.use('/api/payments', m03Router);

  // Development: Vite middleware mode
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev] Vite middleware attached');
  } else {
    // Production: serve built static assets from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[Prod] Serving static assets from', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (http://0.0.0.0:${PORT})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
