-- Allow owners to create, update, and delete documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'documents'
      AND policyname = 'Owner manage documents'
  ) THEN
    CREATE POLICY "Owner manage documents" ON public.documents
      FOR ALL
      USING (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
      )
      WITH CHECK (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
      );
  END IF;
END $$;

