import { supabase } from "@/integrations/supabase/client";
import type {
  EngagementWithAggregates,
  ImmersionChecklistItem,
  ImmersionRecording,
  ImmersionDepartment,
  ImmersionDocument,
  ImmersionMessage,
  ImmersionInvoice,
  ImmersionEngagement,
  ImmersionStage,
  DepartmentStatus,
  DocumentCategory,
  BuildItem,
  MessageAttachment,
} from "./immersionTypes";

// ============================================================
// HELPERS
// ============================================================

async function invokeFunction<T>(functionName: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, { body });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as T;
}

// ============================================================
// ENGAGEMENT
// ============================================================

export async function getEngagement(engagementId: string): Promise<EngagementWithAggregates> {
  return invokeFunction<EngagementWithAggregates>("immersion-engagement", {
    action: "get",
    engagement_id: engagementId,
  });
}

export async function listEngagements(): Promise<ImmersionEngagement[]> {
  return invokeFunction<ImmersionEngagement[]>("immersion-engagement", {
    action: "list",
  });
}

export async function createEngagement(params: {
  client_name: string;
  client_org: string;
  client_email: string;
  client_phone?: string;
  session_type: string;
  session_date?: string;
  location?: string;
}): Promise<ImmersionEngagement> {
  return invokeFunction<ImmersionEngagement>("immersion-engagement", {
    action: "create",
    ...params,
  });
}

export async function updateEngagementStage(
  engagementId: string,
  stage: ImmersionStage
): Promise<ImmersionEngagement> {
  return invokeFunction<ImmersionEngagement>("immersion-engagement", {
    action: "update_stage",
    engagement_id: engagementId,
    stage,
  });
}

// ============================================================
// CHECKLIST
// ============================================================

export async function getChecklist(
  engagementId: string,
  stage?: "pre" | "post"
): Promise<ImmersionChecklistItem[]> {
  return invokeFunction<ImmersionChecklistItem[]>("immersion-checklist", {
    action: "list",
    engagement_id: engagementId,
    stage,
  });
}

export async function toggleChecklistItem(
  engagementId: string,
  itemId: string,
  isCompleted: boolean
): Promise<ImmersionChecklistItem> {
  return invokeFunction<ImmersionChecklistItem>("immersion-checklist", {
    action: "toggle",
    engagement_id: engagementId,
    item_id: itemId,
    is_completed: isCompleted,
  });
}

// ============================================================
// RECORDINGS
// ============================================================

export async function getRecordings(engagementId: string): Promise<ImmersionRecording[]> {
  return invokeFunction<ImmersionRecording[]>("immersion-recordings", {
    action: "list",
    engagement_id: engagementId,
  });
}

// ============================================================
// DEPARTMENTS
// ============================================================

export async function getDepartments(engagementId: string): Promise<ImmersionDepartment[]> {
  return invokeFunction<ImmersionDepartment[]>("immersion-departments", {
    action: "list",
    engagement_id: engagementId,
  });
}

export async function updateDepartment(
  engagementId: string,
  deptId: string,
  updates: {
    status?: DepartmentStatus;
    progress?: number;
    build_items?: BuildItem[];
    advisor_notes?: string;
  }
): Promise<ImmersionDepartment> {
  return invokeFunction<ImmersionDepartment>("immersion-departments", {
    action: "update",
    engagement_id: engagementId,
    dept_id: deptId,
    ...updates,
  });
}

// ============================================================
// DOCUMENTS
// ============================================================

export async function getDocuments(
  engagementId: string,
  category?: DocumentCategory
): Promise<ImmersionDocument[]> {
  return invokeFunction<ImmersionDocument[]>("immersion-documents", {
    action: "list",
    engagement_id: engagementId,
    category,
  });
}

export async function createDocument(
  engagementId: string,
  doc: {
    title: string;
    category: DocumentCategory;
    icon?: string;
    page_count?: number;
    file_type?: string;
    storage_path?: string;
    storage_url?: string;
    external_url?: string;
    is_final?: boolean;
  }
): Promise<ImmersionDocument> {
  return invokeFunction<ImmersionDocument>("immersion-documents", {
    action: "create",
    engagement_id: engagementId,
    ...doc,
  });
}

// ============================================================
// MESSAGES
// ============================================================

export async function getMessages(engagementId: string): Promise<ImmersionMessage[]> {
  return invokeFunction<ImmersionMessage[]>("immersion-messages", {
    action: "list",
    engagement_id: engagementId,
  });
}

export async function sendMessage(
  engagementId: string,
  body: string,
  attachments?: MessageAttachment[],
  replyToId?: string
): Promise<ImmersionMessage> {
  return invokeFunction<ImmersionMessage>("immersion-messages", {
    action: "send",
    engagement_id: engagementId,
    body,
    attachments,
    reply_to_id: replyToId,
  });
}

export async function markMessageRead(
  engagementId: string,
  messageId: string
): Promise<void> {
  await invokeFunction<{ success: boolean }>("immersion-messages", {
    action: "mark_read",
    engagement_id: engagementId,
    message_id: messageId,
  });
}

// ============================================================
// INVOICES
// ============================================================

export async function getInvoices(engagementId: string): Promise<ImmersionInvoice[]> {
  return invokeFunction<ImmersionInvoice[]>("immersion-invoices", {
    action: "list",
    engagement_id: engagementId,
  });
}
