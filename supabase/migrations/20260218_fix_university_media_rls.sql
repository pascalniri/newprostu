-- Allow public uploads for university-media (fix RLS error)
DROP POLICY IF EXISTS "Authenticated users can upload university media" ON storage.objects;

CREATE POLICY "Public can upload university media" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'university-media');

-- Ensure public view access is also correct (already exists but good to reinforce)
DROP POLICY IF EXISTS "Public read access for university media" ON storage.objects;

CREATE POLICY "Public read access for university media" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'university-media');
