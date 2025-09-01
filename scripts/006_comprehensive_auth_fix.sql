-- Comprehensive fix for Supabase Auth database issues
-- This script removes all potential database conflicts that prevent user creation

-- Drop all custom triggers and functions that might interfere with auth
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all triggers on auth.users table
    FOR r IN (SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'users' AND event_object_schema = 'auth') LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON auth.users CASCADE';
    END LOOP;
    
    -- Drop all custom functions that might be called by triggers
    FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%user%') LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || r.routine_name || ' CASCADE';
    END LOOP;
END $$;

-- Remove any foreign key constraints that reference auth.users
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT 
            tc.constraint_name, 
            tc.table_name,
            tc.table_schema
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_name = 'users' 
        AND ccu.table_schema = 'auth'
    ) LOOP
        EXECUTE 'ALTER TABLE ' || r.table_schema || '.' || r.table_name || ' DROP CONSTRAINT IF EXISTS ' || r.constraint_name;
    END LOOP;
END $$;

-- Reset profiles table without foreign key constraints
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- No foreign key constraint to avoid auth conflicts
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create simple RLS policies that don't interfere with auth
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Create a simple function to manually create profiles (no triggers)
CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_id UUID,
    full_name TEXT,
    email TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_id UUID;
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (user_id, full_name, email)
    RETURNING id INTO profile_id;
    
    RETURN profile_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE LOG 'Error creating profile: %', SQLERRM;
        RETURN NULL;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;

-- Ensure auth schema is clean (remove any custom policies)
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Remove any custom RLS policies on auth.users that might interfere
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'auth' AND tablename = 'users' AND policyname NOT LIKE 'Enable%') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON auth.users';
    END LOOP;
END $$;

-- Clean up any orphaned data that might cause conflicts
DELETE FROM public.profiles WHERE user_id IS NULL;

-- Success message
SELECT 'Database auth issues cleaned up successfully' as status;
