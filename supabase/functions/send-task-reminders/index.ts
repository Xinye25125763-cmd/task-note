import { withSupabase } from '@supabase/server';
// web-push does not publish bundled TypeScript declarations; its runtime is pinned in deno.json.
// @ts-ignore
import { sendNotification } from 'web-push';

type ClaimedReminder = {
  delivery_id: string;
  user_id: string;
  reminder_id: string;
  fire_at: string;
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
};

function secureEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status });
}

export default {
  fetch: withSupabase({ auth: 'none' }, async (req, ctx) => {
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    const expectedSecret = Deno.env.get('TASK_REMINDER_CRON_SECRET') || '';
    const receivedSecret = req.headers.get('x-task-reminder-secret') || '';
    if (!expectedSecret || !secureEqual(receivedSecret, expectedSecret)) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const privateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const subject = Deno.env.get('VAPID_SUBJECT');
    if (!publicKey || !privateKey || !subject) {
      return json({ error: 'Push reminders are not configured' }, 503);
    }

    const { data, error } = await ctx.supabaseAdmin.rpc('claim_due_task_reminders', {
      p_now: new Date().toISOString(),
      p_limit: 50,
      p_lease_seconds: 180
    });
    if (error) {
      console.error('Unable to claim due reminders', error.code);
      return json({ error: 'Unable to claim due reminders' }, 500);
    }

    const claimed = (data || []) as ClaimedReminder[];
    const counts = { sent: 0, failed: 0, expired: 0 };
    for (let start = 0; start < claimed.length; start += 10) {
      const batch = claimed.slice(start, start + 10);
      const outcomes = await Promise.all(batch.map(async item => {
        let status: 'sent' | 'failed' | 'expired' = 'sent';
        let errorCode: string | null = null;
        try {
          await sendNotification(item.subscription, JSON.stringify({
            title: 'TaskNote',
            body: '有一项待办即将到期。',
            url: '/'
          }), {
            TTL: 300,
            timeout: 10000,
            urgency: 'high',
            vapidDetails: { subject, publicKey, privateKey }
          });
        } catch (error) {
          const statusCode = Number(error && typeof error === 'object'
            ? (error as { statusCode?: number }).statusCode
            : 0);
          status = statusCode === 404 || statusCode === 410 ? 'expired' : 'failed';
          errorCode = statusCode > 0 ? `http-${statusCode}` : 'network-error';
        }

        const { error: finishError } = await ctx.supabaseAdmin.rpc('finish_task_reminder_delivery', {
          p_delivery_id: item.delivery_id,
          p_status: status,
          p_error_code: errorCode
        });
        if (finishError) console.error('Unable to finish reminder delivery', finishError.code);
        return status;
      }));

      for (const status of outcomes) counts[status]++;
    }

    return json({ claimed: claimed.length, ...counts });
  })
};
