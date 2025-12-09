-- Allow application code to insert notifications rows
CREATE POLICY "Allow insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

