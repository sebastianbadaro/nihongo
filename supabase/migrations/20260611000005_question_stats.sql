-- question_stats: aggregated difficulty metrics per question.
-- Updated automatically by trigger on answers insert.
-- Readable by anyone (no auth required) — useful for future difficulty display.

create table public.question_stats (
  question_id       text    primary key,
  content_hash      text,
  total_answers     bigint  not null default 0,
  correct_answers   bigint  not null default 0,
  -- Per-distractor counts: {"option text": count, ...}
  distractor_counts jsonb   not null default '{}',
  -- difficulty = 1 - (correct / total), range [0, 1]; null when no answers.
  difficulty numeric generated always as (
    case when total_answers = 0 then null
         else round(1.0 - correct_answers::numeric / total_answers, 4)
    end
  ) stored,
  last_updated timestamptz not null default now()
);

alter table public.question_stats enable row level security;

-- Anyone can read question stats (useful for difficulty indicators).
create policy "question_stats_select_all" on public.question_stats
  for select
  using (true);

-- Only admins can manually modify stats (normal writes happen via trigger).
create policy "question_stats_all_admin" on public.question_stats
  for all
  using (public.is_admin() = true);

-- Trigger function: upsert stats when a new answer is recorded.
-- Runs as table owner (bypasses RLS).
create or replace function public.update_question_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.question_stats (
    question_id,
    total_answers,
    correct_answers,
    distractor_counts,
    last_updated
  )
  values (
    new.question_id,
    1,
    case when new.is_correct then 1 else 0 end,
    case when not new.is_correct
         then jsonb_build_object(new.chosen_option, 1)
         else '{}'::jsonb
    end,
    now()
  )
  on conflict (question_id) do update set
    total_answers   = question_stats.total_answers + 1,
    correct_answers = question_stats.correct_answers
                      + case when new.is_correct then 1 else 0 end,
    distractor_counts = case
      when not new.is_correct then
        jsonb_set(
          question_stats.distractor_counts,
          array[new.chosen_option],
          to_jsonb(
            coalesce(
              (question_stats.distractor_counts->>new.chosen_option)::int,
              0
            ) + 1
          )
        )
      else question_stats.distractor_counts
    end,
    last_updated = now();
  return new;
end;
$$;

create trigger on_answer_inserted
  after insert on public.answers
  for each row execute function public.update_question_stats();
