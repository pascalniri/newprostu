-- Create the storage bucket for university media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('university-media', 'university-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users (admin) to upload university media
CREATE POLICY "Authenticated users can upload university media" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'university-media');

-- Policy to allow authenticated users to update/delete their uploads (or admins)
-- For simplicity, assuming admins are just "authenticated" users who can manage this bucket
CREATE POLICY "Authenticated users can update university media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'university-media');

CREATE POLICY "Authenticated users can delete university media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'university-media');

-- Policy to allow public read access to 'university-media'
CREATE POLICY "Public read access for university media" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'university-media');
