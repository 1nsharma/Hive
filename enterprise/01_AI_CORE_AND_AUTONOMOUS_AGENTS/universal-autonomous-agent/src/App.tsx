import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { WorkOSView } from './components/WorkOSView';
import { AgentsDashboard } from './components/AgentsDashboard';
import { IdentityAgentView } from './components/IdentityAgentView';
import { AgentControlPlane } from './components/AgentControlPlane';
import { PolicyEngineView } from './components/PolicyEngineView';
import { ToolRuntimeView } from './components/ToolRuntimeView';
import { OrchestratorView } from './components/OrchestratorView';
import { BotChannelsView } from './components/BotChannelsView';
import { MobileControlPlane } from './components/MobileControlPlane';
import { AutomationsView } from './components/AutomationsView';
import { CLITerminalView } from './components/CLITerminalView';
import { CloudSystemView } from './components/CloudSystemView';
import { MarketplaceView } from './components/MarketplaceView';
import { AuditLogViewer } from './components/AuditLogViewer';
import { RoadmapView } from './components/RoadmapView';

import { 
  DigitalTwinProfile, 
  OperatingMode,
  AgentWorker,
  IdentityEntity,
  IdentityGrowthProspect,
  IdentityGeneratedContent,
  IdentityPipelineRun,
  IdentityVerificationStatus,
  ReviewControlItem,
  BotChannel,
  BotChatMessage,
  AutomationWorkflow,
  MarketplaceItem,
  CloudSystemState,
  CLICommandResponse,
  AuditLogEntry,
  AgentPermissionRule,
  TenantConnection,
  PolicyEvaluationResult
} from './types';

import { 
  INITIAL_PROFILES, 
  INITIAL_AGENT_WORKERS,
  INITIAL_IDENTITY_ENTITIES,
  INITIAL_GROWTH_PROSPECTS,
  INITIAL_GENERATED_CONTENT,
  INITIAL_REVIEW_ITEMS,
  INITIAL_BOT_CHANNELS,
  INITIAL_BOT_MESSAGES,
  INITIAL_AUTOMATIONS,
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_CLOUD_STATE,
  INITIAL_AUDIT_LOGS,
  INITIAL_PERMISSION_RULES,
  INITIAL_TENANT_CONNECTIONS
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('work_os');
  const [profiles, setProfiles] = useState<DigitalTwinProfile[]>(INITIAL_PROFILES);
  const [activeTenantId, setActiveTenantId] = useState<string>(INITIAL_PROFILES[0].id);
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('SUPERVISED');
  
  // Agent OS State
  const [agentWorkers, setAgentWorkers] = useState<AgentWorker[]>(INITIAL_AGENT_WORKERS);
  const [identityEntities, setIdentityEntities] = useState<IdentityEntity[]>(INITIAL_IDENTITY_ENTITIES);
  const [growthProspects, setGrowthProspects] = useState<IdentityGrowthProspect[]>(INITIAL_GROWTH_PROSPECTS);
  const [generatedContent, setGeneratedContent] = useState<IdentityGeneratedContent[]>(INITIAL_GENERATED_CONTENT);
  const [reviewItems, setReviewItems] = useState<ReviewControlItem[]>(INITIAL_REVIEW_ITEMS);
  const [botChannels, setBotChannels] = useState<BotChannel[]>(INITIAL_BOT_CHANNELS);
  const [botMessages, setBotMessages] = useState<BotChatMessage[]>(INITIAL_BOT_MESSAGES);
  const [automations, setAutomations] = useState<AutomationWorkflow[]>(INITIAL_AUTOMATIONS);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE_ITEMS);
  const [cloudState, setCloudState] = useState<CloudSystemState>(INITIAL_CLOUD_STATE);
  const [pipelineRuns, setPipelineRuns] = useState<IdentityPipelineRun[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [permissionRules, setPermissionRules] = useState<AgentPermissionRule[]>(INITIAL_PERMISSION_RULES);
  const [connections, setConnections] = useState<TenantConnection[]>(INITIAL_TENANT_CONNECTIONS);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Sync state from server
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/agent/state');
      if (res.ok) {
        const data = await res.json();
        if (data.profiles) setProfiles(data.profiles);
        if (data.activeTenantId) setActiveTenantId(data.activeTenantId);
        if (data.operatingMode) setOperatingMode(data.operatingMode);
        if (data.agentWorkers) setAgentWorkers(data.agentWorkers);
        if (data.identityEntities) setIdentityEntities(data.identityEntities);
        if (data.growthProspects) setGrowthProspects(data.growthProspects);
        if (data.generatedContent) setGeneratedContent(data.generatedContent);
        if (data.reviewItems) setReviewItems(data.reviewItems);
        if (data.botChannels) setBotChannels(data.botChannels);
        if (data.botMessages) setBotMessages(data.botMessages);
        if (data.automations) setAutomations(data.automations);
        if (data.marketplaceItems) setMarketplaceItems(data.marketplaceItems);
        if (data.cloudState) setCloudState(data.cloudState);
        if (data.identityPipelineRuns) setPipelineRuns(data.identityPipelineRuns);
        if (data.permissionRules) setPermissionRules(data.permissionRules);
        if (data.tenantConnections) setConnections(data.tenantConnections);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (typeof data.hasGeminiApiKey === 'boolean') setHasGeminiKey(data.hasGeminiApiKey);
      }
    } catch (err) {
      console.warn('Could not fetch server state; running in local state:', err);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const activeProfile = profiles.find(p => p.id === activeTenantId) || profiles[0];

  // Select profile
  const handleSelectProfile = async (id: string) => {
    try {
      const res = await fetch('/api/agent/set-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: id }),
      });
      if (res.ok) {
        setActiveTenantId(id);
        fetchState();
      }
    } catch {
      setActiveTenantId(id);
    }
  };

  // Change Operating Mode
  const handleModeChange = async (mode: OperatingMode) => {
    setOperatingMode(mode);
    try {
      const res = await fetch('/api/agent/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to update operating mode:', err);
    }
  };

  // Toggle Agent Worker status
  const handleToggleWorker = async (workerId: string, status: AgentWorker['status']) => {
    try {
      const res = await fetch('/api/agent/workers/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, status }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to toggle worker:', err);
    }
  };

  // Run Worker on-demand
  const handleRunWorker = async (workerId: string) => {
    try {
      const res = await fetch('/api/agent/workers/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to run worker:', err);
    }
  };

  // Run full 7-stage Amit Identity & Growth Loop
  const handleRunIdentityPipeline = async () => {
    try {
      const res = await fetch('/api/agent/identity-pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        await fetchState();
      }
    } catch (err) {
      console.error('Failed to run identity pipeline:', err);
    }
  };

  // Verify / Reconcile Identity Entity
  const handleVerifyEntity = async (entityId: string, status: IdentityVerificationStatus) => {
    try {
      const res = await fetch('/api/agent/identity/verify-entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, status }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to verify entity:', err);
    }
  };

  // Control Plane (Review Gate) Action
  const handleControlPlaneAction = async (
    itemId: string, 
    action: 'approve' | 'reject' | 'modify' | 'rollback', 
    notes?: string, 
    modifiedPayload?: Record<string, unknown>
  ) => {
    try {
      const res = await fetch('/api/agent/control-plane/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action, notes, modifiedPayload }),
      });
      if (res.ok) {
        await fetchState();
      }
    } catch (err) {
      console.error('Failed to execute control plane action:', err);
    }
  };

  // Multi-Channel Bot Message
  const handleSendMessage = async (channelId: string, text: string) => {
    try {
      const res = await fetch('/api/agent/channels/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, text }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to send bot message:', err);
    }
  };

  // Toggle Automation
  const handleToggleWorkflow = async (workflowId: string, isEnabled: boolean) => {
    try {
      const res = await fetch('/api/agent/automations/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, isEnabled }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to toggle workflow:', err);
    }
  };

  // Run Automation Now
  const handleRunWorkflow = async (workflowId: string) => {
    try {
      const res = await fetch('/api/agent/automations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to run workflow:', err);
    }
  };

  // Install Marketplace Module
  const handleInstallMarketplace = async (itemId: string) => {
    try {
      const res = await fetch('/api/agent/marketplace/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to install marketplace item:', err);
    }
  };

  // Toggle Marketplace Module
  const handleToggleMarketplace = async (itemId: string, isEnabled: boolean) => {
    try {
      const res = await fetch('/api/agent/marketplace/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, isEnabled }),
      });
      if (res.ok) {
        fetchState();
      }
    } catch (err) {
      console.error('Failed to toggle marketplace item:', err);
    }
  };

  // CLI Command Execution
  const handleExecCLI = async (command: string): Promise<CLICommandResponse> => {
    try {
      const res = await fetch('/api/agent/cli/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      if (res.ok) {
        const data = await res.json();
        fetchState();
        return data.result;
      }
      return {
        command,
        output: 'Error: Server returned non-200 code',
        status: 'error',
        timestamp: new Date().toLocaleTimeString()
      };
    } catch {
      return {
        command,
        output: 'Error: Network failure connecting to CLI runtime',
        status: 'error',
        timestamp: new Date().toLocaleTimeString()
      };
    }
  };

  const pendingReviewItems = reviewItems.filter(r => r.status === 'pending');

  const handleSimulateActionDispatched = async (evaluation: PolicyEvaluationResult) => {
    try {
      const res = await fetch('/api/agent/policy/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: evaluation.agentId,
          agentName: evaluation.agentName,
          resource: evaluation.resource,
          capability: evaluation.capability,
          proposedAction: evaluation.proposedAction,
          payload: {
            idempotencyKey: evaluation.idempotencyKey,
            executionId: evaluation.executionId,
            riskMatrix: evaluation.riskMatrix
          }
        })
      });
      if (res.ok) {
        await fetchState();
        setActiveTab('control_plane');
      }
    } catch (err) {
      console.error('Failed to dispatch simulation to server:', err);
      setActiveTab('control_plane');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        reviewItems={reviewItems}
        operatingMode={operatingMode}
        onModeChange={handleModeChange}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'work_os' && (
          <WorkOSView
            operatingMode={operatingMode}
            onNavigateToReview={() => setActiveTab('control_plane')}
            onNavigateToPolicy={() => setActiveTab('policy_engine')}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsDashboard
            workers={agentWorkers}
            operatingMode={operatingMode}
            onToggleWorker={handleToggleWorker}
            onRunWorker={handleRunWorker}
            onSelectAgentTab={(type) => {
              if (type === 'identity_agent') setActiveTab('identity_agent');
            }}
          />
        )}

        {activeTab === 'identity_agent' && (
          <IdentityAgentView
            profile={activeProfile}
            entities={identityEntities}
            generatedContent={generatedContent}
            growthProspects={growthProspects}
            pipelineRuns={pipelineRuns}
            onRunPipeline={handleRunIdentityPipeline}
            onVerifyEntity={handleVerifyEntity}
            onNavigateToReview={() => setActiveTab('control_plane')}
          />
        )}

        {activeTab === 'policy_engine' && (
          <PolicyEngineView
            permissionRules={permissionRules}
            connections={connections}
            workers={agentWorkers}
            operatingMode={operatingMode}
            onSimulateActionDispatched={handleSimulateActionDispatched}
          />
        )}

        {activeTab === 'tool_runtime' && (
          <ToolRuntimeView
            operatingMode={operatingMode}
            onNavigateToReview={() => setActiveTab('control_plane')}
          />
        )}

        {activeTab === 'orchestrator' && (
          <OrchestratorView
            profile={activeProfile}
            operatingMode={operatingMode}
            onRunFullLoop={handleRunIdentityPipeline}
            onNavigateToReview={() => setActiveTab('control_plane')}
            onNavigateToPolicy={() => setActiveTab('policy_engine')}
            onNavigateToToolRuntime={() => setActiveTab('tool_runtime')}
          />
        )}

        {activeTab === 'control_plane' && (
          <AgentControlPlane
            items={reviewItems}
            operatingMode={operatingMode}
            onAction={handleControlPlaneAction}
          />
        )}

        {activeTab === 'channels' && (
          <BotChannelsView
            channels={botChannels}
            messages={botMessages}
            operatingMode={operatingMode}
            onSendMessage={handleSendMessage}
            onTriggerModeChange={handleModeChange}
          />
        )}

        {activeTab === 'mobile' && (
          <MobileControlPlane
            operatingMode={operatingMode}
            pendingItems={pendingReviewItems}
            workers={agentWorkers}
            onAction={(id, action) => handleControlPlaneAction(id, action)}
            onModeChange={handleModeChange}
            onQuickVoiceCommand={(text) => handleSendMessage('chan-web', text)}
          />
        )}

        {activeTab === 'automations' && (
          <AutomationsView
            workflows={automations}
            onToggleWorkflow={handleToggleWorkflow}
            onRunWorkflow={handleRunWorkflow}
          />
        )}

        {activeTab === 'cli' && (
          <CLITerminalView
            onExecCommand={handleExecCLI}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            items={marketplaceItems}
            onInstall={handleInstallMarketplace}
            onToggle={handleToggleMarketplace}
          />
        )}

        {activeTab === 'cloud' && (
          <CloudSystemView
            cloudState={cloudState}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogViewer
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView />
        )}
      </main>
    </div>
  );
}
