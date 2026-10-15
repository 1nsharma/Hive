/**
 * FCM Push Notification Handler & Local SOS Alert Trigger
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.log('Notifications not supported in this browser.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendLocalSosNotification(petName: string, locationName: string = 'Connaught Place, Delhi') {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    const title = `🚨 LOST PET SOS: ${petName.toUpperCase()} SCANNED!`;
    const options = {
      body: `${petName}'s Smart Collar QR was scanned near ${locationName}. Tap to view location on map!`,
      icon: '/icon-192x192.png',
      tag: 'pet-sos-alert',
      vibrate: [200, 100, 200],
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  }
}
