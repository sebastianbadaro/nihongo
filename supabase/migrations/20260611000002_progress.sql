-- progress: tracks correct/failed question IDs per user per question pool.
-- content_hash is a SHA-256 of the sorted question IDs in the pool,
-- so progress resets automatically if the pool changes significantly.

create table public.progress (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  content_hash text        not null,
  correct_ids  text[]      not null default '{}',
  failed_ids   text[]      not null default '{}',
  updated_at   timestamptz not null default now(),

  unique (user_id, content_hash)
);

create index progress_user_id_idx on public.progress (user_id);

alter table public.progress enable row level security;

-- Users read and write their own progress rows only.
create policy "progress_select_own" on public.progress
  for select
  using (auth.uid() = user_id);

create policy "progress_insert_own" on public.progress
  for insert
  with check (auth.uid() = user_id);

create policy "progress_update_own" on public.progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can read all rows.
create policy "progress_select_admin" on public.progress
  for select
  using (public.is_admin() = true);
