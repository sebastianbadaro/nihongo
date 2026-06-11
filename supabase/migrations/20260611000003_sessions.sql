-- sessions: one row per quiz attempt.
-- started_at is set on creation; ended_at is set when the quiz finishes
-- (or left null if the user closes the tab mid-session).

create table public.sessions (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  unit_id        text        not null,
  question_count int,
  score          int,
  started_at     timestamptz not null default now(),
  ended_at       timestamptz
);

create index sessions_user_id_idx  on public.sessions (user_id);
create index sessions_unit_id_idx  on public.sessions (unit_id);
create index sessions_started_idx  on public.sessions (started_at);

alter table public.sessions enable row level security;

create policy "sessions_select_own" on public.sessions
  for select
  using (auth.uid() = user_id);

create policy "sessions_insert_own" on public.sessions
  for insert
  with check (auth.uid() = user_id);

create policy "sessions_update_own" on public.sessions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "sessions_select_admin" on public.sessions
  for select
  using (public.is_admin() = true);
