# Production Dockerfile for AI Super Intelligence Company
FROM node:22-alpine

WORKDIR /app

# Copy package descriptors
COPY package.json ./

# Install dependencies (zero external deps required, but ensures clean npm env)
RUN npm install --omit=dev

# Copy application source
COPY config ./config
COPY core ./core
COPY public ./public
COPY server.js ./

# Expose server port (default 3300)
ENV PORT=3300
ENV HOST=0.0.0.0
EXPOSE 3300

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/api/health || exit 1

# Start server
CMD ["node", "server.js"]
