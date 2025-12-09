-- Create invoices table
CREATE TYPE public.invoice_status AS ENUM ('unpaid', 'paid', 'overdue', 'cancelled');

CREATE TABLE public.invoices (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status public.invoice_status NOT NULL DEFAULT 'unpaid',
    description TEXT NOT NULL DEFAULT 'Rent', -- Simple description for MVP
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT invoices_pkey PRIMARY KEY (id),
    CONSTRAINT invoices_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.users(id)
);

-- RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Owner can manage all invoices (assuming owner role check in policy)
CREATE POLICY "Owner manage invoices" ON public.invoices
    FOR ALL
    USING (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
    );

-- Tenant can view own invoices
CREATE POLICY "Tenant view own invoices" ON public.invoices
    FOR SELECT
    USING (
        auth.uid() = tenant_id
    );
