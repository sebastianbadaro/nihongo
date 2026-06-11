-- question_versions: full question JSON snapshot keyed by content hash.
-- Written by the frontend when a question is first displayed (upsert, no duplicates).
-- Readable by anyone — used to reconstruct the exact question a user saw at answer time.

create table public.question_versions (
  content_hash text        primary key,
  question_id  text,
  unit_id      text,
  snapshot     jsonb       not null,
  created_at   timestamptz not null default now()
);

create index question_versions_question_id_idx on public.question_versions (question_id);
create index question_versions_unit_id_idx     on public.question_versions (unit_id);

alter table public.question_versions enable row level security;

-- Anyone can read (needed by revision and analytics tools).
create policy "question_versions_select_all" on public.question_versions
  for select
  using (true);

-- Authenticated users can upsert — records the version of each question they saw.
create policy "question_versions_upsert_auth" on public.question_versions
  for insert
  with check (auth.uid() is not null);

create policy "question_versions_update_auth" on public.question_versions
  for update
  using (auth.uid() is not null);

-- Admins have full access.
create policy "question_versions_all_admin" on public.question_versions
  for all
  using (public.is_admin() = true);
