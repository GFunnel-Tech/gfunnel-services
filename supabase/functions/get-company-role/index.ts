import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { role_id } = await req.json();

    if (!role_id) {
      return new Response(
        JSON.stringify({ success: false, error: "role_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the company role with all fields
    const { data: roleData, error: roleError } = await supabase
      .from('company_roles')
      .select(`
        id,
        company_id,
        department_slug,
        role_title,
        status,
        assigned_name,
        assigned_email,
        assigned_phone,
        assigned_photo_url,
        google_meet_link,
        profile_type,
        ai_name,
        ai_type,
        ai_agent_id,
        ai_embed_url,
        hire_request_id,
        created_at,
        updated_at
      `)
      .eq('id', role_id)
      .single();

    if (roleError || !roleData) {
      console.error('Error fetching role:', roleError);
      return new Response(
        JSON.stringify({ success: false, error: "Role not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: roleData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Get company role error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch role data" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
