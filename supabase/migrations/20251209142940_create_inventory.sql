-- Create new Enums
CREATE TYPE public.item_condition AS ENUM ('good', 'fair', 'poor', 'broken');
CREATE TYPE public.room_occupancy AS ENUM ('vacant', 'occupied', 'maintenance');

-- Create Rooms Table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  occupancy public.room_occupancy NOT NULL DEFAULT 'vacant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Inventory Items Table
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  condition public.item_condition NOT NULL DEFAULT 'good',
  last_checked TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Policies for Rooms
-- Owner: Full Access
CREATE POLICY "Owner manage rooms"
ON public.rooms
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
)
WITH CHECK (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
);

-- Policies for Inventory
-- Owner: Full Access
CREATE POLICY "Owner manage inventory"
ON public.inventory_items
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
)
WITH CHECK (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
);

-- Seed Data (Insert 4 Rooms with items)
DO $$
DECLARE
  r_id UUID;
BEGIN
  -- Room 101
  INSERT INTO public.rooms (name, occupancy) VALUES ('Room 101', 'occupied') RETURNING id INTO r_id;
  INSERT INTO public.inventory_items (room_id, name, condition) VALUES 
    (r_id, 'Bed Frame', 'good'),
    (r_id, 'Mattress', 'fair'),
    (r_id, 'Desk', 'good'),
    (r_id, 'Chair', 'poor');

  -- Room 102
  INSERT INTO public.rooms (name, occupancy) VALUES ('Room 102', 'vacant') RETURNING id INTO r_id;
  INSERT INTO public.inventory_items (room_id, name, condition) VALUES 
    (r_id, 'Bed Frame', 'good'),
    (r_id, 'Mattress', 'good'),
    (r_id, 'Curtains', 'good');
    
  -- Room 201
  INSERT INTO public.rooms (name, occupancy) VALUES ('Room 201', 'occupied') RETURNING id INTO r_id;
  INSERT INTO public.inventory_items (room_id, name, condition) VALUES 
    (r_id, 'AC Unit', 'broken'),
    (r_id, 'Bed Frame', 'good');

  -- Room 202
  INSERT INTO public.rooms (name, occupancy) VALUES ('Room 202', 'maintenance') RETURNING id INTO r_id;
  INSERT INTO public.inventory_items (room_id, name, condition) VALUES 
    (r_id, 'Window', 'broken'),
    (r_id, 'Floor Tiles', 'poor');
END $$;
