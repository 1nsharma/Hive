import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  FolderPlus, 
  Play,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const Scaffolder: React.FC<{ hinglishMode?: boolean }> = ({ hinglishMode = false }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber) 
        : [...prev, stepNumber]
    );
  };

  const bashScript = `#!/usr/bin/env bash
# ==============================================================================
# HireSaathi AI — Enterprise Monorepo Scaffolding Script
# Scalable from 5 to 500 Developers
# ==============================================================================

set -euo pipefail

echo "🚀 Initializing HireSaathi AI Monorepo structure..."

# 1. Create Apps
mkdir -p apps/web/src/{app,components,features,hooks,lib}
mkdir -p apps/admin
mkdir -p apps/developer-portal
mkdir -p apps/docs-site

# 2. Create Services
mkdir -p services/api-gateway
mkdir -p services/identity
mkdir -p services/ai-gateway
mkdir -p services/agent-runtime
mkdir -p services/mcp-gateway
mkdir -p services/workflow-engine
mkdir -p services/recruit-service/src/recruit/{api/routes,domain,application,infrastructure}
mkdir -p services/recruit-service/tests/{unit,integration,fixtures}
mkdir -p services/support-service
mkdir -p services/billing-service
mkdir -p services/notification-service
mkdir -p services/audit-service

# 3. Create Integrations
mkdir -p integrations/model-providers/{openai,anthropic,local-models}
mkdir -p integrations/mcp/{github,postgres,approved-servers}
mkdir -p integrations/business/{email,whatsapp,crm}

# 4. Create Shared Packages
mkdir -p packages/ui/src
mkdir -p packages/auth-sdk/src
mkdir -p packages/api-client/src
mkdir -p packages/agent-sdk/src
mkdir -p packages/mcp-sdk/src
mkdir -p packages/workflow-sdk/src
mkdir -p packages/shared-types/src
mkdir -p packages/observability-sdk/src

# 5. Create Data, ML, Security, Infra, Docs, Observability
mkdir -p data/{migrations,schemas,seed,retention-policies}
mkdir -p ml/{embeddings,evaluation,datasets,model-monitoring}
mkdir -p security/{threat-models,authorization-policies,sandbox,security-tests}
mkdir -p infra/{docker,kubernetes,terraform,environments/{development,staging,production}}
mkdir -p tests/{integration,end-to-end,performance,security}
mkdir -p docs/{architecture,decisions,api,runbooks,onboarding}
mkdir -p observability/{dashboards,alerts,tracing}
mkdir -p .github/{workflows}

# Create .gitkeep in leaf folders
find . -type d -empty -exec touch {}/.gitkeep \\;

echo "✅ Created directory trees for apps, services, packages, and integrations!"

# Generate root configs
cat << 'EOF' > pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'integrations/mcp/*'
EOF

cat << 'EOF' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "typecheck": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

cat << 'EOF' > .github/CODEOWNERS
# Core Platform
*                               @hiresaathi/platform-leads
turbo.json                      @hiresaathi/platform-leads
pnpm-workspace.yaml             @hiresaathi/platform-leads

# Apps & Services
/apps/web/                      @hiresaathi/frontend-guild
/services/recruit-service/      @hiresaathi/talent-ai-team
/services/ai-gateway/           @hiresaathi/ai-platform
/services/mcp-gateway/          @hiresaathi/integrations-team

# Shared Types (Multi-review requirement)
/packages/shared-types/         @hiresaathi/arch-guild
EOF

echo "🎉 HireSaathi AI repository successfully scaffolded!"
echo "Next step: Run 'pnpm install' and 'docker compose up -d' to start local dev."
`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(bashScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const downloadScriptFile = () => {
    const blob = new Blob([bashScript], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup-hiresaathi-monorepo.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyOneLiner = () => {
    navigator.clipboard.writeText('curl -sSL https://raw.githubusercontent.com/hiresaathi/hiresaathi-ai/main/scripts/setup.sh | bash');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const foundationalSteps = [
    {
      num: 1,
      title: 'apps/web — Working Next.js Dashboard',
      desc: 'Build the unified interface where recruiters manage jobs, inspect candidates, and connect tools.',
      hindi: 'Customer aur recruiter ke liye pehle working screen taiyyar karein.'
    },
    {
      num: 2,
      title: 'services/api-gateway & identity — Core APIs',
      desc: 'Set up session cookies, JWT verification, and proxy routes to prevent direct exposure.',
      hindi: 'Authentication aur basic backend APIs set karein.'
    },
    {
      num: 3,
      title: 'packages/shared-types — Contract Single Source of Truth',
      desc: 'Export candidate, job, and MCP types so frontend and backend never fall out of sync.',
      hindi: 'Shared data contracts jo frontend aur backend dono import karenge.'
    },
    {
      num: 4,
      title: 'data/migrations — Postgres Initial Schemas',
      desc: 'Define jobs, candidates, and workspace tables with Alembic/Prisma with audit trails.',
      hindi: 'Database schema aur migrations file create karein.'
    },
    {
      num: 5,
      title: '.github/workflows — CI Pipeline & Secret Scanners',
      desc: 'Automate TypeScript typechecking, Ruff linting, and Gitleaks secret detection before any merge.',
      hindi: 'Automated CI checks jo har PR ko automatically verify karenge.'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <span>DEVELOPER BOOTSTRAP: DAY ONE IMPLEMENTATION</span>
            <span>·</span>
            <span>SCAFFOLDING GENERATOR</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Meri Final Recommendation: Shuruaat Mein Yeh 5 Cheezein Banayein
          </h2>
          <p className="text-xs text-slate-400">
            {hinglishMode
              ? 'HireSaathi AI ko enterprise architecture ke vision ke saath build karein, lekin enterprise complexity ko pehle din implement mat karein.'
              : 'Build with the enterprise vision from Day 1, but defer microservice overhead until scaling thresholds demand it.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyOneLiner}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>{copiedCmd ? 'Copied Command!' : 'Copy 1-Line CLI'}</span>
          </button>
        </div>
      </div>

      {/* The 5 Foundational Steps Checklist */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              DAY 1 EXECUTION ROADMAP
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Foundational 5 Steps Before Adding AI Complexity
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {completedSteps.length} of 5 Steps Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundationalSteps.map((step) => {
            const isDone = completedSteps.includes(step.num);
            return (
              <div
                key={step.num}
                onClick={() => toggleStep(step.num)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isDone
                    ? 'bg-slate-850 border-emerald-600/70 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                    Pillar #{step.num}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                  )}
                </div>

                <h4 className="font-semibold text-xs text-white mt-2.5">{step.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {hinglishMode ? step.hindi : step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Bash Scaffolding Script */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>setup-hiresaathi-monorepo.sh</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Run this script in your terminal to instantly generate all 35+ folders, gitkeeps, and root configs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyScriptToClipboard}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Copied Script!' : 'Copy Script'}</span>
            </button>
            <button
              onClick={downloadScriptFile}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .sh File</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-[360px]">
          <pre className="text-slate-300 leading-relaxed whitespace-pre">
            {bashScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
