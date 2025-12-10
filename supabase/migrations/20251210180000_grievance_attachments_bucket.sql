-- Create grievance-attachments storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('grievance-attachments', 'grievance-attachments', true);

-- Allow authenticated users to upload grievance photos
CREATE POLICY "Allow authenticated uploads to grievance-attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'grievance-attachments');

-- Allow public read access (for viewing photos in grievances)
CREATE POLICY "Public read access for grievance-attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'grievance-attachments');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own grievance photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'grievance-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
