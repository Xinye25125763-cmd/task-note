-- Keep one cloud data row per authenticated user. The application uses
-- `user_id` as the upsert conflict target.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

-- This table contains private user data and is only accessed by signed-in
-- clients. Service-role access remains governed by Supabase's service role.
revoke all on table public.user_data from anon;
grant select, insert, update, delete on table public.user_data to authenticated;

-- Policies are permissive by default, so keep these names stable and replace
-- them on reruns to avoid duplicate or stale definitions from this migration.
drop policy if exists task_note_user_data_select_own on public.user_data;
create policy task_note_user_data_select_own
  on public.user_data
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists task_note_user_data_insert_own on public.user_data;
create policy task_note_user_data_insert_own
  on public.user_data
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists task_note_user_data_update_own on public.user_data;
create policy task_note_user_data_update_own
  on public.user_data
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists task_note_user_data_delete_own on public.user_data;
create policy task_note_user_data_delete_own
  on public.user_data
  for delete
  to authenticated
  using (auth.uid() = user_id);
