(function initPushClient(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.PushClient = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPushClient() {
  const FUNCTION_NAME = 'manage-push-subscription';

  function getStatus({
    secureContext,
    serviceWorkerSupported,
    pushManagerSupported,
    notificationSupported,
    permission,
    userId,
    cloudSyncReady,
    hasSubscription
  }) {
    if (!secureContext) return { state: 'insecure' };
    if (!serviceWorkerSupported || !pushManagerSupported || !notificationSupported) {
      return { state: 'unsupported' };
    }
    if (!userId) return { state: 'signed_out' };
    if (!cloudSyncReady) return { state: 'sync_needed' };
    if (permission === 'denied') return { state: 'denied' };
    if (permission !== 'granted') return { state: 'permission_needed' };
    return { state: hasSubscription ? 'enabled' : 'not_enabled' };
  }

  function base64UrlToUint8Array(value, atobImpl = globalThis.atob) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value) || typeof atobImpl !== 'function') {
      throw new Error('Invalid application server key');
    }
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atobImpl(base64 + '='.repeat((4 - base64.length % 4) % 4));
    return Uint8Array.from(binary, character => character.charCodeAt(0));
  }

  async function invoke(supabaseClient, body) {
    if (!supabaseClient?.functions?.invoke) throw new Error('Push subscription service is unavailable');
    const result = await supabaseClient.functions.invoke(FUNCTION_NAME, { body });
    if (result?.error) throw result.error;
    return result?.data;
  }

  async function enable({
    navigatorRef,
    notificationRef,
    supabaseClient,
    userId,
    cloudSyncReady,
    secureContext,
    pushManagerSupported,
    serviceWorkerSupported,
    serviceWorkerUrl = '/service-worker.js'
  }) {
    const state = getStatus({
      secureContext,
      serviceWorkerSupported: !!serviceWorkerSupported,
      pushManagerSupported: !!pushManagerSupported,
      notificationSupported: !!notificationRef?.requestPermission,
      permission: notificationRef?.permission,
      userId,
      cloudSyncReady,
      hasSubscription: false
    });
    if (!['permission_needed', 'not_enabled', 'enabled'].includes(state.state)) {
      return { ok: false, ...state };
    }

    try {
      if (notificationRef.permission !== 'granted') {
        const permission = await notificationRef.requestPermission();
        if (permission !== 'granted') return { ok: false, state: permission === 'denied' ? 'denied' : 'permission_needed' };
      }

      const registration = await navigatorRef.serviceWorker.register(serviceWorkerUrl, { scope: '/' });
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const keyResult = await invoke(supabaseClient, { action: 'public-key' });
        if (!keyResult?.publicKey) throw new Error('Push reminders are not configured');
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(keyResult.publicKey)
        });
      }

      await invoke(supabaseClient, {
        action: 'subscribe',
        subscription: typeof subscription.toJSON === 'function' ? subscription.toJSON() : subscription
      });
      return { ok: true, state: 'enabled', subscription };
    } catch (error) {
      return { ok: false, state: 'service_error', error };
    }
  }

  async function disable({ navigatorRef, supabaseClient, userId }) {
    let subscription = null;
    let serverRemoved = false;
    let serverError = null;
    let localRemoved = false;

    try {
      const registration = await navigatorRef?.serviceWorker?.getRegistration?.();
      subscription = await registration?.pushManager?.getSubscription?.() || null;
    } catch (error) {
      return { ok: false, localRemoved: false, serverRemoved: false, error };
    }

    if (!subscription) return { ok: true, localRemoved: true, serverRemoved: true };

    let localError = null;
    try {
      localRemoved = !!(await subscription.unsubscribe());
    } catch (error) {
      localError = error;
    }

    if (userId && supabaseClient?.functions?.invoke) {
      try {
        await invoke(supabaseClient, { action: 'unsubscribe', endpoint: subscription.endpoint });
        serverRemoved = true;
      } catch (error) {
        serverError = error;
      }
    }

    return {
      ok: !!localRemoved && (!userId || serverRemoved),
      localRemoved: !!localRemoved,
      serverRemoved,
      error: localError,
      serverError
    };
  }

  async function disableForAuthChange({ navigatorRef, supabaseClient, previousUserId, nextUserId }) {
    if (!previousUserId || previousUserId === nextUserId) return { ok: true, skipped: true };
    return disable({ navigatorRef, supabaseClient, userId: previousUserId });
  }

  async function syncSubscription({ supabaseClient, subscription }) {
    await invoke(supabaseClient, {
      action: 'subscribe',
      subscription: typeof subscription?.toJSON === 'function' ? subscription.toJSON() : subscription
    });
    return { ok: true };
  }

  return { getStatus, base64UrlToUint8Array, enable, disable, disableForAuthChange, syncSubscription };
});
