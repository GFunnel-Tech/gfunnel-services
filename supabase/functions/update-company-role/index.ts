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
    const { company_id, department_slug, role_title, assigned_name, assigned_email, status } = await req.json();

    if (!company_id || !department_slug || !role_title) {
      return new Response(
        JSON.stringify({ success: false, error: "company_id, department_slug, and role_title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify company exists
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', company_id)
      .single();

    if (companyError || !company) {
      return new Response(
        JSON.stringify({ success: false, error: "Company not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine status based on inputs
    const roleStatus = status || (assigned_name ? 'filled' : 'vacant');

    // Upsert the company role
    const { data: roleData, error: roleError } = await supabase
      .from('company_roles')
      .upsert({
        company_id,
        department_slug,
        role_title,
        assigned_name: assigned_name || null,
        assigned_email: assigned_email || null,
        status: roleStatus,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'company_id,department_slug,role_title'
      })
      .select()
      .single();

    if (roleError) {
      console.error('Error upserting company_role:', roleError);
      return new Response(
        JSON.stringify({ success: false, error: roleError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Role updated: ${department_slug}/${role_title} for company ${company_id}`);

    return new Response(
      JSON.stringify({ success: true, data: roleData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Update company role error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update company role" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
