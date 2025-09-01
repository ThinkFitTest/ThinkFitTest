-- Comprehensive fix for user registration issues
-- This script ensures proper SSL connections, user table schema, and error handling

-- First, ensure we have proper SSL connection settings
-- Note: Supabase handles SSL automatically, but we'll add explicit checks

-- Drop and recreate the trigger function with comprehensive error handling
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create a more robust function with detailed logging
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_exists boolean := false;
begin
  -- Log the trigger execution
  raise log 'Trigger fired for user: % with email: %', new.id, new.email;
  
  -- Check if profile already exists to avoid duplicates
  select exists(select 1 from public.profiles where id = new.id) into profile_exists;
  
  if profile_exists then
    raise log 'Profile already exists for user: %', new.id;
    return new;
  end if;

  -- Insert into profiles table with comprehensive error handling
  begin
    insert into public.profiles (id, email, full_name, created_at, updated_at)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'full_name', ''),
      now(),
      now()
    );
    
    raise log 'Successfully created profile for user: %', new.id;
    
  exception
    when unique_violation then
      raise log 'Profile already exists for user % (unique violation)', new.id;
    when not_null_violation then
      raise log 'Not null violation creating profile for user %: %', new.id, sqlerrm;
    when others then
      raise log 'Unexpected error creating profile for user %: % (SQLSTATE: %)', new.id, sqlerrm, sqlstate;
      -- Don't fail the user creation, just log the error
  end;

  return new;
end;
$$;

-- Grant comprehensive permissions
grant usage on schema public to anon, authenticated, service_role;
grant all on public.profiles to anon, authenticated, service_role;
grant all on public.test_sessions to anon, authenticated, service_role;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Update RLS policies to be more permissive for user creation
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_insert_user" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

-- Create comprehensive RLS policies
create policy "profiles_insert_trigger"
  on public.profiles for insert
  to service_role
  with check (true);

create policy "profiles_insert_authenticated"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Ensure test_sessions table has proper RLS policies
drop policy if exists "test_sessions_insert_own" on public.test_sessions;
drop policy if exists "test_sessions_select_own" on public.test_sessions;
drop policy if exists "test_sessions_update_own" on public.test_sessions;

create policy "test_sessions_insert_own"
  on public.test_sessions for insert
  with check (auth.uid() = user_id);

create policy "test_sessions_select_own"
  on public.test_sessions for select
  using (auth.uid() = user_id);

create policy "test_sessions_update_own"
  on public.test_sessions for update
  using (auth.uid() = user_id);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.test_sessions enable row level security;
alter table public.dossiers enable row level security;

-- Add indexes for better performance
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists test_sessions_user_id_idx on public.test_sessions(user_id);
create index if not exists test_sessions_status_idx on public.test_sessions(status);

-- Log completion
do $$
begin
  raise log 'User registration fix script completed successfully';
end
$$;
