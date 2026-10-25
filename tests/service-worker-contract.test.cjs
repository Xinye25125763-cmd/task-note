const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const PushClient = require('../push-client.js');

const root = path.join(__dirname, '..');
const workerSource = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

test('push capability status explains each prerequisite state', () => {
  const getStatus = PushClient.getStatus;
  const base = {
    secureContext: true,
    serviceWorkerSupported: true,
    pushManagerSupported: true,
    notificationSupported: true,
    permission: 'default',
    userId: 'user-1',
    cloudSyncReady: true,
    hasSubscription: false
  };

  assert.equal(getStatus({ ...base, userId: null }).state, 'signed_out');
  assert.equal(getStatus({ ...base, cloudSyncReady: false }).state, 'sync_needed');
  assert.equal(getStatus({ ...base, permission: 'denied' }).state, 'denied');
  assert.equal(getStatus({ ...base, secureContext: false }).state, 'insecure');
  assert.equal(getStatus({ ...base, pushManagerSupported: false }).state, 'unsupported');
  assert.equal(getStatus({ ...base, permission: 'granted' }).state, 'not_enabled');
  assert.equal(getStatus({ ...base, permission: 'granted', hasSubscription: true }).state, 'enabled');
});

test('enabling asks permission on demand and registers this device with the authenticated API', async () => {
  const calls = [];
  let permissionCalls = 0;
  const subscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/device-token',
    expirationTime: null,
    keys: { p256dh: 'p'.repeat(32), auth: 'a'.repeat(16) },
    toJSON() { return { endpoint: this.endpoint, keys: this.keys }; },
    unsubscribe: async () => true
  };
  const navigatorRef = {
    serviceWorker: {
      register: async url => {
        assert.equal(url, '/service-worker.js');
        return { pushManager: {
          getSubscription: async () => null,
          subscribe: async options => {
            assert.equal(options.userVisibleOnly, true);
            assert.ok(options.applicationServerKey instanceof Uint8Array);
            return subscription;
          }
        } };
      }
    }
  };
  const notificationRef = {
    permission: 'default',
    requestPermission: async () => { permissionCalls++; return 'granted'; }
  };
  const supabaseClient = { functions: { invoke: async (_name, { body }) => {
    calls.push(body);
    return body.action === 'public-key'
      ? { data: { publicKey: 'AQIDBA' }, error: null }
      : { data: { ok: true }, error: null };
  } } };

  const result = await PushClient.enable({
    navigatorRef, notificationRef, supabaseClient, userId: 'user-1',
    cloudSyncReady: true, secureContext: true,
    pushManagerSupported: true, serviceWorkerSupported: true
  });

  assert.equal(result.ok, true);
  assert.equal(permissionCalls, 1);
  assert.deepEqual(calls.map(call => call.action), ['public-key', 'subscribe']);
  assert.equal(calls[1].subscription.endpoint, subscription.endpoint);
});

test('enabling does not prompt before account and cloud-sync prerequisites are met', async () => {
  let permissionCalls = 0;
  const result = await PushClient.enable({
    navigatorRef: { serviceWorker: {} },
    notificationRef: { permission: 'default', requestPermission: async () => { permissionCalls++; return 'granted'; } },
    supabaseClient: { functions: { invoke: async () => { throw new Error('must not call'); } } },
    userId: null, cloudSyncReady: false, secureContext: true,
    pushManagerSupported: true, serviceWorkerSupported: true
  });

  assert.equal(result.state, 'signed_out');
  assert.equal(permissionCalls, 0);
});

test('denied browser permission never calls the prompt again', async () => {
  let permissionCalls = 0;
  const result = await PushClient.enable({
    navigatorRef: { serviceWorker: {} },
    notificationRef: { permission: 'denied', requestPermission: async () => { permissionCalls++; return 'granted'; } },
    supabaseClient: { functions: { invoke: async () => { throw new Error('must not call'); } } },
    userId: 'user-1', cloudSyncReady: true, secureContext: true,
    pushManagerSupported: true, serviceWorkerSupported: true
  });

  assert.equal(result.state, 'denied');
  assert.equal(permissionCalls, 0);
});

test('disabling removes the server endpoint and local browser subscription', async () => {
  let locallyUnsubscribed = false;
  const serverCalls = [];
  const subscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/device-token', unsubscribe: async () => { locallyUnsubscribed = true; return true; } };
  const navigatorRef = { serviceWorker: { getRegistration: async () => ({ pushManager: { getSubscription: async () => subscription } }) } };
  const supabaseClient = { functions: { invoke: async (_name, { body }) => { serverCalls.push(body); return { data: { ok: true }, error: null }; } } };

  const result = await PushClient.disable({ navigatorRef, supabaseClient, userId: 'user-1' });

  assert.equal(result.ok, true);
  assert.equal(locallyUnsubscribed, true);
  assert.deepEqual(serverCalls, [{ action: 'unsubscribe', endpoint: subscription.endpoint }]);
});

test('disabling still removes local notifications when server cleanup is temporarily unavailable', async () => {
  let locallyUnsubscribed = false;
  const subscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/device-token', unsubscribe: async () => { locallyUnsubscribed = true; return true; } };
  const navigatorRef = { serviceWorker: { getRegistration: async () => ({ pushManager: { getSubscription: async () => subscription } }) } };
  const supabaseClient = { functions: { invoke: async () => ({ data: null, error: new Error('offline') }) } };

  const result = await PushClient.disable({ navigatorRef, supabaseClient, userId: 'user-1' });

  assert.equal(locallyUnsubscribed, true);
  assert.equal(result.localRemoved, true);
  assert.equal(result.serverRemoved, false);
  assert.equal(result.ok, false);
});

test('disabling attempts server cleanup even when local unsubscribe throws', async () => {
  const serverCalls = [];
  const subscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/device-token',
    unsubscribe: async () => { throw new Error('browser unsubscribe failed'); }
  };
  const navigatorRef = { serviceWorker: { getRegistration: async () => ({ pushManager: { getSubscription: async () => subscription } }) } };
  const supabaseClient = { functions: { invoke: async (_name, { body }) => {
    serverCalls.push(body);
    return { data: { ok: true }, error: null };
  } } };

  const result = await PushClient.disable({ navigatorRef, supabaseClient, userId: 'user-1' });

  assert.equal(result.localRemoved, false);
  assert.equal(result.serverRemoved, true);
  assert.equal(serverCalls.length, 1);
  assert.deepEqual(serverCalls[0], { action: 'unsubscribe', endpoint: subscription.endpoint });
});

test('auth departure removes the previous account subscription but ignores token refreshes', async () => {
  const serverCalls = [];
  let locallyUnsubscribed = false;
  const subscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/device-token',
    unsubscribe: async () => { locallyUnsubscribed = true; return true; }
  };
  const navigatorRef = { serviceWorker: { getRegistration: async () => ({ pushManager: { getSubscription: async () => subscription } }) } };
  const supabaseClient = { functions: { invoke: async (_name, { body }) => {
    serverCalls.push(body);
    return { data: { ok: true }, error: null };
  } } };

  const result = await PushClient.disableForAuthChange({
    navigatorRef, supabaseClient, previousUserId: 'user-1', nextUserId: null
  });
  const noOp = await PushClient.disableForAuthChange({
    navigatorRef, supabaseClient, previousUserId: 'user-1', nextUserId: 'user-1'
  });

  assert.equal(result.serverRemoved, true);
  assert.equal(locallyUnsubscribed, true);
  assert.deepEqual(noOp, { ok: true, skipped: true });
  assert.equal(serverCalls.length, 1);
});

test('auth change handler delegates sign-out and account switches to push cleanup', () => {
  const handler = app.slice(app.indexOf('async function onAuthChange'), app.indexOf('let pushUiRevision'));
  assert.match(handler, /PushClient\.disableForAuthChange\(/);
  assert.match(handler, /previousUser\?\.id/);
  assert.match(handler, /nextUser\?\.id/);
});

test('the service worker shows generic copy and routes notification clicks to TaskNote', async () => {
  const listeners = new Map();
  const calls = { notifications: [], opened: [], focused: 0, closed: 0 };
  const self = {
    location: { origin: 'https://tasknote.example' },
    registration: { showNotification: async (...args) => calls.notifications.push(args) },
    clients: {
      matchAll: async () => [],
      openWindow: async url => calls.opened.push(url)
    },
    addEventListener: (name, handler) => listeners.set(name, handler)
  };
  vm.runInNewContext(workerSource, { self, URL, Promise });

  assert.deepEqual([...listeners.keys()].sort(), ['notificationclick', 'push']);
  let waited;
  listeners.get('push')({ data: { text: () => '用户待办标题不应显示' }, waitUntil: promise => { waited = promise; } });
  await waited;
  assert.equal(calls.notifications[0][0], 'TaskNote');
  assert.equal(calls.notifications[0][1].body, '有一项待办即将到期。');
  assert.doesNotMatch(JSON.stringify(calls.notifications), /用户待办标题/);

  const notification = { close: () => { calls.closed++; } };
  listeners.get('notificationclick')({ notification, waitUntil: promise => { waited = promise; } });
  await waited;
  assert.equal(calls.closed, 1);
  assert.deepEqual(calls.opened, ['https://tasknote.example/']);
});

test('clicking a reminder focuses an existing TaskNote tab without opening another', async () => {
  const listeners = new Map();
  const calls = { focused: 0, opened: [] };
  const self = {
    location: { origin: 'https://tasknote.example' },
    registration: { showNotification: async () => {} },
    clients: {
      matchAll: async () => [{ url: 'https://tasknote.example/todo', focus: async () => { calls.focused++; } }],
      openWindow: async url => calls.opened.push(url)
    },
    addEventListener: (name, handler) => listeners.set(name, handler)
  };
  vm.runInNewContext(workerSource, { self, URL, Promise });

  let waited;
  listeners.get('notificationclick')({ notification: { close() {} }, waitUntil: promise => { waited = promise; } });
  await waited;
  assert.equal(calls.focused, 1);
  assert.deepEqual(calls.opened, []);
});

test('settings expose per-device opt-in and the app gates it on a completed cloud sync', () => {
  assert.match(html, /id="push-reminder-enable"/);
  assert.match(html, /id="push-reminder-disable"/);
  assert.match(html, /id="push-reminder-status"/);
  assert.match(html, /push-client\.js/);
  assert.match(app, /function enableBackgroundReminders\(/);
  assert.match(app, /function disableBackgroundReminders\(/);
  assert.match(app, /cloudSyncUserId === currentUser\.id/);
});
