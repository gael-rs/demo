-- Create access_codes table (Códigos de Acceso)
CREATE TABLE public.access_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,

  -- Código
  code TEXT NOT NULL,

  -- Validez
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,

  -- Estado
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES public.users(id),

  -- Integración Tuya (para futuro)
  tuya_lock_id TEXT,
  tuya_response JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_code_dates CHECK (valid_until > valid_from)
);

-- Índices
CREATE INDEX idx_access_codes_booking_id ON public.access_codes(booking_id);
CREATE INDEX idx_access_codes_property_id ON public.access_codes(property_id);
CREATE INDEX idx_access_codes_is_active ON public.access_codes(is_active);

-- RLS Policies
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven códigos de sus propias reservas
CREATE POLICY "Users read own access codes" ON public.access_codes
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM public.bookings WHERE user_id = auth.uid()
    )
  );

-- Solo admins pueden crear/actualizar códigos
CREATE POLICY "Admins manage access codes" ON public.access_codes
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_access_codes_updated_at
  BEFORE UPDATE ON public.access_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
