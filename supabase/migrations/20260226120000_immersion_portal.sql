-- ============================================================
-- IMMERSION CLIENT PORTAL — Database Schema
-- Creates all tables, RLS policies, seed triggers, and indexes
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

-- 1.1 Core engagement record
CREATE TABLE immersion_engagements (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz DEFAULT now(),

  -- Client
  client_name       text NOT NULL,
  client_org        text NOT NULL,
  client_email      text NOT NULL,
  client_phone      text,

  -- Session
  session_type      text NOT NULL, -- 'virtual_foundation' | 'on_site_full' | 'enterprise'
  session_date      date,
  session_confirmed boolean DEFAULT false,
  advisor_name      text DEFAULT 'Cameron Garlick',
  advisor_id        uuid REFERENCES auth.users(id),
  location          text, -- address for on-site, 'Virtual' for remote

  -- Stage
  stage             text DEFAULT 'pre', -- 'pre' | 'active' | 'post' | 'optimizing' | 'complete'
  stage_updated_at  timestamptz,

  -- Financials
  invoice_total     numeric(10,2),
  invoice_status    text DEFAULT 'pending', -- 'pending' | 'paid' | 'partial'

  -- Metadata
  notes             text,
  tags              text[],
  is_archived       boolean DEFAULT false
);

-- 1.2 Portal access control
CREATE TABLE immersion_portal_access (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid REFERENCES immersion_engagements(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES auth.users(id),

  role            text NOT NULL, -- 'client_primary' | 'client_team' | 'gf_advisor' | 'gf_admin'

  invited_at      timestamptz DEFAULT now(),
  invited_by      uuid REFERENCES auth.users(id),
  accepted_at     timestamptz,
  last_active_at  timestamptz,

  is_active       boolean DEFAULT true
);

-- 1.3 Checklist items (pre and post)
CREATE TABLE immersion_checklist_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid REFERENCES immersion_engagements(id) ON DELETE CASCADE,
  stage           text NOT NULL, -- 'pre' | 'post'
  order_index     integer NOT NULL,
  label           text NOT NULL,
  description     text,
  is_completed    boolean DEFAULT false,
  completed_at    timestamptz,
  completed_by    uuid REFERENCES auth.users(id),
  is_required     boolean DEFAULT true,
  assigned_to     text DEFAULT 'client' -- 'client' | 'gfunnel'
);

-- 1.4 Session recordings, transcripts, AI summaries
CREATE TABLE immersion_recordings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid REFERENCES immersion_engagements(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now(),

  title           text NOT NULL,
  type            text NOT NULL, -- 'full_session' | 'segment' | 'transcript' | 'ai_summary'
  duration_seconds integer,
  file_size_bytes bigint,
  storage_path    text,
  storage_url     text,

  segment_label   text,
  recorded_at     timestamptz,
  status          text DEFAULT 'processing', -- 'processing' | 'ready' | 'failed'

  transcript_text text,
  ai_summary_json jsonb
);

-- 1.5 Departments (9 per engagement)
CREATE TABLE immersion_departments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid REFERENCES immersion_engagements(id) ON DELETE CASCADE,

  dept_number     integer NOT NULL, -- 1-9
  dept_name       text NOT NULL,
  dept_color      text NOT NULL, -- hex color

  status          text DEFAULT 'pending', -- 'pending' | 'in_progress' | 'live' | 'blocked'
  progress        integer DEFAULT 0, -- 0-100

  build_items     jsonb DEFAULT '[]', -- [{label, done, notes}]

  advisor_notes   text,
  client_notes    text,

  updated_at      timestamptz DEFAULT now(),
  updated_by      uuid REFERENCES auth.users(id)
);

-- 1.6 Documents and SOPs
CREATE TABLE immersion_documents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid REFERENCES immersion_engagements(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now(),

  title           text NOT NULL,
  category        text NOT NULL, -- 'Blueprint' | 'SOP' | 'Technical' | 'Legal' | 'Finance'
  icon            text,

  page_count      integer,
  file_type       text DEFAULT 'pdf', -- 'pdf' | 'docx' | 'xlsx' | 'link'
  storage_path    text,
  storage_url     text,
  external_url    text,

  version         integer DEFAULT 1,
  is_final        boolean DEFAULT false,
  uploaded_by     uuid REFERENCES auth.users(id)
);

-- 1.7 Direct messaging
CREATE TABLE immersion_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid REFERENCES immersion_engagements(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now(),

  sender_id       uuid REFERENCES auth.users(id),
  sender_name     text NOT NULL,
  sender_role     text NOT NULL, -- 'client' | 'advisor' | 'admin'

  body            text NOT NULL,

  attachments     jsonb DEFAULT '[]', -- [{name, url, size, type}]

  reply_to_id     uuid REFERENCES immersion_messages(id),

  is_read         boolean DEFAULT false,
  read_at         timestamptz,
  is_deleted      boolean DEFAULT false
);

-- 1.8 Invoices and agreements
CREATE TABLE immersion_invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid REFERENCES immersion_engagements(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now(),

  invoice_number  text NOT NULL UNIQUE,
  type            text NOT NULL, -- 'invoice' | 'agreement'
  description     text NOT NULL,

  amount          numeric(10,2),
  currency        text DEFAULT 'USD',

  issued_date     date,
  due_date        date,
  paid_date       date,

  status          text DEFAULT 'pending', -- 'pending' | 'paid' | 'overdue' | 'included' | 'signed' | 'void'

  document_url    text,
  stripe_invoice_id text
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX idx_immersion_checklist_engagement_stage ON immersion_checklist_items(engagement_id, stage);
CREATE INDEX idx_immersion_recordings_engagement ON immersion_recordings(engagement_id);
CREATE INDEX idx_immersion_departments_engagement ON immersion_departments(engagement_id);
CREATE INDEX idx_immersion_documents_engagement_category ON immersion_documents(engagement_id, category);
CREATE INDEX idx_immersion_messages_engagement_created ON immersion_messages(engagement_id, created_at);
CREATE INDEX idx_immersion_invoices_engagement ON immersion_invoices(engagement_id);
CREATE INDEX idx_immersion_portal_access_engagement_user ON immersion_portal_access(engagement_id, user_id);

-- ============================================================
-- 3. ROW-LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE immersion_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE immersion_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE immersion_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE immersion_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE immersion_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE immersion_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE immersion_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE immersion_invoices ENABLE ROW LEVEL SECURITY;

-- Helper: check if user has portal access for an engagement
CREATE OR REPLACE FUNCTION has_immersion_access(p_engagement_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM immersion_portal_access
    WHERE engagement_id = p_engagement_id
      AND user_id = p_user_id
      AND is_active = true
  );
$$;

-- Helper: get user's immersion role for an engagement
CREATE OR REPLACE FUNCTION get_immersion_role(p_engagement_id uuid, p_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM immersion_portal_access
  WHERE engagement_id = p_engagement_id
    AND user_id = p_user_id
    AND is_active = true
  LIMIT 1;
$$;

-- Helper: check if user is advisor or admin for any engagement
CREATE OR REPLACE FUNCTION is_immersion_staff(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM immersion_portal_access
    WHERE user_id = p_user_id
      AND role IN ('gf_advisor', 'gf_admin')
      AND is_active = true
  );
$$;

-- === immersion_engagements ===
CREATE POLICY "engagement_select" ON immersion_engagements
  FOR SELECT USING (
    has_immersion_access(id, auth.uid())
  );

CREATE POLICY "engagement_update_staff" ON immersion_engagements
  FOR UPDATE USING (
    get_immersion_role(id, auth.uid()) IN ('gf_advisor', 'gf_admin')
  );

CREATE POLICY "engagement_insert_staff" ON immersion_engagements
  FOR INSERT WITH CHECK (
    is_immersion_staff(auth.uid())
  );

-- === immersion_portal_access ===
CREATE POLICY "portal_access_select" ON immersion_portal_access
  FOR SELECT USING (
    user_id = auth.uid() OR is_immersion_staff(auth.uid())
  );

CREATE POLICY "portal_access_manage_staff" ON immersion_portal_access
  FOR ALL USING (
    is_immersion_staff(auth.uid())
  );

-- === immersion_checklist_items ===
CREATE POLICY "checklist_select" ON immersion_checklist_items
  FOR SELECT USING (
    has_immersion_access(engagement_id, auth.uid())
  );

CREATE POLICY "checklist_update_client" ON immersion_checklist_items
  FOR UPDATE USING (
    assigned_to = 'client'
    AND get_immersion_role(engagement_id, auth.uid()) = 'client_primary'
  );

CREATE POLICY "checklist_update_staff" ON immersion_checklist_items
  FOR UPDATE USING (
    get_immersion_role(engagement_id, auth.uid()) IN ('gf_advisor', 'gf_admin')
  );

-- === immersion_recordings ===
CREATE POLICY "recordings_select" ON immersion_recordings
  FOR SELECT USING (
    has_immersion_access(engagement_id, auth.uid())
  );

CREATE POLICY "recordings_manage_staff" ON immersion_recordings
  FOR ALL USING (
    get_immersion_role(engagement_id, auth.uid()) IN ('gf_advisor', 'gf_admin')
  );

-- === immersion_departments ===
CREATE POLICY "departments_select" ON immersion_departments
  FOR SELECT USING (
    has_immersion_access(engagement_id, auth.uid())
  );

CREATE POLICY "departments_update_staff" ON immersion_departments
  FOR UPDATE USING (
    get_immersion_role(engagement_id, auth.uid()) IN ('gf_advisor', 'gf_admin')
  );

-- === immersion_documents ===
CREATE POLICY "documents_select" ON immersion_documents
  FOR SELECT USING (
    has_immersion_access(engagement_id, auth.uid())
  );

CREATE POLICY "documents_manage_staff" ON immersion_documents
  FOR ALL USING (
    get_immersion_role(engagement_id, auth.uid()) IN ('gf_advisor', 'gf_admin')
  );

-- === immersion_messages ===
CREATE POLICY "messages_select" ON immersion_messages
  FOR SELECT USING (
    has_immersion_access(engagement_id, auth.uid())
    AND is_deleted = false
  );

CREATE POLICY "messages_insert" ON immersion_messages
  FOR INSERT WITH CHECK (
    has_immersion_access(engagement_id, auth.uid())
  );

CREATE POLICY "messages_update_read" ON immersion_messages
  FOR UPDATE USING (
    has_immersion_access(engagement_id, auth.uid())
  );

-- === immersion_invoices ===
CREATE POLICY "invoices_select" ON immersion_invoices
  FOR SELECT USING (
    has_immersion_access(engagement_id, auth.uid())
  );

CREATE POLICY "invoices_manage_staff" ON immersion_invoices
  FOR ALL USING (
    get_immersion_role(engagement_id, auth.uid()) IN ('gf_advisor', 'gf_admin')
  );

-- ============================================================
-- 4. SEED TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION seed_immersion_engagement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Seed pre-immersion checklist items
  INSERT INTO immersion_checklist_items (engagement_id, stage, order_index, label, description, is_required, assigned_to) VALUES
    (NEW.id, 'pre', 1, 'Agreement signed & invoice paid', 'GFunnel will mark this complete once payment is confirmed.', true, 'gfunnel'),
    (NEW.id, 'pre', 2, 'Session date confirmed', 'GFunnel will confirm your session date and send calendar invite.', true, 'gfunnel'),
    (NEW.id, 'pre', 3, 'Omi device shipped to your address', 'Your Omi wearable device will be shipped before the session.', true, 'gfunnel'),
    (NEW.id, 'pre', 4, 'Complete pre-session business questionnaire', 'Fill out the questionnaire to help us prepare for your session.', true, 'client'),
    (NEW.id, 'pre', 5, 'Prepare list of top 3 operational pain points', 'Think about your biggest challenges so we can address them.', true, 'client'),
    (NEW.id, 'pre', 6, 'Ensure key team members are available day-of', 'Identify who should attend the session.', true, 'client'),
    (NEW.id, 'pre', 7, 'Review the 9-Department Framework guide', 'Familiarize yourself with the framework we will use.', true, 'client'),
    (NEW.id, 'pre', 8, 'Set up GFunnel platform access for your team', 'Create accounts for team members who need access.', true, 'client');

  -- Seed post-immersion checklist items
  INSERT INTO immersion_checklist_items (engagement_id, stage, order_index, label, description, is_required, assigned_to) VALUES
    (NEW.id, 'post', 1, 'Session complete — recordings archived', 'Session recordings have been processed and uploaded.', true, 'gfunnel'),
    (NEW.id, 'post', 2, 'Blueprint document delivered', 'Your custom business blueprint has been generated.', true, 'gfunnel'),
    (NEW.id, 'post', 3, 'GFunnel platform configured for your org', 'Your organization has been set up in the GFunnel platform.', true, 'gfunnel'),
    (NEW.id, 'post', 4, 'Departments built — review build status', 'Check the Build Status tab to see progress on all 9 departments.', true, 'client'),
    (NEW.id, 'post', 5, 'Review all 9-department SOPs with your team', 'Go through each SOP document with your team.', true, 'client'),
    (NEW.id, 'post', 6, 'Complete team onboarding inside GFunnel', 'Ensure all team members are set up and trained.', true, 'client'),
    (NEW.id, 'post', 7, 'Schedule 30-day optimization check-in', 'Book your follow-up optimization session.', true, 'client'),
    (NEW.id, 'post', 8, 'Submit any build amendment requests', 'Request any changes to what was built during the session.', false, 'client');

  -- Seed 9 department rows
  INSERT INTO immersion_departments (engagement_id, dept_number, dept_name, dept_color) VALUES
    (NEW.id, 1, 'Revenue Generation', '#F97316'),
    (NEW.id, 2, 'Creative & Content', '#EC4899'),
    (NEW.id, 3, 'Technology', '#8B5CF6'),
    (NEW.id, 4, 'Operations', '#06B6D4'),
    (NEW.id, 5, 'Finance', '#10B981'),
    (NEW.id, 6, 'Strategy & Analytics', '#3B82F6'),
    (NEW.id, 7, 'AI & Automation', '#F59E0B'),
    (NEW.id, 8, 'Team & Support', '#EF4444'),
    (NEW.id, 9, 'Legal & Compliance', '#64748B');

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_seed_immersion_engagement
  AFTER INSERT ON immersion_engagements
  FOR EACH ROW
  EXECUTE FUNCTION seed_immersion_engagement();
