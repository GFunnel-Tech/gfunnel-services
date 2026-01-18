import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APIHUB_URL = "https://apihub.gfunnel.com/webhook/wallet-lookup";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, company_id } = await req.json();
    const normalizedEmail = email?.toLowerCase().trim();

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let companyData = null;
    let userEmail = normalizedEmail || '';

    // If company_id is provided (admin impersonation), fetch directly
    if (company_id) {
      console.log(`Admin impersonation: fetching company ${company_id}`);
      
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', company_id)
        .single();

      if (companyError || !company) {
        return new Response(
          JSON.stringify({ success: false, error: "Company not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get primary user email for display
      const { data: primaryUser } = await supabase
        .from('company_users')
        .select('email')
        .eq('company_id', company_id)
        .eq('is_primary', true)
        .maybeSingle();

      userEmail = primaryUser?.email || 'admin@company.com';
      companyData = { company, company_id };
    } else if (normalizedEmail) {
      // Normal email lookup flow
      const { data: companyUser, error: userError } = await supabase
        .from('company_users')
        .select('company_id, display_name, role, is_primary')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (userError) {
        console.error('Error querying company_users:', userError);
        throw userError;
      }

      if (companyUser) {
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyUser.company_id)
          .single();

        if (companyError) {
          console.error('Error querying company:', companyError);
          throw companyError;
        }

        companyData = { company, company_id: companyUser.company_id };
      }
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Email or company_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If company data found in database
    if (companyData) {
      const { company, company_id: companyId } = companyData;
      console.log(`Found company in database: ${company.name}`);

      // Get access items for this company
      const { data: accessItems, error: itemsError } = await supabase
        .from('access_items')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (itemsError) {
        console.error('Error querying access_items:', itemsError);
        throw itemsError;
      }

      // Get project requests for this company
      const { data: projectRequests, error: requestsError } = await supabase
        .from('project_requests')
        .select('id, form_type, form_category, request_title, description, video_link, status, priority, submitted_at')
        .eq('company_id', companyId)
        .order('submitted_at', { ascending: false })
        .limit(20);

      if (requestsError) {
        console.error('Error querying project_requests:', requestsError);
        // Don't throw - just continue without requests
      }

      // Get hours history for ROTI chart
      const { data: hoursHistory, error: historyError } = await supabase
        .from('hours_history')
        .select('id, month_year, hours_used, hours_included, plan_price')
        .eq('company_id', companyId)
        .order('month_year', { ascending: false })
        .limit(12);

      if (historyError) {
        console.error('Error querying hours_history:', historyError);
        // Don't throw - just continue without history
      }

      // Get company role assignments
      const { data: companyRoles, error: rolesError } = await supabase
        .from('company_roles')
        .select('id, department_slug, role_title, status, assigned_name, assigned_email, hire_request_id')
        .eq('company_id', companyId)
        .order('department_slug', { ascending: true });

      if (rolesError) {
        console.error('Error querying company_roles:', rolesError);
        // Don't throw - just continue without roles
      }

      // Calculate hours remaining
      const hoursRemaining = company.hours_included === -1 
        ? -1 
        : Math.max(0, company.hours_included - company.hours_used);

      const walletData = {
        user_email: userEmail,
        user_id: companyId,
        company_name: company.name,
        plan_name: company.plan_name,
        plan_price: company.plan_price,
        plan_value: company.plan_value,
        savings_percentage: company.savings_percentage,
        response_time: company.response_time,
        hours_included: company.hours_included,
        hours_used: parseFloat(company.hours_used) || 0,
        hours_remaining: hoursRemaining,
        billing_cycle_end: company.billing_cycle_end,
        overage_rate: company.overage_rate,
        time_multiplier: company.time_multiplier ?? 13,
        va_hourly_rate: parseFloat(company.va_hourly_rate) ?? 15,
        access_items: accessItems?.map(item => ({
          id: item.id,
          label: item.label,
          icon: item.icon,
          url: item.url,
          description: item.description,
        })) || [],
        project_requests: projectRequests || [],
        hours_history: hoursHistory || [],
        company_roles: companyRoles || [],
        last_updated: company.updated_at,
      };

      return new Response(
        JSON.stringify({ success: true, data: walletData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If not in database, fall back to APIHUB
    console.log(`User not in database, calling APIHUB for ${normalizedEmail}`);
    
    const response = await fetch(APIHUB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "get_wallet_data", 
        email: normalizedEmail 
      }),
    });

    if (!response.ok) {
      // User not found anywhere
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No wallet found for this email. Please contact support if you believe this is an error." 
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Wallet proxy error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch wallet data" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
