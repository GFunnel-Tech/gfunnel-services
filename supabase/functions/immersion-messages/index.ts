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
        const { data, error } = await supabase
          .from("immersion_messages")
          .select("*")
          .eq("engagement_id", engagement_id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: true });

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

      case "send": {
        const { body: messageBody, attachments, reply_to_id } = params;

        if (!messageBody?.trim()) {
          return new Response(
            JSON.stringify({ error: "Message body is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Determine sender role
        let senderRole = "client";
        if (access.role === "gf_advisor") senderRole = "advisor";
        else if (access.role === "gf_admin") senderRole = "admin";

        const { data: message, error: sendError } = await supabase
          .from("immersion_messages")
          .insert({
            engagement_id,
            sender_id: user.id,
            sender_name: user.user_metadata?.full_name || user.email || "Unknown",
            sender_role: senderRole,
            body: messageBody.trim(),
            attachments: attachments || [],
            reply_to_id: reply_to_id || null,
          })
          .select()
          .single();

        if (sendError) {
          return new Response(
            JSON.stringify({ error: sendError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(message),
          { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "mark_read": {
        const { message_id } = params;

        const { error: readError } = await supabase
          .from("immersion_messages")
          .update({
            is_read: true,
            read_at: new Date().toISOString(),
          })
          .eq("id", message_id)
          .eq("engagement_id", engagement_id);

        if (readError) {
          return new Response(
            JSON.stringify({ error: readError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
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
    console.error("[immersion-messages] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
