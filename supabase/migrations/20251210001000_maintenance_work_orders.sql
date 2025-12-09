-- Maintenance & Vendor Management
-- Enums for work orders
CREATE TYPE public.work_order_status AS ENUM ('open', 'in_progress', 'waiting_vendor', 'completed', 'cancelled');
CREATE TYPE public.work_order_priority AS ENUM ('low', 'medium', 'high');

-- Vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  services TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Owners manage vendors
CREATE POLICY "Owner manage vendors" ON public.vendors
  FOR ALL
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
  );

-- Work orders table
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id UUID REFERENCES public.grievances(id) ON DELETE SET NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority public.work_order_priority NOT NULL DEFAULT 'medium',
  status public.work_order_status NOT NULL DEFAULT 'open',
  scheduled_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  labor_cost NUMERIC(10,2),
  materials_cost NUMERIC(10,2),
  total_cost NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

-- Owners manage work orders
CREATE POLICY "Owner manage work orders" ON public.work_orders
  FOR ALL
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
  );

-- Simple trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.set_current_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_work_orders_updated_at
BEFORE UPDATE ON public.work_orders
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp();

