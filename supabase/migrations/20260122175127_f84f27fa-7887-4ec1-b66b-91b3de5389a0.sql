-- Add profile data columns to company_roles table
ALTER TABLE public.company_roles 
  ADD COLUMN IF NOT EXISTS assigned_phone TEXT,
  ADD COLUMN IF NOT EXISTS assigned_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS google_meet_link TEXT,
  ADD COLUMN IF NOT EXISTS profile_type TEXT DEFAULT 'human',
  ADD COLUMN IF NOT EXISTS ai_name TEXT,
  ADD COLUMN IF NOT EXISTS ai_type TEXT,
  ADD COLUMN IF NOT EXISTS ai_agent_id TEXT;