-- answers: one row per question answered within a session.

create table public.answers (
  id             uuid        primary key default gen_random_uuid(),
  session_id     uuid        not null references public.sessions(id) on delete cascade,
  user_id        uuid        not null references auth.users(id) on delete cascade,
  question_id    text        not null,
  chosen_option  text        not null,
  is_correct     boolean     not null,
  answered_at    timestamptz not null default now()
);

create index answers_session_id_idx   on public.answers (session_id);
create index answers_user_id_idx      on public.answers (user_id);
create index answers_question_id_idx  on public.answers (question_id);

alter table public.answers enable row level security;

create policy "answers_select_own" on public.answers
  for select
  using (auth.uid() = user_id);

-- Users can only insert answers for their own sessions.
create policy "answers_insert_own" on public.answers
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.sessions
      where id = session_id
        and user_id = auth.uid()
    )
  );

create policy "answers_select_admin" on public.answers
  for select
  using (public.is_admin() = true);
