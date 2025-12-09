-- Simple documents table for lease and other files
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lease', 'other')),
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Tenants can see their own documents
CREATE POLICY "Tenant view own documents" ON public.documents
  FOR SELECT
  USING (auth.uid() = tenant_id);

-- Owners can view all documents
CREATE POLICY "Owner view documents" ON public.documents
  FOR SELECT
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
  );

-- Room handover checklist table (move-in / move-out acknowledgment)
CREATE TABLE public.room_handover_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.users(id),
  room_id UUID REFERENCES public.rooms(id),
  type TEXT NOT NULL CHECK (type IN ('move_in', 'move_out')),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (tenant_id, room_id, type)
);

ALTER TABLE public.room_handover_checklists ENABLE ROW LEVEL SECURITY;

-- Tenants manage their own checklists
CREATE POLICY "Tenant manage own checklists" ON public.room_handover_checklists
  FOR ALL
  USING (auth.uid() = tenant_id)
  WITH CHECK (auth.uid() = tenant_id);

-- Owners can view all checklists
CREATE POLICY "Owner view checklists" ON public.room_handover_checklists
  FOR SELECT
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
  );
