const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const userDataMigrationPath = path.join(root, 'supabase/migrations/20261024000000_user_data_rls.sql');
const migrationPath = path.join(root, 'supabase/migrations/20261025000000_task_reminders.sql');
const managePath = path.join(root, 'supabase/functions/manage-push-subscription/index.ts');
const senderPath = path.join(root, 'supabase/functions/send-task-reminders/index.ts');
const senderConfigPath = path.join(root, 'supabase/functions/send-task-reminders/deno.json');
const supabaseConfigPath = path.join(root, 'supabase/config.toml');
const deploymentGuidePath = path.join(root, 'docs/task-reminders-deployment.md');

function readRequired(file, label) {
  assert.equal(fs.existsSync(file), true, `${label} exists`);
  return fs.readFileSync(file, 'utf8');
}

test('user_data grants cannot bypass row security with table-wide privileges', () => {
  const sql = readRequired(userDataMigrationPath, 'user_data RLS migration').toLowerCase();

  assert.match(sql, /revoke all on table public\.user_data from anon, authenticated/);
  assert.match(sql, /grant select, insert, update, delete on table public\.user_data to authenticated/);
  assert.doesNotMatch(sql, /grant all[^;]*to authenticated/s);
});

test('migration creates private RLS-protected reminder and subscription tables', () => {
  const sql = readRequired(migrationPath, 'task reminder migration').toLowerCase();

  for (const table of ['push_subscriptions', 'task_reminders', 'push_deliveries']) {
    assert.match(sql, new RegExp(`create table if not exists public\\.${table}`));
    assert.match(sql, /enable row level security/);
    assert.match(sql, new RegExp(`revoke all[^;]*${table}[^;]*from (?:public, )?anon, authenticated`, 's'));
  }
  assert.match(sql, /grant all[^;]*push_subscriptions[^;]*service_role/s);
  assert.match(sql, /grant all[^;]*task_reminders[^;]*service_role/s);
  assert.match(sql, /grant all[^;]*push_deliveries[^;]*service_role/s);
});

test('user_data trigger schedules only valid incomplete reminders in the task timezone', () => {
  const sql = readRequired(migrationPath, 'task reminder migration').toLowerCase();
  const reminderTable = sql.match(/create table if not exists public\.task_reminders \([\s\S]*?\n\);/)?.[0] || '';

  assert.match(sql, /security definer/);
  assert.match(sql, /set search_path\s*=\s*pg_catalog, public/);
  assert.match(sql, /after insert or update of data or delete on public\.user_data/);
  assert.match(sql, /create trigger task_reminders_from_user_data[\s\S]*?for each row execute function public\.refresh_task_reminders_from_user_data\(\);\s*(?:--[^\n]*\s*)?update public\.user_data set data = data;/);
  assert.match(sql, /jsonb_array_elements/);
  assert.match(sql, /pg_timezone_names/);
  assert.match(sql, /0\|5\|15\|30\|60/);
  assert.match(sql, /at time zone/);
  assert.match(sql, /task_reminders/);
  assert.doesNotMatch(reminderTable, /task_text|todo_text|title|content/);
});

test('delivery claims dedupe concurrent minute scans and can reclaim expired leases', () => {
  const sql = readRequired(migrationPath, 'task reminder migration').toLowerCase();

  assert.match(sql, /unique\s*\(user_id,\s*reminder_id,\s*fire_at,\s*subscription_id\)/);
  assert.match(sql, /claim_due_task_reminders/);
  assert.match(sql, /register_push_subscription/);
  assert.match(sql, /on conflict/);
  assert.match(sql, /claimed_at/);
  assert.match(sql, /expires_at <= p_now/);
  assert.match(sql, /prior\.status in \('sent', 'expired'\)/);
  assert.match(sql, /attempts < 5/);
  assert.match(sql, /existing\.claimed_at < p_now - make_interval\(secs => v_lease_seconds\)/);
  assert.match(sql, /finish_task_reminder_delivery/);
  assert.match(sql, /revoke all on function[^;]*from public, anon, authenticated/s);
});

test('subscription endpoint requires a verified user and scopes mutations to that account', () => {
  const source = readRequired(managePath, 'subscription function');

  assert.match(source, /withSupabase\(\{\s*auth:\s*'user'\s*\}/);
  assert.match(source, /ctx\.userClaims\.sub/);
  assert.match(source, /public-key/);
  assert.match(source, /subscribe/);
  assert.match(source, /unsubscribe/);
  assert.match(source, /ctx\.supabaseAdmin/);
  assert.match(source, /register_push_subscription/);
  assert.doesNotMatch(source, /from\('push_subscriptions'\)\.upsert/);
  assert.match(source, /https:/);
  assert.match(source, /fcm\.googleapis\.com/);
  assert.match(source, /push\.services\.mozilla\.com/);
  assert.match(source, /web\.push\.apple\.com/);
  assert.match(source, /notify\.windows\.com/);
  assert.match(source, /p256dh/);
  assert.match(source, /auth/);
});

test('scheduled sender checks a separate cron secret and sends generic payloads', () => {
  const source = readRequired(senderPath, 'scheduled reminder function');
  const config = readRequired(supabaseConfigPath, 'Supabase config');
  const packageConfig = JSON.parse(readRequired(senderConfigPath, 'sender dependency config'));
  const gitignore = readRequired(path.join(root, '.gitignore'), 'gitignore');
  const deploymentGuide = readRequired(deploymentGuidePath, 'deployment guide');

  assert.match(source, /withSupabase\(\{\s*auth:\s*'none'\s*\}/);
  assert.match(source, /TASK_REMINDER_CRON_SECRET/);
  assert.match(source, /x-task-reminder-secret/i);
  assert.match(source, /claim_due_task_reminders/);
  assert.match(source, /finish_task_reminder_delivery/);
  assert.match(source, /sendNotification/);
  assert.match(source, /有一项待办即将到期/);
  assert.doesNotMatch(source, /todo\.text|task\.text/);
  assert.match(config, /\[functions\.manage-push-subscription\][\s\S]*?verify_jwt\s*=\s*true/);
  assert.match(config, /\[functions\.send-task-reminders\][\s\S]*?verify_jwt\s*=\s*true/);
  assert.match(deploymentGuide, /'Authorization',\s*'Bearer ' \|\|/);
  assert.doesNotMatch(deploymentGuide, /--no-verify-jwt/);
  assert.match(JSON.stringify(packageConfig), /web-push@3\.6\.7/);
  assert.match(gitignore, /supabase\/functions\/\.env/);
});

test('deployment guide records manually applied production migrations before future pushes', () => {
  const deploymentGuide = readRequired(deploymentGuidePath, 'deployment guide');

  assert.match(deploymentGuide, /schema_migrations/);
  assert.match(deploymentGuide, /create schema if not exists supabase_migrations/i);
  assert.match(deploymentGuide, /insert into supabase_migrations\.schema_migrations/i);
  assert.match(deploymentGuide, /alter table supabase_migrations\.schema_migrations enable row level security/i);
  assert.match(deploymentGuide, /20261024000000[\s\S]*20261025000000/);
  assert.match(deploymentGuide, /两个版本都显示为已应用以前，不要运行 `supabase db push`/);
});
