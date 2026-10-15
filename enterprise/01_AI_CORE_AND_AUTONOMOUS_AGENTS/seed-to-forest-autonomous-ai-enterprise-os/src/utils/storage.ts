import { TreasuryTransaction } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/blueprintData';

const STORAGE_KEY_PREFIX = 'seed_to_forest_';
const STORAGE_VERSION = 'v1.1';

export interface PersistentAppState {
  version: string;
  activeTab: string;
  language: 'en' | 'hi' | 'de' | 'ja' | 'ar';
  aiOpsBalanceINR: number;
  totalRevenueINR: number;
  transactions: TreasuryTransaction[];
  completedTasks: Record<string, boolean>;
  emergencyHalted: boolean;
  lastUpdated: string;
}

export const DEFAULT_APP_STATE: PersistentAppState = {
  version: STORAGE_VERSION,
  activeTab: 'deep_dive',
  language: 'hi',
  aiOpsBalanceINR: 18830,
  totalRevenueINR: 398,
  transactions: INITIAL_TRANSACTIONS,
  completedTasks: {
    't-0-0': true,
    't-0-1': true,
    't-0-2': true,
    't-1-0': true,
    't-1-1': true
  },
  emergencyHalted: false,
  lastUpdated: new Date().toISOString()
};

export function loadPersistentState(): { state: PersistentAppState; status: 'LOADED' | 'FALLBACK_CORRUPTED' | 'FIRST_RUN' } {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}state`);
    if (!raw) {
      return { state: DEFAULT_APP_STATE, status: 'FIRST_RUN' };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== STORAGE_VERSION) {
      console.warn('[Storage] Version mismatch or corrupt state found. Re-initializing safe defaults.');
      return { state: { ...DEFAULT_APP_STATE, language: parsed.language || 'hi' }, status: 'FALLBACK_CORRUPTED' };
    }

    // Sanity checks on financial state so corrupted data never breaks ledger
    if (typeof parsed.aiOpsBalanceINR !== 'number' || isNaN(parsed.aiOpsBalanceINR) || parsed.aiOpsBalanceINR < 0) {
      parsed.aiOpsBalanceINR = DEFAULT_APP_STATE.aiOpsBalanceINR;
    }

    if (!Array.isArray(parsed.transactions)) {
      parsed.transactions = INITIAL_TRANSACTIONS;
    }

    return { state: parsed, status: 'LOADED' };
  } catch (err) {
    console.error('[Storage] Error reading localStorage:', err);
    return { state: DEFAULT_APP_STATE, status: 'FALLBACK_CORRUPTED' };
  }
}

export function savePersistentState(state: PersistentAppState): boolean {
  try {
    const updated = {
      ...state,
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}state`, JSON.stringify(updated));
    return true;
  } catch (err: any) {
    // Check if QuotaExceededError
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      console.error('[Storage] LocalStorage quota exceeded. Trimming older transaction records.');
      try {
        const trimmedState = {
          ...state,
          transactions: state.transactions.slice(0, 20) // Keep only latest 20 txs
        };
        localStorage.setItem(`${STORAGE_KEY_PREFIX}state`, JSON.stringify(trimmedState));
        return true;
      } catch (innerErr) {
        console.error('[Storage] Secondary trim save failed:', innerErr);
      }
    }
    console.error('[Storage] Failed to persist state:', err);
    return false;
  }
}

export function resetPersistentState(): PersistentAppState {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}state`);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_APP_STATE;
}
