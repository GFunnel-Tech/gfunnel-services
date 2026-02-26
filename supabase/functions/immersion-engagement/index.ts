import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action, engagement_id, ...params } = body;

    switch (action) {
      case "get": {
        // Check access
        const { data: access } = await supabase
          .from("immersion_portal_access")
          .select("role")
          .eq("engagement_id", engagement_id)
          .eq("user_id", user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (!access) {
          return new Response(
            JSON.stringify({ error: "Access denied" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Fetch engagement
        const { data: engagement, error: engError } = await supabase
          .from("immersion_engagements")
          .select("*")
          .eq("id", engagement_id)
          .single();

        if (engError || !engagement) {
          return new Response(
            JSON.stringify({ error: "Engagement not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Fetch aggregates in parallel
        const [checklistRes, departmentsRes, messagesRes] = await Promise.all([
          supabase
            .from("immersion_checklist_items")
            .select("is_completed, is_required")
            .eq("engagement_id", engagement_id),
          supabase
            .from("immersion_departments")
            .select("status, progress")
            .eq("engagement_id", engagement_id),
          supabase
            .from("immersion_messages")
            .select("id")
            .eq("engagement_id", engagement_id)
            .eq("is_read", false)
            .eq("is_deleted", false)
            .neq("sender_id", user.id),
        ]);

        const checklistItems = checklistRes.data || [];
        const requiredItems = checklistItems.filter((i) => i.is_required);
        const completedRequired = requiredItems.filter((i) => i.is_completed);

        const departments = departmentsRes.data || [];
        const liveDepts = departments.filter((d) => d.status === "live");
        const avgProgress = departments.length > 0
          ? Math.round(departments.reduce((sum, d) => sum + (d.progress || 0), 0) / departments.length)
          : 0;

        return new Response(
          JSON.stringify({
            ...engagement,
            checklist_total: requiredItems.length,
            checklist_completed: completedRequired.length,
            departments_live: liveDepts.length,
            departments_total: departments.length,
            overall_progress: avgProgress,
            unread_messages: messagesRes.data?.length || 0,
            user_role: access.role,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update_stage": {
        // Check staff access
        const { data: access } = await supabase
          .from("immersion_portal_access")
          .select("role")
          .eq("engagement_id", engagement_id)
          .eq("user_id", user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (!access || !["gf_advisor", "gf_admin"].includes(access.role)) {
          return new Response(
            JSON.stringify({ error: "Only advisors and admins can change stage" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { stage } = params;
        const validTransitions: Record<string, string[]> = {
          pre: ["active"],
          active: ["post"],
          post: ["optimizing"],
          optimizing: ["complete"],
        };

        // Fetch current stage
        const { data: current } = await supabase
          .from("immersion_engagements")
          .select("stage")
          .eq("id", engagement_id)
          .single();

        if (!current) {
          return new Response(
            JSON.stringify({ error: "Engagement not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const allowed = validTransitions[current.stage] || [];
        if (!allowed.includes(stage)) {
          return new Response(
            JSON.stringify({ error: `Cannot transition from ${current.stage} to ${stage}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: updated, error: updateError } = await supabase
          .from("immersion_engagements")
          .update({ stage, stage_updated_at: new Date().toISOString() })
          .eq("id", engagement_id)
          .select()
          .single();

        if (updateError) {
          return new Response(
            JSON.stringify({ error: "Failed to update stage" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(updated),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "list": {
        // List all engagements the user has access to
        const { data: accessList } = await supabase
          .from("immersion_portal_access")
          .select("engagement_id, role")
          .eq("user_id", user.id)
          .eq("is_active", true);

        if (!accessList || accessList.length === 0) {
          return new Response(
            JSON.stringify([]),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const engagementIds = accessList.map((a) => a.engagement_id);
        const { data: engagements } = await supabase
          .from("immersion_engagements")
          .select("*")
          .in("id", engagementIds)
          .eq("is_archived", false)
          .order("created_at", { ascending: false });

        return new Response(
          JSON.stringify(engagements || []),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create": {
        // Only staff can create engagements
        const { data: staffCheck } = await supabase
          .from("immersion_portal_access")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["gf_advisor", "gf_admin"])
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        // Also check if user has admin app_role
        const { data: adminCheck } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });

        if (!staffCheck && !adminCheck) {
          return new Response(
            JSON.stringify({ error: "Only staff can create engagements" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { client_name, client_org, client_email, client_phone, session_type, session_date, location } = params;

        const { data: engagement, error: createError } = await supabase
          .from("immersion_engagements")
          .insert({
            client_name,
            client_org,
            client_email,
            client_phone: client_phone || null,
            session_type,
            session_date: session_date || null,
            location: location || null,
            advisor_id: user.id,
          })
          .select()
          .single();

        if (createError) {
          return new Response(
            JSON.stringify({ error: createError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Grant creator gf_admin access
        await supabase.from("immersion_portal_access").insert({
          engagement_id: engagement.id,
          user_id: user.id,
          role: "gf_admin",
          invited_by: user.id,
          accepted_at: new Date().toISOString(),
        });

        return new Response(
          JSON.stringify(engagement),
          { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("[immersion-engagement] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
