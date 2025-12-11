-- Function to create a chat channel and add members atomically
-- This bypasses the RLS issue where a user cannot select a channel they just created but haven't joined yet.

CREATE OR REPLACE FUNCTION public.create_chat_channel(
  p_type text,
  p_name text,
  p_other_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres), bypassing RLS
SET search_path = public
AS $$
DECLARE
  v_channel_id uuid;
  v_current_user_id uuid;
BEGIN
  v_current_user_id := auth.uid();

  -- 1. Create the channel
  INSERT INTO public.chat_channels (type, name)
  VALUES (p_type, p_name)
  RETURNING id INTO v_channel_id;

  -- 2. Add current user as member
  INSERT INTO public.channel_members (channel_id, user_id)
  VALUES (v_channel_id, v_current_user_id);

  -- 3. Add other user as member (if provided)
  IF p_other_user_id IS NOT NULL THEN
    INSERT INTO public.channel_members (channel_id, user_id)
    VALUES (v_channel_id, p_other_user_id);
  END IF;

  RETURN v_channel_id;
END;
$$;
