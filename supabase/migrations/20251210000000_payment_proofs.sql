-- Create storage bucket for payment proofs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Add proof_image_url to invoices table
ALTER TABLE public.invoices
ADD COLUMN proof_image_url TEXT;

-- Update invoice_status enum to include 'pending_verification'
-- Note: PostgreSQL doesn't support IF NOT EXISTS for ADD VALUE, so we wrap it in a DO block
DO $$
BEGIN
    ALTER TYPE invoice_status ADD VALUE 'pending_verification';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Policies for storage
-- Allow authenticated users (tenants) to upload proofs
CREATE POLICY "Authenticated users can upload proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'payment_proofs' );

-- Allow authenticated users to view proofs (owners need to see them, tenants need to see their own)
-- For simplicity in this MVP, we'll allow auth users to read from this bucket
CREATE POLICY "Authenticated users can view proofs"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'payment_proofs' );

-- Ensure tenants can update their own invoices to set proof_image_url and status
-- Existing policies might be "owner only" for full update, let's check or add specific policy
CREATE POLICY "Tenants can update own invoices for payment proof"
ON public.invoices FOR UPDATE
TO authenticated
USING ( tenant_id = auth.uid() )
WITH CHECK ( tenant_id = auth.uid() );
