-- Create enums
CREATE TYPE public.grievance_category AS ENUM ('wifi', 'cleaning', 'maintenance', 'other');
CREATE TYPE public.grievance_status AS ENUM ('open', 'in_progress', 'resolved', 'rejected');

-- Create grievances table
CREATE TABLE public.grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.grievance_category NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  status public.grievance_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;

-- Policy 1: Tenants can view their own grievances
CREATE POLICY "Tenants can view own grievances"
ON public.grievances FOR SELECT
USING (auth.uid() = tenant_id);

-- Policy 2: Tenants can insert their own grievances
CREATE POLICY "Tenants can insert own grievances"
ON public.grievances FOR INSERT
WITH CHECK (auth.uid() = tenant_id);

-- Policy 3: Owners can view all grievances
-- (Using the trusted JWT metadata role check)
CREATE POLICY "Owners can view all grievances"
ON public.grievances FOR SELECT
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
);

-- Policy 4: Owners can update grievance status
CREATE POLICY "Owners can update grievance status"
ON public.grievances FOR UPDATE
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
)
WITH CHECK (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
);
