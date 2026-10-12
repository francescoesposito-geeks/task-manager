-- Database for NEXT_PUBLIC_TASKS_STORAGE=supabase
-- Run it in Supabase dashboard -> SQL Editor -> New query -> Run.
-- It can be run more than once: it creates only what is missing.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 50),
  description text check (char_length(description) <= 250),
  priority text not null check (priority in ('importante', 'non-importante')),
  urgency text not null check (urgency in ('urgente', 'non-urgente')),
  state text not null check (state in ('to-do', 'doing', 'testing', 'done', 'blocked')),
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  constraint end_after_start check (end_date >= start_date)
);

-- Projects created with an older version of the app already have a "tasks"
-- table without owner: this adds the column. Old tasks without an owner
-- stay in the table but no user can see them.
alter table public.tasks
  add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;

create index if not exists tasks_user_id_idx on public.tasks (user_id);

-- Row Level Security: without it anyone with the public key
-- could read or change every task.
alter table public.tasks enable row level security;

-- Removes every old policy on the table (for example an "allow all" rule
-- created while testing): policies add up, so one open rule would expose
-- all tasks even with the rules below.
do $$
declare
  old_policy record;
begin
  for old_policy in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'tasks'
  loop
    execute format('drop policy %I on public.tasks', old_policy.policyname);
  end loop;
end $$;

drop policy if exists "Users can read their own tasks" on public.tasks;
create policy "Users can read their own tasks"
  on public.tasks for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their own tasks" on public.tasks;
create policy "Users can add their own tasks"
  on public.tasks for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks"
  on public.tasks for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks"
  on public.tasks for delete
  to authenticated
  using ((select auth.uid()) = user_id);
