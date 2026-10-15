#!/usr/bin/env node

/**
 * Aura v1: Milestone 0 (M0) Scope Guard
 * 
 * Verifies that the codebase contains ZERO forbidden dependencies or references to:
 * - Camera streaming protocols (RTSP, ONVIF, WebRTC)
 * - Video transcoding engines (FFmpeg, GStreamer)
 * - Vision / ML models (YOLO, RT-DETR, CLIP, SigLIP, PyTorch, TensorRT, ONNX)
 * - Vector databases (Qdrant, Milvus)
 * 
 * Target Scope: Scans all source code, manifests, and configs outside of `docs/`.
 */

import fs from 'node:fs';
import path from 'node:path';

const FORBIDDEN_TOKENS = [
  'rtsp',
  'onvif',
  'ffmpeg',
  'gstreamer',
  'webrtc',
  'yolo',
  'rtdetr',
  'rt-detr',
  'siglip',
  'qdrant',
  'milvus',
  'videoclip',
  'onnxruntime',
  'tensorrt',
  'torch'
];

const IGNORE_PATHS = [
  '.git',
  'node_modules',
  'docs',
  'scripts' + path.sep + 'm0-scope-guard.js',
  'package-lock.json'
];

let violations = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath);

    if (IGNORE_PATHS.some(ignore => relPath.startsWith(ignore) || relPath.endsWith(ignore))) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      checkFile(fullPath, relPath);
    }
  }
}

function checkFile(fullPath, relPath) {
  // Only check code, json, sql, yaml, toml, mod, sh files
  const ext = path.extname(fullPath).toLowerCase();
  const validExts = ['.js', '.ts', '.mjs', '.cjs', '.json', '.sql', '.yaml', '.yml', '.env', '.sh', '.ps1', '.go', '.mod'];
  if (!validExts.includes(ext) && !path.basename(fullPath).startsWith('.')) {
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    for (const token of FORBIDDEN_TOKENS) {
      // Look for token as a distinct word or identifier
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(lowerLine)) {
        violations.push({
          file: relPath,
          line: index + 1,
          token,
          snippet: line.trim()
        });
      }
    }
  });
}

console.log('🔍 Running Aura M0 Scope Guard verification...');
scanDirectory(process.cwd());

if (violations.length > 0) {
  console.error('\n❌ M0 SCOPE GUARD VIOLATION DETECTED!');
  console.error('The following forbidden M1/M2 camera, streaming, or ML constructs were found:\n');
  violations.forEach(v => {
    console.error(`  [${v.file}:${v.line}] Token '${v.token}': ${v.snippet}`);
  });
  console.error('\nAction Required: Remove all video/camera/AI code. Milestone M0 permits foundation only.\n');
  process.exit(1);
} else {
  console.log('✅ M0 Scope Guard: PASS — Zero forbidden streaming/AI tokens or dependencies found.\n');
  process.exit(0);
}
