-- Create company_roles table for tracking team role assignments
CREATE TABLE public.company_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  department_slug TEXT NOT NULL,
  role_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'vacant' CHECK (status IN ('filled', 'hiring', 'vacant')),
  assigned_name TEXT,
  assigned_email TEXT,
  hire_request_id UUID REFERENCES public.project_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, department_slug, role_title)
);

-- Enable RLS
ALTER TABLE public.company_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_roles
CREATE POLICY "Admins can view all company roles"
ON public.company_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert company roles"
ON public.company_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update company roles"
ON public.company_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete company roles"
ON public.company_roles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage company roles"
ON public.company_roles
FOR ALL
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_company_roles_updated_at
BEFORE UPDATE ON public.company_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();