-- Create bookings table (Reservas)
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,

  -- Fechas
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  days INTEGER NOT NULL,

  -- Pricing
  price_per_day_clp INTEGER NOT NULL,
  total_price_clp INTEGER NOT NULL,

  -- Estados
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  identity_verified BOOLEAN DEFAULT false,

  -- Códigos de acceso (deprecated, se moverá a access_codes table)
  access_code TEXT,
  access_code_expires_at TIMESTAMPTZ,

  -- Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_dates CHECK (check_out > check_in),
  CONSTRAINT valid_days CHECK (days > 0)
);

-- Índices
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);

-- RLS Policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven solo sus propias reservas
CREATE POLICY "Users read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios crean solo sus propias reservas
CREATE POLICY "Users create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios actualizan solo sus propias reservas
CREATE POLICY "Users update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Los admins ven y gestionan todas las reservas
CREATE POLICY "Admins manage all bookings" ON public.bookings
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
