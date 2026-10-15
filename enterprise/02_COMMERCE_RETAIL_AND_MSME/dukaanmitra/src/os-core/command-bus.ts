import { DomainEvent } from './domain-events';

export type CommandType =
  | 'CREATE_SALE'
  | 'CREATE_PURCHASE'
  | 'SEND_WHATSAPP'
  | 'CREATE_UDHAAR'
  | 'PROCESS_PAYMENT'
  | 'CREATE_CUSTOMER'
  | 'CREATE_PRODUCT'
  | 'CREATE_TRANSACTION'
  | 'ADD_TRANSACTION';

export interface Command {
  id: string;
  type: CommandType;
  tenantId: string;
  payload: any;
  timestamp: number;
  issuerId: string; 
}

export interface CommandHandler {
  handle: (command: Command) => Promise<DomainEvent[]>;
}

export class CommandBus {
  private handlers: Map<CommandType, CommandHandler> = new Map();

  registerHandler(type: CommandType, handler: CommandHandler) {
    this.handlers.set(type, handler);
  }

  async dispatch(command: Command): Promise<DomainEvent[]> {
    console.log(`[CommandBus] Dispatching ${command.type}`);
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.type}`);
    }
    // Flow: Command -> Policy (implied elsewhere) -> Workflow -> Event
    return await handler.handle(command);
  }
}

export const globalCommandBus = new CommandBus();
