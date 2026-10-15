# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json .npmrc ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ─── Stage 2: Production Runtime ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only copy the built output and production node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.npmrc ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the server port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

# Start the server
CMD ["node", "dist/server.cjs"]
