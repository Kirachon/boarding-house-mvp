-- Add city column to properties table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS city TEXT;
