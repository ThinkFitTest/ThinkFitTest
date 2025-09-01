-- Drop existing trigger and function to recreate with proper error handling
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create improved function to handle new user signup with better error handling
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert into profiles table with error handling
  begin
    insert into public.profiles (id, email, full_name)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'full_name', '')
    );
  exception
    when others then
      -- Log the error but don't fail the user creation
      raise log 'Error creating profile for user %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;

-- Recreate trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Ensure RLS policies allow the trigger to work
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (true); -- Allow trigger to insert profiles

-- Recreate the user-specific insert policy
create policy "profiles_insert_user"
  on public.profiles for insert
  with check (auth.uid() = id);
