import { ArchitectureNode } from "../types";

export const architectureNodes: ArchitectureNode[] = [
  {
    id: "frontend-public",
    title: "Public Frontend Applications",
    tier: "frontend",
    role: "Secured client apps for Donors, Volunteers, and NGOs, communicating solely via secure REST/JSON APIs.",
    techStack: "React 19, Tailwind CSS, Motion, Lucide, PWA (Progressive Web App) offline caching capabilities",
    spec: "Provides low-bandwidth, optimized user screens. Operates completely client-side. Automatically compresses image payloads on-device using HTML5 Canvas rendering before upload to save mobile data.",
    simulatedPayload: `// Client-Side Image Compression Payload
{
  "client_id": "v-104",
  "original_size_kb": 2400,
  "compressed_size_kb": 135,
  "compression_mime": "image/webp",
  "compression_time_ms": 180
}`
  },
  {
    id: "api-gateway",
    title: "Secure API Gateway & Auth Core",
    tier: "gateway",
    role: "Single point of ingress. Intercepts all client requests, performs authorization check, JWT verification, and applies rate limits.",
    techStack: "Express Router, JSON Web Tokens (JWT), Redis-based Token Bucket Limiters",
    spec: "Enforces a hard limit of 60 requests/minute per client IP for public routes and 1000 requests/minute for authenticated servers. Sanitizes inputs against XSS and SQL injection.",
    simulatedPayload: `// API Gateway Ingress Headers & Verification
{
  "request_path": "/api/v1/donations",
  "client_ip": "103.88.22.41",
  "jwt_status": "VERIFIED_VALID",
  "role_level": "DONOR",
  "rate_limit_remaining": 58,
  "duration_ms": 12
}`
  },
  {
    id: "microservice-donations",
    title: "Request & Logistics Microservice",
    tier: "microservice",
    role: "Manages donations, matches surplus sources with nearest NGO targets, coordinates volunteer dispatches, and maintains live status logs.",
    techStack: "Node.js (TypeScript), PG-Pool, Redis Streams",
    spec: "Employs geodesic calculations (Haversine formula) to locate active food hubs within a 5km radius. Automatically schedules background escalation alerts if a food shipment remains unassigned for over 35 minutes.",
    simulatedPayload: `// Dispatch Router Response
{
  "donation_id": "don-408",
  "source": { "lat": 28.6139, "lon": 77.2090 }, // Delhi Connaught Place
  "target_ngo": { "id": "ngo-01", "name": "Delhi Seva Ashram", "distance_m": 1240 },
  "nearest_volunteers_pinged": 3,
  "estimated_delivery_mins": 25,
  "routing_status": "MATCHED_PENDING_VOLUNTEER"
}`
  },
  {
    id: "ai-fraud-engine",
    title: "AI Fraud & Trust Engine (Private Core)",
    tier: "ai",
    role: "Our proprietary validation framework. Processes submissions for duplicate text, checks photos in real-time, and calculates GPS fences and volunteer trust scores.",
    techStack: "Gemini 3.6 Flash, TensorFlow-Lite Embeddings, Turf.js Spatial Verification",
    spec: "Processes upload coordinate telemetry to ensure a volunteer is physically standing inside the NGO geofence (50m radius) at delivery. Uses Gemini API (server-side) to evaluate descriptions for automated duplicate request flagging.",
    simulatedPayload: `// AI Intelligence Decision Audit
{
  "task_id": "task-709",
  "similarity_score": 0.12, // (No duplication found)
  "vision_contains_food": true,
  "photo_exif_realtime": "VALID_TIMESTAMP_MATCH",
  "gps_distance_to_ngo_metres": 12.4, // (Within 50m geofence)
  "calculated_trust_score_impact": "+2 (SUCCESS)",
  "overall_risk_rating": "MINIMAL_RISK"
}`
  },
  {
    id: "database-stack",
    title: "PostgreSQL & Redis Storage Stack",
    tier: "database",
    role: "Provides persistent ACID storage for compliance, historical CSR logs, and high-speed temporary caching for live real-time location telemetry.",
    techStack: "PostgreSQL (Relational Schema), Redis Active Cache, AWS S3 / Cloud Storage for image assets",
    spec: "Maintains relational tables with strict foreign-key indexes. Replicates read queries to standby instances. Uses Redis to persist active volunteer location pins with an automatic 3-minute TTL (Time To Live).",
    simulatedPayload: `// Database Connection Status & Pools
{
  "database_type": "PostgreSQL 16.2",
  "active_connections": 14,
  "pool_idle_connections": 8,
  "redis_cache_hits_percent": 94.2,
  "cold_storage_archived_count": 142091,
  "status": "HEALTHY"
}`
  }
];
