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
          .from("immersion_documents")
          .select("*")
          .eq("engagement_id", engagement_id)
          .order("created_at", { ascending: false });

        if (params.category) {
          query.eq("category", params.category);
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

      case "create": {
        // Only staff can upload documents
        if (!["gf_advisor", "gf_admin"].includes(access.role)) {
          return new Response(
            JSON.stringify({ error: "Only advisors and admins can upload documents" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { title, category, icon, page_count, file_type, storage_path, storage_url, external_url, is_final } = params;

        const { data: doc, error: createError } = await supabase
          .from("immersion_documents")
          .insert({
            engagement_id,
            title,
            category,
            icon: icon || null,
            page_count: page_count || null,
            file_type: file_type || "pdf",
            storage_path: storage_path || null,
            storage_url: storage_url || null,
            external_url: external_url || null,
            is_final: is_final || false,
            uploaded_by: user.id,
          })
          .select()
          .single();

        if (createError) {
          return new Response(
            JSON.stringify({ error: createError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(doc),
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
    console.error("[immersion-documents] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
