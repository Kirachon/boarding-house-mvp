-- Create table for recurring invoice settings
CREATE TABLE IF NOT EXISTS public.recurring_invoice_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid REFERENCES public.tenant_room_assignments(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10, 2) NOT NULL,
  day_of_month integer NOT NULL DEFAULT 1 CHECK (day_of_month BETWEEN 1 AND 28),
  next_run_date date NOT NULL,
  is_active boolean DEFAULT true,
  job_name text DEFAULT 'Monthly Rent',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one active setting per assignment per job name
  UNIQUE(assignment_id, job_name)
);

-- Enable RLS
ALTER TABLE public.recurring_invoice_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Owners can view/manage settings for their properties
CREATE POLICY "Owners can view recurring settings for their properties"
ON public.recurring_invoice_settings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_room_assignments tra
    JOIN public.rooms r ON tra.room_id = r.id
    JOIN public.properties p ON r.property_id = p.id
    WHERE tra.id = recurring_invoice_settings.assignment_id
    AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can insert recurring settings for their properties"
ON public.recurring_invoice_settings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tenant_room_assignments tra
    JOIN public.rooms r ON tra.room_id = r.id
    JOIN public.properties p ON r.property_id = p.id
    WHERE tra.id = assignment_id
    AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can update recurring settings for their properties"
ON public.recurring_invoice_settings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_room_assignments tra
    JOIN public.rooms r ON tra.room_id = r.id
    JOIN public.properties p ON r.property_id = p.id
    WHERE tra.id = recurring_invoice_settings.assignment_id
    AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete recurring settings for their properties"
ON public.recurring_invoice_settings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_room_assignments tra
    JOIN public.rooms r ON tra.room_id = r.id
    JOIN public.properties p ON r.property_id = p.id
    WHERE tra.id = recurring_invoice_settings.assignment_id
    AND p.owner_id = auth.uid()
  )
);
