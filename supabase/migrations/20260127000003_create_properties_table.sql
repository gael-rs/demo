-- Create properties table (Propiedades/Unidades)
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  base_price_clp INTEGER NOT NULL, -- Precio por día base
  amenities TEXT[], -- Array de amenidades: ['WiFi', 'Kitchen', 'TV']
  images TEXT[], -- Array de URLs de imágenes en Supabase Storage
  capacity INTEGER DEFAULT 1, -- Número de personas
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_is_active ON public.properties(is_active);

-- RLS Policies
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer propiedades activas
CREATE POLICY "Public read active properties" ON public.properties
  FOR SELECT USING (is_active = true);

-- Solo admins pueden insertar/actualizar/eliminar
CREATE POLICY "Admins manage properties" ON public.properties
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
