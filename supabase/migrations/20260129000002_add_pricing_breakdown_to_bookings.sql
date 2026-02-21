-- Add pricing breakdown fields to bookings table
ALTER TABLE public.bookings
ADD COLUMN base_price_clp INTEGER,
ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN discount_amount_clp INTEGER DEFAULT 0;

-- Backfill existing bookings with current price data
UPDATE public.bookings
SET
  base_price_clp = price_per_day_clp,
  discount_percentage = 0,
  discount_amount_clp = 0
WHERE base_price_clp IS NULL;

-- Make base_price_clp required after backfill
ALTER TABLE public.bookings
ALTER COLUMN base_price_clp SET NOT NULL;
