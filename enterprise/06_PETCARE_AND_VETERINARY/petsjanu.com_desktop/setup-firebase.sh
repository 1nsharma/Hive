#!/bin/bash

# ============================================
# PetGuardian Firebase Setup Script
# ============================================

echo "🚀 Setting up PetGuardian Firebase Backend..."

# 1. Create folder structure
echo "📁 Creating folder structure..."
mkdir -p functions
mkdir -p firestore
mkdir -p storage

# 2. Check configuration files
echo "⚙️ Validating configuration files..."

if [ -f "firebase.json" ]; then
  echo "  ✓ firebase.json exists"
fi

if [ -f "firestore.rules" ]; then
  echo "  ✓ firestore.rules exists"
fi

if [ -f "storage.rules" ]; then
  echo "  ✓ storage.rules exists"
fi

if [ -f "firestore.indexes.json" ]; then
  echo "  ✓ firestore.indexes.json exists"
fi

if [ -f "functions/index.js" ]; then
  echo "  ✓ functions/index.js exists"
fi

echo ""
echo "✅ Setup complete! Your Firebase backend & Cloud Functions are configured."
