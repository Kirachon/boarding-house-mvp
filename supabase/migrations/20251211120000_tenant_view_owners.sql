-- Allow tenants to view owner profiles
-- This is necessary for tenants to be able to find and chat with owners

CREATE POLICY "Tenants can view owner profiles"
ON public.profiles FOR SELECT
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'tenant' 
  AND 
  role = 'owner'
);
