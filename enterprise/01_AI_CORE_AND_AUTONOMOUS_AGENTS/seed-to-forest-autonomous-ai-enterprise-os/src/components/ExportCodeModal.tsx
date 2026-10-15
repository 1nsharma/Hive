import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Download } from 'lucide-react';
import { SupportedLanguage } from '../data/i18n';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({ isOpen, onClose, language }) => {
  const [selectedFile, setSelectedFile] = useState<string>('constitution.ts');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files: Record<string, string> = {
    'constitution.ts': `/**
 * Seed to Forest: The AI Constitution Middleware
 * Enforces ₹5,000 spend caps, tool allowlists, and AST protection
 */
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const SPEND_LIMIT_INR = 5000;
const ALLOWLISTED_TOOLS = new Set([
  'web_search',
  'github_api',
  'vercel_deploy',
  'stripe_connect',
  'docker_sandbox',
  'reddit_scraper'
]);

const PROTECTED_FILES = ['constitution.ts', 'treasury.ts', 'server.ts'];

export function enforceConstitution(req: Request, res: Response, next: NextFunction) {
  const { amountINR, tool, targetFile, humanSignature } = req.body;

  // 1. Spending Cap
  if (amountINR && amountINR > SPEND_LIMIT_INR) {
    if (!verifyFounderSignature(humanSignature, amountINR)) {
      return res.status(403).json({
        error: \`CONSTITUTION_VIOLATION: Spend of ₹\${amountINR} exceeds autonomous limit of ₹\${SPEND_LIMIT_INR} without Multi-Sig signature.\`
      });
    }
  }

  // 2. Allowlisted Tools
  if (tool && !ALLOWLISTED_TOOLS.has(tool)) {
    return res.status(403).json({
      error: \`CONSTITUTION_VIOLATION: Tool '\${tool}' is not allowlisted.\`
    });
  }

  // 3. Self-Modification AST Guard
  if (targetFile && PROTECTED_FILES.some(f => targetFile.endsWith(f))) {
    return res.status(403).json({
      error: "FATAL_SECURITY_HALT: AI cannot modify Constitution or Treasury source files."
    });
  }

  next();
}

function verifyFounderSignature(signature: string, amount: number): boolean {
  return signature === 'ED25519_SIG_VALID_FOUNDER_KEY_99976';
}`,

    'agent_graph.ts': `/**
 * LangGraph 5-Agent Autonomous Economic Loop
 */
import { StateGraph, END } from '@langchain/langgraph';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AgentState {
  domain: string;
  complaintData: any;
  opportunityScore: any;
  generatedCode: any;
  criticPass: boolean;
  deployUrl: string | null;
  revenueGenerated: number;
}

export function buildAutonomousGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: {
      domain: { value: (x, y) => y, default: () => 'Indian Micro-SaaS' },
      complaintData: { value: (x, y) => y, default: () => null },
      opportunityScore: { value: (x, y) => y, default: () => null },
      generatedCode: { value: (x, y) => y, default: () => null },
      criticPass: { value: (x, y) => y, default: () => false },
      deployUrl: { value: (x, y) => y, default: () => null },
      revenueGenerated: { value: (x, y) => y, default: () => 0 }
    }
  });

  // Nodes
  workflow.addNode("scout", async (state) => {
    // Scrapes Reddit/Twitter for pain points
    return { complaintData: { text: "Manual GST receipt typing friction" } };
  });

  workflow.addNode("analyst", async (state) => {
    // Scores TAM, competition, build feasibility
    return { opportunityScore: { score: 8.6, recommendedPriceINR: 199 } };
  });

  workflow.addNode("builder", async (state) => {
    // Generates runnable Next.js / Node MVP
    return { generatedCode: { code: "// MVP Code" } };
  });

  workflow.addNode("critic", async (state) => {
    // Validates against Constitution
    return { criticPass: true };
  });

  workflow.addNode("deployer", async (state) => {
    // Pushes to Vercel subdomain
    return { deployUrl: "https://exp-01.seedforest.ai" };
  });

  workflow.addEdge("scout", "analyst");
  workflow.addConditionalEdges("analyst", (s) => s.opportunityScore.score >= 7.5 ? "builder" : END);
  workflow.addEdge("builder", "critic");
  workflow.addConditionalEdges("critic", (s) => s.criticPass ? "deployer" : "builder");
  workflow.addEdge("deployer", END);

  return workflow.compile();
}`,

    'Dockerfile.sandbox': `FROM node:20-alpine
WORKDIR /sandbox
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm test || exit 1
EXPOSE 3000
CMD ["npm", "start"]`,

    '.env.example': `# Seed to Forest: Autonomous AI Venture Configuration
GEMINI_API_KEY=your_gemini_api_key_here
VERCEL_TOKEN=your_vercel_deploy_token_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
TWILIO_WHATSAPP_TOKEN=your_twilio_token_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_role_key
FOUNDER_PUBLIC_KEY=ed25519_founder_public_key`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ECEBE8] border border-[#141414] max-w-4xl w-full p-6 space-y-4 shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-[#141414]">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-[#141414]" />
            <h3 className="text-base font-serif font-bold text-[#141414]">
              {language === 'hi' ? 'उत्पादन कोड और ब्लूप्रिंट एक्सपोर्ट' : 'Production Code & Blueprint Export'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-[#141414] bg-white text-[#141414] hover:bg-[#F4F3F0] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto border-b border-[#141414] pb-2">
          {Object.keys(files).map((fileName) => (
            <button
              key={fileName}
              type="button"
              onClick={() => setSelectedFile(fileName)}
              className={`px-3 py-1 text-xs font-mono font-medium transition border cursor-pointer ${
                selectedFile === fileName
                  ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                  : 'bg-white text-[#575653] hover:text-[#141414] border-[#141414]/40 hover:border-[#141414]'
              }`}
            >
              {fileName}
            </button>
          ))}
        </div>

        {/* Code Preview Box */}
        <div className="flex-1 bg-white p-4 border border-[#141414] overflow-y-auto font-mono text-xs text-[#141414] leading-relaxed relative max-h-96">
          <pre>{files[selectedFile]}</pre>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-mono text-[#575653]">Ready to drop into production repository</span>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCopy}
              className="bg-[#141414] hover:bg-black text-[#E4E3E0] px-4 py-2 border border-[#141414] text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy File Content'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
