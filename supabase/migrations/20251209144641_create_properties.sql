-- Create Properties Table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Establish Relationship between Rooms and Properties (Adding property_id to Rooms)
-- Note: In a real app we might migrate data, but since we are dev, we will truncate or just add column
-- Strategy: Add column nullable, then update dummy data, then set not null if possible (or leave nullable for simplicity)
ALTER TABLE public.rooms ADD COLUMN property_id UUID REFERENCES public.properties(id);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies for Properties
-- Public: Read Only
CREATE POLICY "Public read properties"
ON public.properties
FOR SELECT
USING (true);

-- Owner: Full Access
CREATE POLICY "Owner manage properties"
ON public.properties
USING (
  auth.uid() = owner_id
)
WITH CHECK (
  auth.uid() = owner_id
);

-- Seed Data (Create a property and link existing rooms)
-- We need to find an owner ID. Since this is SQL migration, we can't easily grab a specific user ID unless we know it.
-- Strategy: We will create a property and assign it to the *first* owner we find in the auth system, OR 
-- for development predictability, we just insert one and rely on the Dashboard to assign it later or let it be 'orphaned' but viewable by ID.
-- Better yet: If we are just viewing by ID in the public page, the owner_id doesn't strictly matter for the *view* unless we filter.
-- Let's just create one.

INSERT INTO public.properties (id, owner_id, name, address, description, amenities)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000000', 'Sunset Hive Boarding House', '123 Mango Avenue, Cebu City', 'A cozy and secure home for students and professionals. Walking distance to IT Park.', ARRAY['Fast Wifi', 'CCTV', 'Weekly Cleaning', 'Aircon'])
ON CONFLICT DO NOTHING;

-- Link our seed rooms to this property (Assuming rooms exist from previous step, we update them)
UPDATE public.rooms SET property_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' WHERE property_id IS NULL;
