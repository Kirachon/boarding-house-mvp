-- Fix infinite recursion in channel policies
-- We use a SECURITY DEFINER function to fetch the user's channels without triggering RLS recursively.

-- 1. Create helper function to get user's channel IDs safely
CREATE OR REPLACE FUNCTION public.get_my_channel_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT channel_id FROM channel_members WHERE user_id = auth.uid()
$$;

-- 2. Drop existing problematic policies

-- Drop policies on chat_channels
DROP POLICY IF EXISTS "Users can view channels they are members of" ON public.chat_channels;

-- Drop policies on channel_members
DROP POLICY IF EXISTS "Users can view other members in their channels" ON public.channel_members;
DROP POLICY IF EXISTS "Users can view their memberships" ON public.channel_members;

-- 3. Create new non-recursive policies

-- Policy for chat_channels: View channel if ID is in my list of channels
CREATE POLICY "Users can view channels they are members of"
ON public.chat_channels FOR SELECT
USING (
  id IN (SELECT get_my_channel_ids())
);

-- Policy for channel_members: View member row if:
-- a) It's me (simple check)
-- b) OR it's a member of a channel I am in (via safe function)
CREATE POLICY "Users can view channel members"
ON public.channel_members FOR SELECT
USING (
  user_id = auth.uid()
  OR
  channel_id IN (SELECT get_my_channel_ids())
);
