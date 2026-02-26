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

    switch (action) {
      case "list": {
        const query = supabase
          .from("immersion_checklist_items")
          .select("*")
          .eq("engagement_id", engagement_id)
          .order("order_index", { ascending: true });

        if (params.stage) {
          query.eq("stage", params.stage);
        }

        const { data, error } = await query;

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(data || []),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "toggle": {
        const { item_id, is_completed } = params;

        // Fetch the item to check assignment
        const { data: item } = await supabase
          .from("immersion_checklist_items")
          .select("assigned_to, engagement_id")
          .eq("id", item_id)
          .single();

        if (!item) {
          return new Response(
            JSON.stringify({ error: "Item not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Client can only toggle client-assigned items
        const isStaff = ["gf_advisor", "gf_admin"].includes(access.role);
        if (!isStaff && item.assigned_to !== "client") {
          return new Response(
            JSON.stringify({ error: "You can only toggle client-assigned items" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // client_team cannot toggle
        if (access.role === "client_team") {
          return new Response(
            JSON.stringify({ error: "Team members cannot toggle checklist items" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: updated, error: updateError } = await supabase
          .from("immersion_checklist_items")
          .update({
            is_completed,
            completed_at: is_completed ? new Date().toISOString() : null,
            completed_by: is_completed ? user.id : null,
          })
          .eq("id", item_id)
          .select()
          .single();

        if (updateError) {
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(updated),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("[immersion-checklist] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
