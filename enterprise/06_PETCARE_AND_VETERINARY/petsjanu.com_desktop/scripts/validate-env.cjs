/**
 * Environment Validation Script for PetJanu
 * Checks required and optional environment variables and reports health status.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env and .env.local if available
const rootDir = path.resolve(__dirname, '..');
if (fs.existsSync(path.join(rootDir, '.env'))) {
  dotenv.config({ path: path.join(rootDir, '.env') });
}
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
  dotenv.config({ path: path.join(rootDir, '.env.local'), override: true });
}

console.log('🔍 Validating PetJanu Environment Configuration...\n');

const checks = [
  { name: 'GEMINI_API_KEY / VITE_GEMINI_API_KEY', keys: ['GEMINI_API_KEY', 'VITE_GEMINI_API_KEY'], required: true },
  { name: 'PORT', keys: ['PORT'], required: false, defaultVal: '3000' },
  { name: 'NODE_ENV', keys: ['NODE_ENV'], required: false, defaultVal: 'development' },
  { name: 'SUPABASE_URL', keys: ['VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'], required: false },
  { name: 'SUPABASE_ANON_KEY', keys: ['VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'], required: false },
  { name: 'RAZORPAY_KEY_ID', keys: ['RAZORPAY_KEY_ID'], required: false },
  { name: 'RAZORPAY_KEY_SECRET', keys: ['RAZORPAY_KEY_SECRET'], required: false },
];

let missingRequired = 0;

checks.forEach(check => {
  const foundKey = check.keys.find(k => process.env[k] && process.env[k] !== 'YOUR_GEMINI_API_KEY' && process.env[k] !== 'YOUR_ANON_KEY');
  if (foundKey) {
    console.log(` ✅ ${check.name}: Set via ${foundKey}`);
  } else if (check.required) {
    console.log(` ❌ ${check.name}: MISSING (Required)`);
    missingRequired++;
  } else {
    console.log(` ⚠️ ${check.name}: Not set (Optional — fallback/demo mode active)`);
  }
});

console.log('\n--- Environment Check Result ---');
if (missingRequired > 0) {
  console.log(`⚠️ ${missingRequired} required environment variable(s) missing.`);
  process.exit(1);
} else {
  console.log('✨ All required environment variables are set correctly!');
  process.exit(0);
}
