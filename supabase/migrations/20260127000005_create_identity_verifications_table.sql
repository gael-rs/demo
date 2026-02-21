-- Create identity_verifications table (Verificaciones de Identidad)
CREATE TABLE public.identity_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,

  -- Archivos
  document_front_url TEXT NOT NULL, -- URL en Supabase Storage
  document_back_url TEXT, -- Opcional
  selfie_url TEXT NOT NULL,

  -- Estado de verificación
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.users(id), -- Admin que revisó
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_identity_verifications_user_id ON public.identity_verifications(user_id);
CREATE INDEX idx_identity_verifications_status ON public.identity_verifications(status);

-- RLS Policies
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven solo sus propias verificaciones
CREATE POLICY "Users read own verifications" ON public.identity_verifications
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios crean solo sus propias verificaciones
CREATE POLICY "Users create own verifications" ON public.identity_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los admins ven y gestionan todas las verificaciones
CREATE POLICY "Admins manage all verifications" ON public.identity_verifications
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_identity_verifications_updated_at
  BEFORE UPDATE ON public.identity_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
