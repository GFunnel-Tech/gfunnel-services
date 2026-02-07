-- Update default plan values for new companies to Free plan with 5 trial hours
ALTER TABLE public.companies ALTER COLUMN plan_name SET DEFAULT 'Free';
ALTER TABLE public.companies ALTER COLUMN plan_price SET DEFAULT 0;
ALTER TABLE public.companies ALTER COLUMN plan_value SET DEFAULT 0;
ALTER TABLE public.companies ALTER COLUMN savings_percentage SET DEFAULT 0;
ALTER TABLE public.companies ALTER COLUMN response_time SET DEFAULT 'N/A';
ALTER TABLE public.companies ALTER COLUMN hours_included SET DEFAULT 5;