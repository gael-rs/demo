-- Create discount rules table for configurable pricing
CREATE TABLE public.discount_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  min_days INTEGER NOT NULL,
  max_days INTEGER NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_days_range CHECK (max_days >= min_days),
  CONSTRAINT valid_discount CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

CREATE INDEX idx_discount_rules_property ON discount_rules(property_id);
ALTER TABLE discount_rules ENABLE ROW LEVEL SECURITY;

-- Allow public to read active discount rules
CREATE POLICY "Public read active rules" ON discount_rules
  FOR SELECT USING (is_active = true);

-- Only admins can manage discount rules
CREATE POLICY "Admins manage rules" ON discount_rules
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
