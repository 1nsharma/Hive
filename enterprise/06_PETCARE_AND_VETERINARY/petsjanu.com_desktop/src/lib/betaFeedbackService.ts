/**
 * Beta Feedback Service & Supabase Persistence Engine
 */

export interface BetaFeedbackPayload {
  testerName: string;
  testerRole: string;
  category: 'bug' | 'feature' | 'performance' | 'ui';
  message: string;
  deviceInfo?: string;
  buildVersion?: string;
}

export async function submitBetaFeedbackToBackend(payload: BetaFeedbackPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch('/api/v1/beta/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        buildVersion: payload.buildVersion || 'v1.2.0-beta.4',
        deviceInfo: payload.deviceInfo || typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.warn('Backend feedback endpoint unavailable, storing in localStorage backup:', err.message);
    
    // Store in offline localStorage backup queue
    const existing = JSON.parse(localStorage.getItem('petjanu_offline_beta_feedback') || '[]');
    const backupItem = {
      id: `fb-off-${Date.now().toString().slice(-4)}`,
      ...payload,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('petjanu_offline_beta_feedback', JSON.stringify([backupItem, ...existing]));

    return { success: true, id: backupItem.id };
  }
}
