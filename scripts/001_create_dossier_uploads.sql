-- Create storage bucket for PDF uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('dossier-uploads', 'dossier-uploads', false);

-- Create table to track uploaded dossiers
CREATE TABLE IF NOT EXISTS public.dossier_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  test_completion_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable RLS on the table
ALTER TABLE public.dossier_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dossier uploads
CREATE POLICY "Allow public insert on dossier_uploads" 
  ON public.dossier_uploads FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public select on dossier_uploads" 
  ON public.dossier_uploads FOR SELECT 
  USING (true);

-- Storage policies for the bucket
CREATE POLICY "Allow public upload to dossier-uploads bucket" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'dossier-uploads');

CREATE POLICY "Allow public read from dossier-uploads bucket" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'dossier-uploads');
