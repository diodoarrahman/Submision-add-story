const BASE_URL = 'https://story-api.dicoding.dev/v1';

const pushNotificationHelper = {
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker tidak didukung.');
    return await navigator.serviceWorker.register('/sw.js');
  },

  async requestPermission() {
    const result = await Notification.requestPermission();
    if (result !== 'granted') throw new Error('Izin notifikasi tidak diberikan.');
  },

  async subscribeUser(swReg, token) {
    const subscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this._urlBase64ToUint8Array(
        'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
      ),
    });

    const subscriptionJSON = subscription.toJSON();

    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscriptionJSON.keys.p256dh,
          auth: subscriptionJSON.keys.auth,
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return subscription;
  },

  async unsubscribeUser(swReg, token) {
    const subscription = await swReg.pushManager.getSubscription();
    if (!subscription) throw new Error('Tidak ada subscription aktif.');

    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    await subscription.unsubscribe();
    return true;
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  },
};

export default pushNotificationHelper;
