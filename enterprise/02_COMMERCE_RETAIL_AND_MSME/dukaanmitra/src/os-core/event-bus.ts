/**
 * 🚨 Event Bus Layer
 * Connects Actions, AI Agents, Knowledge Graph, Notifications, and Analytics.
 */

import { DomainEvent, BusinessDomainEventType } from './domain-events.js';

export type OSEvent = DomainEvent;

export type EventHandler = (event: OSEvent) => Promise<void> | void;

export class EventBus {
  private handlers: Map<BusinessDomainEventType, EventHandler[]> = new Map();

  subscribe(type: BusinessDomainEventType, handler: EventHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  async publish(event: OSEvent) {
    console.log(`[EventBus] Publishing ${event.type}`, event);
    const handlers = this.handlers.get(event.type) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[EventBus] Error handling ${event.type}:`, err);
      }
    }
  }
}

export const globalEventBus = new EventBus();
