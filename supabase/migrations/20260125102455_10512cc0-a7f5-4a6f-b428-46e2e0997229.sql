-- Add ai_embed_url column to company_roles table for AI chat widget embedding
ALTER TABLE public.company_roles 
ADD COLUMN IF NOT EXISTS ai_embed_url TEXT;