-- Add configurable ROTI settings per company
ALTER TABLE public.companies 
ADD COLUMN time_multiplier integer NOT NULL DEFAULT 13,
ADD COLUMN va_hourly_rate numeric NOT NULL DEFAULT 15;