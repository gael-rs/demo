-- Create terms_acceptances table (Aceptación de Términos)
CREATE TABLE public.terms_acceptances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,

  -- Metadata de aceptación
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  terms_version TEXT DEFAULT 'v1.0', -- Versionado de términos

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_terms_acceptances_user_id ON public.terms_acceptances(user_id);
CREATE INDEX idx_terms_acceptances_booking_id ON public.terms_acceptances(booking_id);

-- RLS Policies
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven solo sus propias aceptaciones
CREATE POLICY "Users read own acceptances" ON public.terms_acceptances
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios crean solo sus propias aceptaciones
CREATE POLICY "Users create own acceptances" ON public.terms_acceptances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los admins ven todas las aceptaciones
CREATE POLICY "Admins read all acceptances" ON public.terms_acceptances
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );
