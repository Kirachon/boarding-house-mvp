-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'success', 'error')) DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a trigger to auto-create notifications (optional, but good for demo)
-- For example, when an invoice is paid, notify owner
CREATE OR REPLACE FUNCTION public.handle_invoice_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    -- Notify Owner (finding owner might be tricky if we don't have owner_id on invoice directly, 
    -- but usually we can assume there's a way. For MVP, we'll just insert if we know the owner.
    -- Actually, simpler: when tenant uploads proof, notify owner?
    -- Let's just create the table first. Triggers can be complex without knowing exact owner mapping.)
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
