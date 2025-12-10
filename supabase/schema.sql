-- Windsurf Issue & Feedback Hub schema
-- Run inside Supabase SQL editor or via `supabase db push`

create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text check (role in ('admin','member')) default 'member',
  department text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.technical_issues (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now()),
  title text not null,
  description text not null,
  category text not null,
  severity text check (severity in ('low','medium','high','critical')) not null,
  status text check (status in ('open','in_progress','resolved','blocked')) default 'open',
  environment text,
  reporter_id uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  attachment_url text,
  resolution_summary text,
  expected_behavior text,
  tags text[]
);

create table if not exists public.feedback_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc', now()),
  sentiment text check (sentiment in ('positive','neutral','negative')) not null,
  category text not null,
  message text not null,
  channel text check (channel in ('web','slack','email','other')) default 'web',
  submitted_by uuid references auth.users(id),
  is_anonymous boolean default true,
  metadata jsonb
);

-- Helpful indexes
create index if not exists issues_status_idx on technical_issues(status);
create index if not exists issues_severity_idx on technical_issues(severity);
create index if not exists feedback_sentiment_idx on feedback_entries(sentiment);

-- Enable RLS
alter table user_profiles enable row level security;
alter table technical_issues enable row level security;
alter table feedback_entries enable row level security;

-- Policies
create policy if not exists "profiles readable by owner or admins" on user_profiles
  for select using (
    auth.uid() = id or exists (
      select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'
    )
  );

create policy if not exists "users manage own profile" on user_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy if not exists "issue reporters insert" on technical_issues
  for insert with check (auth.uid() = reporter_id);

create policy if not exists "issue reporters read own, admins all" on technical_issues
  for select using (
    reporter_id = auth.uid() or exists (
      select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'
    )
  );

create policy if not exists "admins manage issues" on technical_issues
  for all using (
    exists (
      select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'
    )
  );

create policy if not exists "any user can submit feedback" on feedback_entries
  for insert with check (true);

create policy if not exists "admins read all feedback" on feedback_entries
  for select using (
    exists (
      select 1 from user_profiles up where up.id = auth.uid() and up.role = 'admin'
    )
  );

create policy if not exists "authors read own feedback" on feedback_entries
  for select using (submitted_by = auth.uid());
