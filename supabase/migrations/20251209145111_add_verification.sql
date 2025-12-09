-- Add is_verified to properties
ALTER TABLE public.properties ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Update existing property to be verified
UPDATE public.properties 
SET is_verified = TRUE 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
