import { supabase } from "@/integrations/supabase/client";

export interface ProjectRequest {
  id: string;
  form_type: string;
  form_category: string;
  request_title: string | null;
  description: string | null;
  email: string;
  video_link: string | null;
  delegate_email: string | null;
  delegate_name: string | null;
  payload: Record<string, unknown>;
  status: string;
  priority: string;
  company_id: string | null;
  submitted_at: string;
  updated_at: string;
  created_at: string;
}

export interface ProjectRequestWithCompany extends ProjectRequest {
  companies: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export async function getProjectRequests(filters?: { 
  status?: string;
  company_id?: string;
}): Promise<ProjectRequestWithCompany[]> {
  let query = supabase
    .from("project_requests")
    .select(`
      *,
      companies (
        id,
        name,
        slug
      )
    `)
    .order("submitted_at", { ascending: false });
  
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  
  if (filters?.company_id) {
    query = query.eq("company_id", filters.company_id);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("[projectRequestService] Error fetching requests:", error);
    throw error;
  }
  
  return data as ProjectRequestWithCompany[];
}

export async function getProjectRequest(id: string): Promise<ProjectRequestWithCompany | null> {
  const { data, error } = await supabase
    .from("project_requests")
    .select(`
      *,
      companies (
        id,
        name,
        slug
      )
    `)
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("[projectRequestService] Error fetching request:", error);
    throw error;
  }
  
  return data as ProjectRequestWithCompany;
}

export async function updateProjectRequestStatus(
  id: string, 
  status: string
): Promise<void> {
  const { error } = await supabase
    .from("project_requests")
    .update({ status })
    .eq("id", id);
  
  if (error) {
    console.error("[projectRequestService] Error updating status:", error);
    throw error;
  }
}

export async function updateProjectRequestPriority(
  id: string, 
  priority: string
): Promise<void> {
  const { error } = await supabase
    .from("project_requests")
    .update({ priority })
    .eq("id", id);
  
  if (error) {
    console.error("[projectRequestService] Error updating priority:", error);
    throw error;
  }
}

export async function deleteProjectRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from("project_requests")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("[projectRequestService] Error deleting request:", error);
    throw error;
  }
}

export async function getProjectRequestStats(): Promise<{
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}> {
  const { data, error } = await supabase
    .from("project_requests")
    .select("status");
  
  if (error) {
    console.error("[projectRequestService] Error fetching stats:", error);
    throw error;
  }
  
  const stats = {
    total: data.length,
    pending: data.filter(r => r.status === "pending").length,
    in_progress: data.filter(r => r.status === "in_progress").length,
    completed: data.filter(r => r.status === "completed").length,
  };
  
  return stats;
}