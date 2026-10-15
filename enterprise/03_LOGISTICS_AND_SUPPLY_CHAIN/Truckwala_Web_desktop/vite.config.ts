import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const apiPlugin = (): Plugin => ({
  name: 'truckwala-api',
  configureServer(server) {
    const leads: any[] = [];
    const events: any[] = [];

    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      if (url.startsWith('/api/leads')) {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const newLead = {
                id: `TW-${Date.now().toString().slice(-6)}`,
                receivedAt: new Date().toISOString(),
                ...data,
              };
              leads.unshift(newLead);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, lead: newLead }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        } else if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, count: leads.length, leads }));
          return;
        }
      }

      if (url.startsWith('/api/events')) {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const newEvent = {
                id: `EV-${Date.now().toString().slice(-6)}`,
                timestamp: new Date().toISOString(),
                ...data,
              };
              events.unshift(newEvent);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, event: newEvent }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        } else if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, count: events.length, events }));
          return;
        }
      }

      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
