-- Allow tenants to view only their own work orders
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant view own work orders" ON public.work_orders
  FOR SELECT
  USING (auth.uid() = tenant_id);

