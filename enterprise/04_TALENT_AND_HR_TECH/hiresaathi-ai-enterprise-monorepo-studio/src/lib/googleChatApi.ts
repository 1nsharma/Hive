export interface GoogleChatSpace {
  name: string;
  displayName: string;
  type: 'ROOM' | 'DM' | 'GROUP_CHAT';
  spaceType?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE';
  description?: string;
  memberCount?: number;
}

export interface GoogleChatMessage {
  name: string;
  text: string;
  createTime: string;
  sender?: {
    name?: string;
    displayName?: string;
    type?: string;
    avatarUrl?: string;
  };
  formattedText?: string;
}

export interface GoogleChatApiError {
  status: number;
  message: string;
  isAppNotConfigured?: boolean;
  isConsumerAccount?: boolean;
}

export const listGoogleChatSpaces = async (accessToken: string): Promise<{
  spaces: GoogleChatSpace[];
  error?: GoogleChatApiError;
}> => {
  try {
    const res = await fetch('https://chat.googleapis.com/v1/spaces', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const errorMsg = errorJson?.error?.message || res.statusText;
      const isAppNotConfigured = res.status === 404 || errorMsg.includes('Google Chat app not found');
      const isConsumerAccount = res.status === 403 || errorMsg.includes('consumer');

      return {
        spaces: [],
        error: {
          status: res.status,
          message: errorMsg,
          isAppNotConfigured,
          isConsumerAccount,
        },
      };
    }

    const data = await res.json();
    return {
      spaces: data.spaces || [],
    };
  } catch (err: any) {
    return {
      spaces: [],
      error: {
        status: 500,
        message: err.message || 'Network error while contacting Google Chat API',
      },
    };
  }
};

export const listGoogleChatMessages = async (
  spaceName: string,
  accessToken: string
): Promise<{
  messages: GoogleChatMessage[];
  error?: GoogleChatApiError;
}> => {
  try {
    const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=25`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const errorMsg = errorJson?.error?.message || res.statusText;
      return {
        messages: [],
        error: {
          status: res.status,
          message: errorMsg,
        },
      };
    }

    const data = await res.json();
    return {
      messages: data.messages || [],
    };
  } catch (err: any) {
    return {
      messages: [],
      error: {
        status: 500,
        message: err.message || 'Network error while retrieving messages',
      },
    };
  }
};

export const sendGoogleChatMessage = async (
  spaceName: string,
  text: string,
  accessToken: string
): Promise<{
  message?: GoogleChatMessage;
  error?: GoogleChatApiError;
}> => {
  try {
    const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const errorMsg = errorJson?.error?.message || res.statusText;
      return {
        error: {
          status: res.status,
          message: errorMsg,
        },
      };
    }

    const message = await res.json();
    return { message };
  } catch (err: any) {
    return {
      error: {
        status: 500,
        message: err.message || 'Failed to send message to Google Chat',
      },
    };
  }
};
