-- Add price and capacity to rooms
ALTER TABLE public.rooms 
ADD COLUMN price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN capacity INT NOT NULL DEFAULT 1;

-- Add DELETE policy for owners
CREATE POLICY "Owner delete rooms"
ON public.rooms
FOR DELETE
USING (
   (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
);
