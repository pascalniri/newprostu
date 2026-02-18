-- Allow public uploads for development (fix RLS error)
DROP POLICY IF EXISTS "Authenticated users can upload comment attachments" ON storage.objects;

CREATE POLICY "Public can upload comment attachments" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'comment-attachments');
