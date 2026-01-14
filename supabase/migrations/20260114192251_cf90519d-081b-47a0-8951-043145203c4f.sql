-- Create project_requests table
CREATE TABLE public.project_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request info
  form_type TEXT NOT NULL,
  form_category TEXT NOT NULL,
  request_title TEXT,
  description TEXT,
  
  -- Submitter info
  email TEXT NOT NULL,
  video_link TEXT,
  
  -- Delegation info
  delegate_email TEXT,
  delegate_name TEXT,
  
  -- Full payload as JSON
  payload JSONB NOT NULL,
  
  -- Status tracking
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  
  -- Company linkage
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can view all requests" ON project_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update requests" ON project_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete requests" ON project_requests FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role full access" ON project_requests FOR ALL
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_project_requests_updated_at
  BEFORE UPDATE ON project_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();