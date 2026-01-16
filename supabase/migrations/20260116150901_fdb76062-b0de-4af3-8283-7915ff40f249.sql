-- Create hours_history table to track monthly usage snapshots
CREATE TABLE public.hours_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  hours_used NUMERIC NOT NULL DEFAULT 0,
  hours_included NUMERIC NOT NULL DEFAULT 0,
  plan_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, month_year)
);

-- Enable RLS
ALTER TABLE public.hours_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their company's history (via edge function)
CREATE POLICY "Allow service role access" 
ON public.hours_history 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_hours_history_company_month ON public.hours_history(company_id, month_year DESC);