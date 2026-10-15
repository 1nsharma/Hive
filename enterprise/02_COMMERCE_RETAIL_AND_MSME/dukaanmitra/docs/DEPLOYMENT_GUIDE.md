# Deployment & Operations Guide (v1.0)

This guide documents the procedures for building, testing, containerizing, and deploying DukaanMitra (BazaarSync) on Google Cloud Platform.

---

## 1. Local Development Booting

Before starting the server locally, ensure all system credentials are set in the root `.env` file (copied from `.env.example`).

### 1.1 Running the Dev Server
The development pipeline is managed using `tsx` to run the TypeScript Express backend directly while hot-reloading assets via Vite:
```bash
# Install package dependencies
npm install

# Start the unified dev server on Port 3000
npm run dev
```

---

## 2. Production Build Pipeline

For production deployments (e.g. Google Cloud Run containers), the code must be built and bundled to optimize load-times and memory usage.

### 2.1 Build Execution Command
```bash
npm run build
```
This triggers the compilation script defined in `package.json`:
- **Step 1 (Frontend SPA)**: `vite build` optimizes React views, minifies assets, and outputs static bundles inside the `dist/` directory.
- **Step 2 (Backend Bundle)**: `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` packages the entire backend server into a single, high-performance CommonJS file inside `dist/`.

### 2.2 Verifying the Local Bundle Build
To test the production-compiled outputs locally prior to shipping to production container registries:
```bash
# Set runtime environment to production
export NODE_ENV=production

# Boot the compiled server
npm start
```

---

## 3. Containerization via Dockerfile

DukaanMitra is packaged into a lightweight, secure Docker container using a multi-stage compilation flow:

```dockerfile
# Multi-Stage Production Dockerfile Example
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

---

## 4. Google Cloud Run Deployment Steps

Follow these steps to deploy the Docker container to Google Cloud Run:

### Step 1: Authenticate the Google Cloud SDK
Ensure the `gcloud` command-line utility is authenticated to the target project space:
```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

### Step 2: Build and Push to Artifact Registry
Use Cloud Build to package and push the container to your project's secure registry:
```bash
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/dukaanmitra:latest
```

### Step 3: Deploy to Cloud Run
Execute the deployment to Cloud Run, specifying Port `3000` as the ingress port and allocating required secrets from Google Secret Manager:
```bash
gcloud run deploy dukaanmitra \
  --image gcr.io/[YOUR_PROJECT_ID]/dukaanmitra:latest \
  --platform managed \
  --region asia-southeast1 \
  --port 3000 \
  --allow-unauthenticated \
  --update-secrets=DATABASE_URL=DATABASE_URL:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,JWT_SECRET=JWT_SECRET:latest
```

---

## 5. Database Schema Migration

When schema changes are made to `/src/db/schema.ts`, the database must be synchronized prior to deploying container updates:

```bash
# Generate the SQL migration files using Drizzle Kit
npx drizzle-kit generate:pg

# Apply the generated migration files directly to the target Cloud SQL PostgreSQL database
npx drizzle-kit push:pg
```
_Note: In production environments, migrations should be applied during a scheduled maintenance window or handled automatically inside the container startup script (`CMD ["sh", "-c", "npx drizzle-kit push:pg && node dist/server.cjs"]`) to prevent database-application state drift._
