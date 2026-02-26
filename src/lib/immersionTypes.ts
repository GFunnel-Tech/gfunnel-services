// ============================================================
// IMMERSION PORTAL — TypeScript Types & Constants
// ============================================================

export type ImmersionStage = 'pre' | 'active' | 'post' | 'optimizing' | 'complete';
export type SessionType = 'virtual_foundation' | 'on_site_full' | 'enterprise';
export type PortalRole = 'client_primary' | 'client_team' | 'gf_advisor' | 'gf_admin';
export type DepartmentStatus = 'pending' | 'in_progress' | 'live' | 'blocked';
export type RecordingType = 'full_session' | 'segment' | 'transcript' | 'ai_summary';
export type RecordingStatus = 'processing' | 'ready' | 'failed';
export type DocumentCategory = 'Blueprint' | 'SOP' | 'Technical' | 'Legal' | 'Finance';
export type FileType = 'pdf' | 'docx' | 'xlsx' | 'link';
export type InvoiceType = 'invoice' | 'agreement';
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'included' | 'signed' | 'void';
export type ChecklistAssignee = 'client' | 'gfunnel';
export type MessageRole = 'client' | 'advisor' | 'admin';

export interface ImmersionEngagement {
  id: string;
  created_at: string;
  client_name: string;
  client_org: string;
  client_email: string;
  client_phone: string | null;
  session_type: SessionType;
  session_date: string | null;
  session_confirmed: boolean;
  advisor_name: string;
  advisor_id: string | null;
  location: string | null;
  stage: ImmersionStage;
  stage_updated_at: string | null;
  invoice_total: number | null;
  invoice_status: string;
  notes: string | null;
  tags: string[] | null;
  is_archived: boolean;
}

export interface ImmersionPortalAccess {
  id: string;
  engagement_id: string;
  user_id: string;
  role: PortalRole;
  invited_at: string;
  invited_by: string | null;
  accepted_at: string | null;
  last_active_at: string | null;
  is_active: boolean;
}

export interface ImmersionChecklistItem {
  id: string;
  engagement_id: string;
  stage: 'pre' | 'post';
  order_index: number;
  label: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  is_required: boolean;
  assigned_to: ChecklistAssignee;
}

export interface ImmersionRecording {
  id: string;
  engagement_id: string;
  created_at: string;
  title: string;
  type: RecordingType;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  storage_path: string | null;
  storage_url: string | null;
  segment_label: string | null;
  recorded_at: string | null;
  status: RecordingStatus;
  transcript_text: string | null;
  ai_summary_json: Record<string, unknown> | null;
}

export interface BuildItem {
  label: string;
  done: boolean;
  notes?: string;
}

export interface ImmersionDepartment {
  id: string;
  engagement_id: string;
  dept_number: number;
  dept_name: string;
  dept_color: string;
  status: DepartmentStatus;
  progress: number;
  build_items: BuildItem[];
  advisor_notes: string | null;
  client_notes: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface ImmersionDocument {
  id: string;
  engagement_id: string;
  created_at: string;
  title: string;
  category: DocumentCategory;
  icon: string | null;
  page_count: number | null;
  file_type: FileType;
  storage_path: string | null;
  storage_url: string | null;
  external_url: string | null;
  version: number;
  is_final: boolean;
  uploaded_by: string | null;
}

export interface MessageAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface ImmersionMessage {
  id: string;
  engagement_id: string;
  created_at: string;
  sender_id: string | null;
  sender_name: string;
  sender_role: MessageRole;
  body: string;
  attachments: MessageAttachment[];
  reply_to_id: string | null;
  is_read: boolean;
  read_at: string | null;
  is_deleted: boolean;
}

export interface ImmersionInvoice {
  id: string;
  engagement_id: string;
  created_at: string;
  invoice_number: string;
  type: InvoiceType;
  description: string;
  amount: number | null;
  currency: string;
  issued_date: string | null;
  due_date: string | null;
  paid_date: string | null;
  status: InvoiceStatus;
  document_url: string | null;
  stripe_invoice_id: string | null;
}

// Aggregated engagement data returned by the edge function
export interface EngagementWithAggregates extends ImmersionEngagement {
  checklist_total: number;
  checklist_completed: number;
  departments_live: number;
  departments_total: number;
  overall_progress: number;
  unread_messages: number;
  user_role: PortalRole;
}

// ============================================================
// CONSTANTS
// ============================================================

export const DEPARTMENT_SEEDS = [
  { dept_number: 1, dept_name: 'Revenue Generation', dept_color: '#F97316' },
  { dept_number: 2, dept_name: 'Creative & Content', dept_color: '#EC4899' },
  { dept_number: 3, dept_name: 'Technology', dept_color: '#8B5CF6' },
  { dept_number: 4, dept_name: 'Operations', dept_color: '#06B6D4' },
  { dept_number: 5, dept_name: 'Finance', dept_color: '#10B981' },
  { dept_number: 6, dept_name: 'Strategy & Analytics', dept_color: '#3B82F6' },
  { dept_number: 7, dept_name: 'AI & Automation', dept_color: '#F59E0B' },
  { dept_number: 8, dept_name: 'Team & Support', dept_color: '#EF4444' },
  { dept_number: 9, dept_name: 'Legal & Compliance', dept_color: '#64748B' },
] as const;

export const STAGE_CONFIG: Record<ImmersionStage, { label: string; color: string; description: string }> = {
  pre: {
    label: 'Pre-Immersion',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Preparing for your Immersion session',
  },
  active: {
    label: 'Session Day',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    description: 'Your Immersion session is in progress',
  },
  post: {
    label: 'Post-Immersion',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    description: 'Build in progress — review deliverables',
  },
  optimizing: {
    label: 'Optimizing',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    description: '30-day optimization window active',
  },
  complete: {
    label: 'Complete',
    color: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    description: 'Engagement completed — portal archived',
  },
};

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  virtual_foundation: 'Virtual Foundation',
  on_site_full: 'On-Site Full Immersion',
  enterprise: 'Enterprise',
};

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Blueprint', 'SOP', 'Technical', 'Legal', 'Finance',
];

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  paid: { label: 'Paid', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  overdue: { label: 'Overdue', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  included: { label: 'Included', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  signed: { label: 'Signed', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  void: { label: 'Void', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' },
};

export const DEPARTMENT_STATUS_CONFIG: Record<DepartmentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  live: { label: 'Live', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  blocked: { label: 'Blocked', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
};
