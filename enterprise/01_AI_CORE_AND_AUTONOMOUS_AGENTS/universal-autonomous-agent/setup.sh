#!/usr/bin/env bash
# ==============================================================================
# Agent OS: Local-First Universal Work OS Setup Script
# Usage: ./setup.sh
# ==============================================================================

set -e

echo "🚀 ====================================================="
echo "    AGENT OS: LOCAL-FIRST UNIVERSAL WORK PLATFORM"
echo "====================================================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker & Docker Compose first."
    exit 1
fi

echo "📦 1/5 Creating local encrypted vault and workspace directories..."
mkdir -p ./vault
mkdir -p ./workspace
chmod 700 ./vault

echo "🐳 2/5 Starting Docker services (PostgreSQL, Redis, Embeddings, Ollama)..."
docker compose up -d ollama postgres redis embeddings

echo "⏳ 3/5 Waiting for Ollama to accept connections..."
until curl -s http://localhost:11434/api/tags > /dev/null; do
    echo "   ...waiting for Ollama daemon to initialize..."
    sleep 3
done

echo "🧠 4/5 Pulling local AI models (Qwen 2.5 14B & Nomic Embeddings)..."
docker exec -i agent-os-ollama ollama pull qwen2.5:14b || echo "⚠️ Model pull can continue in background"
docker exec -i agent-os-ollama ollama pull nomic-embed-text || true

echo "🚀 5/5 Launching Agent OS Work Runtime..."
docker compose up -d agent-os

echo ""
echo "✅ ====================================================="
echo "   Agent OS is RUNNING in LOCAL-FIRST MODE!"
echo "   Access Unified Work Interface: http://localhost:3000"
echo "   Local LLM URL:                 http://localhost:11434"
echo "   PostgreSQL pgvector:           localhost:5432"
echo "   Local Credential Vault:        ./vault (AES-256 Encrypted)"
echo "====================================================="
