-- 1. Create Announcements Table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Owner can do EVERYTHING
CREATE POLICY "Owner manage announcements" ON public.announcements
    FOR ALL
    USING (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
    );

-- Tenants can VIEW active announcements
CREATE POLICY "Tenants view active announcements" ON public.announcements
    FOR SELECT
    USING (
        is_active = TRUE
    );

-- 2. Create Expenses Table
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('utilities', 'repairs', 'supplies', 'maintenance', 'other')),
    amount NUMERIC(10,2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Owner can do EVERYTHING
CREATE POLICY "Owner manage expenses" ON public.expenses
    FOR ALL
    USING (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
    );

-- 3. Update Lease Management in Assignments
ALTER TABLE public.tenant_room_assignments
ADD COLUMN lease_start DATE,
ADD COLUMN lease_end DATE;

-- Optional: Add a check constraint to ensure end > start? 
-- Staying simple for MVP to avoid migration conflicts with existing data if any (though existing data has nulls so it's fine).
