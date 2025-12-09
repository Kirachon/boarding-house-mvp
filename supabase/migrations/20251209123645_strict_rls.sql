-- Enforce strict RLS on profiles table

-- Drop the temporary "Allow all" policy
DROP POLICY IF EXISTS "Allow all access to profiles for now" ON public.profiles;

-- Create strict policies

-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Owners can view tenant profiles
-- This uses the user_metadata inside the JWT to avoid a recursive DB lookup
CREATE POLICY "Owners can view tenant profiles"
ON public.profiles FOR SELECT
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner' 
  AND 
  role = 'tenant'
);

-- Note: Inserting new profiles is handled by the trigger (SECURITY DEFINER), 
-- so no INSERT policy is needed for normal users.
