export type AppMode = 'voice' | 'desktop' | 'chat' | 'github' | 'brand';

export type PersonalityMode = 'humanity_helper' | 'tactical_hud' | 'code_architect';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  category: 'code' | 'ethics' | 'system' | 'automation';
  description: string;
  badge: string;
  defaultInput: string;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'humanity_values' | 'user_prefs' | 'system_rules';
  timestamp: string;
}

export interface RepoFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  children?: RepoFile[];
  content?: string;
  description?: string;
}
