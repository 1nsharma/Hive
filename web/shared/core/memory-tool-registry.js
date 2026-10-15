export class AgentToolRegistry {
  constructor() {
    this.tools = new Map();
    this.agents = new Map();
    this.episodicMemory = new Map();
  }

  registerTool(name, spec) {
    if (!name || !spec.execute) throw new Error("Tool requires name and execute function");
    this.tools.set(name, {
      name,
      description: spec.description || "",
      parameters: spec.parameters || {},
      execute: spec.execute
    });
  }

  registerAgent(id, config) {
    this.agents.set(id, {
      id,
      name: config.name,
      allowedTools: new Set(config.tools || []),
      systemPrompt: config.systemPrompt || "You are an autonomous agent.",
      status: "READY"
    });
    this.episodicMemory.set(id, []);
  }

  async invokeTool(agentId, toolName, args) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent '${agentId}' not registered`);
    if (!agent.allowedTools.has(toolName) && !agent.allowedTools.has("*")) {
      throw new Error(`TOOL_ACCESS_DENIED: Agent '${agentId}' is not authorized to call tool '${toolName}'`);
    }
    const tool = this.tools.get(toolName);
    if (!tool) throw new Error(`Tool '${toolName}' not found in registry`);

    const result = await tool.execute(args);
    // Record into episodic memory
    this.episodicMemory.get(agentId).push({
      timestamp: new Date().toISOString(),
      toolName,
      args,
      result
    });
    return result;
  }

  getAgentMemory(agentId) {
    return this.episodicMemory.get(agentId) || [];
  }
}

export const agentToolRegistry = new AgentToolRegistry();
