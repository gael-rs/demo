-- Nota: Los buckets deben crearse manualmente en Supabase Dashboard o mediante CLI
-- Esta migración contiene las políticas de storage

-- Políticas para property-images bucket (público)
-- Asumiendo que el bucket ya existe

-- Public read property images
CREATE POLICY "Public read property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

-- Admins upload property images
CREATE POLICY "Admins upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' AND
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Admins delete property images
CREATE POLICY "Admins delete property images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' AND
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Políticas para verification-documents bucket (privado)
-- Users read own verification docs
CREATE POLICY "Users read own verification docs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users upload own verification docs
CREATE POLICY "Users upload own verification docs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins read all verification docs
CREATE POLICY "Admins read all verification docs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-documents' AND
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );
