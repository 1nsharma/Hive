/**
 * Deep Link Router & QR/NFC Tag Scan Resolver for PetJanu
 * Parses incoming deep links like https://petsjanu.com/p/pet-1 or petsjanu://pet/pet-1
 */

export interface DeepLinkMatch {
  type: 'pet_scan' | 'report_lost' | 'beta_portal' | 'marketplace' | 'unknown';
  petId?: string;
  query?: Record<string, string>;
}

export function parseDeepLink(urlPathName: string, searchParamsString: string): DeepLinkMatch {
  const params = new URLSearchParams(searchParamsString);
  const path = urlPathName.toLowerCase();

  // 1. Direct Pet QR/NFC Scan URLs: /p/:petId or /pet/:petId
  const petMatch = path.match(/^\/(?:p|pet|scan)\/([^/]+)/);
  if (petMatch && petMatch[1]) {
    return {
      type: 'pet_scan',
      petId: petMatch[1],
    };
  }

  // 2. Query param pet scan: ?petId=pet-1 or ?scan=pet-1
  const petQueryId = params.get('petId') || params.get('scan') || params.get('p');
  if (petQueryId) {
    return {
      type: 'pet_scan',
      petId: petQueryId,
    };
  }

  // 3. Report Lost Pet shortcut
  if (path.startsWith('/report') || path.startsWith('/sos')) {
    return {
      type: 'report_lost',
    };
  }

  // 4. Beta Tester Portal
  if (path.startsWith('/beta') || path.startsWith('/apk')) {
    return {
      type: 'beta_portal',
    };
  }

  return { type: 'unknown' };
}

export function setupNativeAppUrlListener(onDeepLinkTriggered: (match: DeepLinkMatch) => void) {
  // Listen for Capacitor / Cordova native appUrlOpen event if running on native mobile device
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    const capacitor = (window as any).Capacitor;
    if (capacitor.Plugins && capacitor.Plugins.App) {
      capacitor.Plugins.App.addListener('appUrlOpen', (data: { url: string }) => {
        try {
          const url = new URL(data.url);
          const match = parseDeepLink(url.pathname, url.search);
          onDeepLinkTriggered(match);
        } catch (e) {
          console.warn('Failed to parse native deep link:', data.url);
        }
      });
    }
  }
}
