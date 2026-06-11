-- profiles: one row per auth.users entry, auto-created on signup.
-- Stores display name, email, and admin flag.

create table public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  display_name text,
  email        text,
  is_admin     boolean     not null default false,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper used by other tables' policies to check admin without causing recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  )
$$;

-- Users can read their own profile.
create policy "profiles_select_own" on public.profiles
  for select
  using (auth.uid() = id);

-- Admins can read all profiles.
create policy "profiles_select_admin" on public.profiles
  for select
  using (public.is_admin() = true);

-- Users can update their own display_name (not is_admin).
create policy "profiles_update_own" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile row when a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
