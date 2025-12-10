-- Add reminder preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN reminder_email_enabled BOOLEAN DEFAULT TRUE;

-- Track sent reminders to avoid duplicates
CREATE TABLE public.payment_reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  reminder_type TEXT CHECK (reminder_type IN ('7_days_before', 'due_date', '3_days_overdue')),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_reminders_sent ENABLE ROW LEVEL SECURITY;

-- Policy: Only service_role can insert (Edge Function uses service_role key)
-- But effectively, let's allow owners to view them if needed for audit
CREATE POLICY "Owners can view sent reminders" ON public.payment_reminders_sent
  FOR SELECT
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
  );

-- Service role bypasses RLS, so explicit policy for insert isn't strictly needed if we assume only Edge Function inserts,
-- but good practice to explicitly deny others or just leave it closed.
