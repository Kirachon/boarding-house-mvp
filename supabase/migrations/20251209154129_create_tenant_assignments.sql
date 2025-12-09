-- Create table for linking tenants to rooms
CREATE TABLE public.tenant_room_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL, 
    room_id UUID NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT tenant_room_assignments_pkey PRIMARY KEY (id),
    CONSTRAINT tenant_room_assignments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.users(id),
    CONSTRAINT tenant_room_assignments_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id)
);

-- RLS: Owner can manage all assignments
ALTER TABLE public.tenant_room_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manage assignments" ON public.tenant_room_assignments
    FOR ALL
    USING (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
    );

-- RLS: Tenant can view their own assignment
CREATE POLICY "Tenant view own assignment" ON public.tenant_room_assignments
    FOR SELECT
    USING (
        auth.uid() = tenant_id
    );
