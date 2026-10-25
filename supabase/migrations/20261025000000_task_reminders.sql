-- Web Push subscription material and send state are private server data.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint push_subscriptions_endpoint_matches_payload
    check (subscription->>'endpoint' = endpoint),
  constraint push_subscriptions_keys_are_present
    check (jsonb_typeof(subscription->'keys') = 'object'
      and nullif(subscription->'keys'->>'p256dh', '') is not null
      and nullif(subscription->'keys'->>'auth', '') is not null)
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id);

create table if not exists public.task_reminders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id text not null,
  reminder_id text not null,
  fire_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint task_reminders_user_reminder_unique unique (user_id, reminder_id)
);

create index if not exists task_reminders_due_idx
  on public.task_reminders (fire_at, user_id);

create table if not exists public.push_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reminder_id text not null,
  fire_at timestamptz not null,
  subscription_id uuid not null,
  status text not null check (status in ('sending', 'sent', 'failed', 'expired')),
  attempts integer not null default 1 check (attempts > 0),
  claimed_at timestamptz not null default now(),
  delivered_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default now(),
  constraint push_deliveries_once_per_subscription unique
    (user_id, reminder_id, fire_at, subscription_id)
);

create index if not exists push_deliveries_created_at_idx
  on public.push_deliveries (created_at);

alter table public.push_subscriptions enable row level security;
alter table public.task_reminders enable row level security;
alter table public.push_deliveries enable row level security;

revoke all on table public.push_subscriptions from public, anon, authenticated;
revoke all on table public.task_reminders from public, anon, authenticated;
revoke all on table public.push_deliveries from public, anon, authenticated;
grant all on table public.push_subscriptions to service_role;
grant all on table public.task_reminders to service_role;
grant all on table public.push_deliveries to service_role;

-- Keep the materialized reminder index synchronized with the user's current
-- JSON snapshot. No task title or body is copied to server reminder tables.
create or replace function public.refresh_task_reminders_from_user_data()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid;
  v_todo jsonb;
  v_task_id text;
  v_reminder_id text;
  v_date_text text;
  v_time_text text;
  v_offset_text text;
  v_time_zone text;
  v_due_date date;
  v_due_time time without time zone;
  v_offset_minutes integer;
  v_fire_at timestamptz;
begin
  if tg_op = 'DELETE' then
    v_user_id := old.user_id;
    delete from public.task_reminders where user_id = v_user_id;
    return old;
  end if;

  v_user_id := new.user_id;
  delete from public.task_reminders where user_id = v_user_id;

  if jsonb_typeof(new.data) is distinct from 'object'
     or jsonb_typeof(new.data->'todos') is distinct from 'array' then
    return new;
  end if;

  for v_todo in
    select value from jsonb_array_elements(new.data->'todos') as todo(value)
  loop
    if jsonb_typeof(v_todo) is distinct from 'object'
       or (v_todo->'done') = 'true'::jsonb
       or (v_todo ? 'done' and jsonb_typeof(v_todo->'done') is distinct from 'boolean') then
      continue;
    end if;

    v_task_id := nullif(v_todo->>'id', '');
    v_date_text := v_todo->>'date';
    v_time_text := v_todo->>'time';
    v_offset_text := v_todo->>'reminderMinutes';
    v_time_zone := v_todo->>'timeZone';

    if v_task_id is null
       or v_offset_text is null or v_offset_text !~ '^(0|5|15|30|60)$'
       or v_date_text is null or v_date_text !~ '^\d{4}-\d{2}-\d{2}$'
       or v_time_text is null or v_time_text !~ '^([01]\d|2[0-3]):[0-5]\d$'
       or nullif(v_time_zone, '') is null
       or not exists (select 1 from pg_timezone_names where name = v_time_zone) then
      continue;
    end if;

    begin
      v_due_date := v_date_text::date;
      if to_char(v_due_date, 'YYYY-MM-DD') <> v_date_text then
        continue;
      end if;
      v_due_time := v_time_text::time without time zone;
      v_offset_minutes := v_offset_text::integer;
    exception when others then
      continue;
    end;

    v_reminder_id := coalesce(nullif(v_todo->>'reminderId', ''), 'todo-' || v_task_id || '-reminder');
    v_fire_at := ((v_due_date + v_due_time) at time zone v_time_zone)
      - make_interval(mins => v_offset_minutes);

    insert into public.task_reminders (user_id, task_id, reminder_id, fire_at)
    values (v_user_id, v_task_id, v_reminder_id, v_fire_at)
    on conflict (user_id, reminder_id) do update
      set task_id = excluded.task_id,
          fire_at = excluded.fire_at,
          created_at = now();
  end loop;

  return new;
end;
$$;

revoke all on function public.refresh_task_reminders_from_user_data() from public, anon, authenticated;

drop trigger if exists task_reminders_from_user_data on public.user_data;
create trigger task_reminders_from_user_data
after insert or update of data or delete on public.user_data
for each row execute function public.refresh_task_reminders_from_user_data();

-- Do not let a caller claim another account's existing browser endpoint.
create or replace function public.register_push_subscription(
  p_user_id uuid,
  p_endpoint text,
  p_subscription jsonb,
  p_expires_at timestamptz default null
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_rows integer;
begin
  insert into public.push_subscriptions as existing
    (user_id, endpoint, subscription, expires_at, updated_at)
  values (p_user_id, p_endpoint, p_subscription, p_expires_at, now())
  on conflict (endpoint) do update
    set subscription = excluded.subscription,
        expires_at = excluded.expires_at,
        updated_at = now()
    where existing.user_id = excluded.user_id;

  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

revoke all on function public.register_push_subscription(uuid, text, jsonb, timestamptz) from public, anon, authenticated;
grant execute on function public.register_push_subscription(uuid, text, jsonb, timestamptz) to service_role;

-- Claiming is atomic. A unique delivery row prevents overlapping cron runs
-- from sending the same reminder to the same subscription more than once.
create or replace function public.claim_due_task_reminders(
  p_now timestamptz default now(),
  p_limit integer default 100,
  p_lease_seconds integer default 180
)
returns table (
  delivery_id uuid,
  user_id uuid,
  reminder_id text,
  fire_at timestamptz,
  subscription jsonb
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 100), 500));
  v_lease_seconds integer := greatest(30, least(coalesce(p_lease_seconds, 180), 900));
begin
  delete from public.push_subscriptions
  where expires_at is not null and expires_at <= p_now;
  delete from public.push_deliveries as delivery
  where delivery.created_at < p_now - interval '90 days'
    and not exists (
      select 1 from public.task_reminders r
      where r.user_id = delivery.user_id
        and r.reminder_id = delivery.reminder_id
        and r.fire_at = delivery.fire_at
    );

  return query
  with due as materialized (
    select r.user_id, r.reminder_id, r.fire_at, s.id as subscription_id
    from public.task_reminders r
    join public.push_subscriptions s on s.user_id = r.user_id
    where r.fire_at <= p_now
      and (s.expires_at is null or s.expires_at > p_now)
      and not exists (
        select 1 from public.push_deliveries prior
        where prior.user_id = r.user_id
          and prior.reminder_id = r.reminder_id
          and prior.fire_at = r.fire_at
          and prior.subscription_id = s.id
          and (
            prior.status in ('sent', 'expired')
            or (prior.attempts >= 5 and prior.status in ('failed', 'sending'))
            or (prior.status = 'sending'
                and prior.claimed_at >= p_now - make_interval(secs => v_lease_seconds))
          )
      )
    order by r.fire_at, r.user_id, r.reminder_id, s.id
    limit v_limit
  ), claimed as (
    insert into public.push_deliveries as existing
      (user_id, reminder_id, fire_at, subscription_id, status, attempts, claimed_at)
    select due.user_id, due.reminder_id, due.fire_at, due.subscription_id,
      'sending', 1, p_now
    from due
    on conflict on constraint push_deliveries_once_per_subscription do update
      set status = 'sending',
          attempts = existing.attempts + 1,
          claimed_at = p_now,
          last_error_code = null
      where (existing.status = 'failed'
             and existing.attempts < 5
             and existing.claimed_at < p_now - make_interval(secs => v_lease_seconds))
         or (existing.status = 'sending'
             and existing.attempts < 5
             and existing.claimed_at < p_now - make_interval(secs => v_lease_seconds))
    returning existing.id, existing.user_id, existing.reminder_id,
      existing.fire_at, existing.subscription_id
  )
  select claimed.id, claimed.user_id, claimed.reminder_id, claimed.fire_at, s.subscription
  from claimed
  join public.push_subscriptions s on s.id = claimed.subscription_id;
end;
$$;

create or replace function public.finish_task_reminder_delivery(
  p_delivery_id uuid,
  p_status text,
  p_error_code text default null
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_subscription_id uuid;
begin
  if p_status not in ('sent', 'failed', 'expired') then
    raise exception 'Unsupported task reminder delivery status';
  end if;

  update public.push_deliveries
  set status = p_status,
      delivered_at = case when p_status = 'sent' then now() else null end,
      last_error_code = case when p_status = 'failed' then left(p_error_code, 80) else null end
  where id = p_delivery_id and status = 'sending'
  returning subscription_id into v_subscription_id;

  if not found then
    return;
  end if;

  if p_status = 'expired' then
    delete from public.push_subscriptions where id = v_subscription_id;
  end if;
end;
$$;

revoke all on function public.claim_due_task_reminders(timestamptz, integer, integer) from public, anon, authenticated;
revoke all on function public.finish_task_reminder_delivery(uuid, text, text) from public, anon, authenticated;
grant execute on function public.claim_due_task_reminders(timestamptz, integer, integer) to service_role;
grant execute on function public.finish_task_reminder_delivery(uuid, text, text) to service_role;
