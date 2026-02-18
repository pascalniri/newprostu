-- Create the storage bucket for comment attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comment-attachments', 'comment-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated uploads to 'comment-attachments'
CREATE POLICY "Authenticated users can upload comment attachments" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'comment-attachments');

-- Policy to allow public read access to 'comment-attachments'
CREATE POLICY "Public read access for comment attachments" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'comment-attachments');	
