import { withSupabase } from '@supabase/server';

type PushSubscriptionInput = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
};

function isTrustedPushHost(hostname: string): boolean {
  return hostname === 'fcm.googleapis.com'
    || hostname === 'updates.push.services.mozilla.com'
    || hostname === 'push.services.mozilla.com'
    || hostname === 'web.push.apple.com'
    || hostname.endsWith('.notify.windows.com');
}

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status });
}

function safeEndpoint(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const endpoint = new URL(value);
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password
      || endpoint.port || endpoint.hash || !isTrustedPushHost(endpoint.hostname)) return null;
    return endpoint.toString();
  } catch (_) {
    return null;
  }
}

function isSubscription(value: unknown): value is PushSubscriptionInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const subscription = value as Record<string, unknown>;
  const keys = subscription.keys;
  if (!keys || typeof keys !== 'object' || Array.isArray(keys)) return false;
  const keyValues = keys as Record<string, unknown>;
  const p256dh = keyValues.p256dh;
  const auth = keyValues.auth;
  return safeEndpoint(subscription.endpoint) !== null
    && typeof p256dh === 'string' && /^[A-Za-z0-9_-]{20,256}$/.test(p256dh)
    && typeof auth === 'string' && /^[A-Za-z0-9_-]{8,256}$/.test(auth);
}

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    const userId = ctx.userClaims.sub;
    if (!userId) return json({ error: 'Authentication required' }, 401);

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch (_) {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    if (body.action === 'public-key') {
      const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
      if (!publicKey) return json({ error: 'Push reminders are not configured' }, 503);
      return json({ publicKey });
    }

    if (body.action === 'subscribe') {
      if (!isSubscription(body.subscription)) return json({ error: 'Invalid push subscription' }, 400);
      const endpoint = safeEndpoint(body.subscription.endpoint)!;
      const expirationTime = body.subscription.expirationTime;
      const expirationDate = typeof expirationTime === 'number' && Number.isFinite(expirationTime) && expirationTime > 0
        ? new Date(expirationTime)
        : null;
      const expiresAt = expirationDate && Number.isFinite(expirationDate.getTime())
        ? expirationDate.toISOString()
        : null;
      const { data: registered, error } = await ctx.supabaseAdmin.rpc('register_push_subscription', {
        p_user_id: userId,
        p_endpoint: endpoint,
        p_subscription: { ...body.subscription, endpoint },
        p_expires_at: expiresAt
      });

      if (error) {
        console.error('Failed to save push subscription', error.code);
        return json({ error: 'Unable to save push subscription' }, 500);
      }
      if (registered !== true) return json({ error: 'This browser endpoint belongs to a different account' }, 409);
      return json({ ok: true });
    }

    if (body.action === 'unsubscribe') {
      const endpoint = safeEndpoint(body.endpoint);
      if (!endpoint) return json({ error: 'Invalid push endpoint' }, 400);
      const { error } = await ctx.supabaseAdmin.from('push_subscriptions')
        .delete().eq('user_id', userId).eq('endpoint', endpoint);
      if (error) {
        console.error('Failed to remove push subscription', error.code);
        return json({ error: 'Unable to remove push subscription' }, 500);
      }
      return json({ ok: true });
    }

    return json({ error: 'Unsupported action' }, 400);
  })
};
