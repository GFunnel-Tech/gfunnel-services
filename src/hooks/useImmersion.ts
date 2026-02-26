import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getEngagement,
  listEngagements,
  createEngagement,
  updateEngagementStage,
  getChecklist,
  toggleChecklistItem,
  getRecordings,
  getDepartments,
  updateDepartment,
  getDocuments,
  createDocument,
  getMessages,
  sendMessage,
  markMessageRead,
  getInvoices,
} from "@/lib/immersionService";
import type {
  ImmersionStage,
  DepartmentStatus,
  DocumentCategory,
  BuildItem,
  MessageAttachment,
} from "@/lib/immersionTypes";

// ============================================================
// ENGAGEMENT
// ============================================================

export function useEngagement(engagementId: string | undefined) {
  return useQuery({
    queryKey: ["immersion-engagement", engagementId],
    queryFn: () => getEngagement(engagementId!),
    enabled: !!engagementId,
  });
}

export function useEngagementList() {
  return useQuery({
    queryKey: ["immersion-engagements"],
    queryFn: listEngagements,
  });
}

export function useCreateEngagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEngagement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immersion-engagements"] });
    },
  });
}

export function useUpdateStage(engagementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stage: ImmersionStage) => updateEngagementStage(engagementId, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immersion-engagement", engagementId] });
    },
  });
}

// ============================================================
// CHECKLIST
// ============================================================

export function useChecklist(engagementId: string | undefined, stage?: "pre" | "post") {
  return useQuery({
    queryKey: ["immersion-checklist", engagementId, stage],
    queryFn: () => getChecklist(engagementId!, stage),
    enabled: !!engagementId,
  });
}

export function useToggleChecklist(engagementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isCompleted }: { itemId: string; isCompleted: boolean }) =>
      toggleChecklistItem(engagementId, itemId, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immersion-checklist", engagementId] });
      queryClient.invalidateQueries({ queryKey: ["immersion-engagement", engagementId] });
    },
  });
}

// ============================================================
// RECORDINGS
// ============================================================

export function useRecordings(engagementId: string | undefined) {
  return useQuery({
    queryKey: ["immersion-recordings", engagementId],
    queryFn: () => getRecordings(engagementId!),
    enabled: !!engagementId,
  });
}

// ============================================================
// DEPARTMENTS
// ============================================================

export function useDepartments(engagementId: string | undefined) {
  return useQuery({
    queryKey: ["immersion-departments", engagementId],
    queryFn: () => getDepartments(engagementId!),
    enabled: !!engagementId,
  });
}

export function useUpdateDepartment(engagementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deptId,
      updates,
    }: {
      deptId: string;
      updates: {
        status?: DepartmentStatus;
        progress?: number;
        build_items?: BuildItem[];
        advisor_notes?: string;
      };
    }) => updateDepartment(engagementId, deptId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immersion-departments", engagementId] });
      queryClient.invalidateQueries({ queryKey: ["immersion-engagement", engagementId] });
    },
  });
}

// ============================================================
// DOCUMENTS
// ============================================================

export function useDocuments(engagementId: string | undefined, category?: DocumentCategory) {
  return useQuery({
    queryKey: ["immersion-documents", engagementId, category],
    queryFn: () => getDocuments(engagementId!, category),
    enabled: !!engagementId,
  });
}

export function useCreateDocument(engagementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doc: Parameters<typeof createDocument>[1]) =>
      createDocument(engagementId, doc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immersion-documents", engagementId] });
    },
  });
}

// ============================================================
// MESSAGES
// ============================================================

export function useMessages(engagementId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["immersion-messages", engagementId],
    queryFn: () => getMessages(engagementId!),
    enabled: !!engagementId,
  });

  // Realtime subscription for new messages
  useEffect(() => {
    if (!engagementId) return;

    const channel = supabase
      .channel(`immersion-messages-${engagementId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "immersion_messages",
          filter: `engagement_id=eq.${engagementId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["immersion-messages", engagementId] });
          queryClient.invalidateQueries({ queryKey: ["immersion-engagement", engagementId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [engagementId, queryClient]);

  return query;
}

export function useSendMessage(engagementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      body,
      attachments,
      replyToId,
    }: {
      body: string;
      attachments?: MessageAttachment[];
      replyToId?: string;
    }) => sendMessage(engagementId, body, attachments, replyToId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immersion-messages", engagementId] });
    },
  });
}

export function useMarkMessageRead(engagementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => markMessageRead(engagementId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immersion-messages", engagementId] });
      queryClient.invalidateQueries({ queryKey: ["immersion-engagement", engagementId] });
    },
  });
}

// ============================================================
// INVOICES
// ============================================================

export function useInvoices(engagementId: string | undefined) {
  return useQuery({
    queryKey: ["immersion-invoices", engagementId],
    queryFn: () => getInvoices(engagementId!),
    enabled: !!engagementId,
  });
}
