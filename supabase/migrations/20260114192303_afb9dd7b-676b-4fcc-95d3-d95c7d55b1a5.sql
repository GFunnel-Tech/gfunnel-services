-- Drop the overly permissive policy
DROP POLICY "Service role full access" ON project_requests;

-- Add proper INSERT policy for service role (edge functions)
CREATE POLICY "Service role can insert requests" ON project_requests FOR INSERT
  WITH CHECK (true);