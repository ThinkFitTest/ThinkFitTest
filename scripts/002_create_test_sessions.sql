-- Create test sessions table to track user test attempts
create table if not exists public.test_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  test_type text not null check (test_type in ('complete', 'tat', 'wat', 'srt', 'self_description')),
  status text not null default 'started' check (status in ('started', 'in_progress', 'completed', 'abandoned')),
  payment_amount integer, -- in paise (₹1799 = 179900 paise)
  payment_status text default 'pending' check (payment_status in ('pending', 'completed', 'failed')),
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  results jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.test_sessions enable row level security;

-- Create policies
create policy "test_sessions_select_own"
  on public.test_sessions for select
  using (auth.uid() = user_id);

create policy "test_sessions_insert_own"
  on public.test_sessions for insert
  with check (auth.uid() = user_id);

create policy "test_sessions_update_own"
  on public.test_sessions for update
  using (auth.uid() = user_id);

-- Create index for better performance
create index if not exists test_sessions_user_id_idx on public.test_sessions(user_id);
create index if not exists test_sessions_status_idx on public.test_sessions(status);
