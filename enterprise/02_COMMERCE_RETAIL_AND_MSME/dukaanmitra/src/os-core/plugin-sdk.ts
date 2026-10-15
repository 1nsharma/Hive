/**
 * 🚨 Plugin SDK
 * Public methods for extending the OS via Marketplace plugins.
 */

import { FeatureMetadata, WidgetDefinition } from './registry';
import { ToolDefinition, globalToolRegistry } from './tool-registry';
import { AIAgent } from './ai-os-layer';
import { globalEventBus, EventHandler } from './event-bus';
import { BusinessDomainEventType as EventType } from './domain-events';

export class PluginSDK {
  registerFeature(feature: FeatureMetadata) {
    console.log(`[PluginSDK] Registered Feature: ${feature.name}`);
  }

  registerWidget(widget: WidgetDefinition) {
    console.log(`[PluginSDK] Registered Widget: ${widget.title}`);
  }

  registerAgent(agent: AIAgent) {
    console.log(`[PluginSDK] Registered Agent: ${agent.name}`);
  }

  registerTool(tool: ToolDefinition) {
    globalToolRegistry.register(tool);
    console.log(`[PluginSDK] Registered Tool: ${tool.name}`);
  }

  registerEvent(type: EventType, handler: EventHandler) {
    globalEventBus.subscribe(type, handler);
    console.log(`[PluginSDK] Registered Event Handler for: ${type}`);
  }
}

export const BazaarSyncSDK = new PluginSDK();
