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
    const { email } = await req.json();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, try to find the user in company_users
    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('company_id, display_name, role, is_primary')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (userError) {
      console.error('Error querying company_users:', userError);
      throw userError;
    }

    // If user found in database, get company data
    if (companyUser) {
      console.log(`Found user in database for ${normalizedEmail}`);
      
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyUser.company_id)
        .single();

      if (companyError) {
        console.error('Error querying company:', companyError);
        throw companyError;
      }

      // Get access items for this company
      const { data: accessItems, error: itemsError } = await supabase
        .from('access_items')
        .select('*')
        .eq('company_id', companyUser.company_id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (itemsError) {
        console.error('Error querying access_items:', itemsError);
        throw itemsError;
      }

      // Calculate hours remaining
      const hoursRemaining = company.hours_included === -1 
        ? -1 
        : Math.max(0, company.hours_included - company.hours_used);

      const walletData = {
        user_email: normalizedEmail,
        user_id: companyUser.company_id,
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
        access_items: accessItems?.map(item => ({
          id: item.id,
          label: item.label,
          icon: item.icon,
          url: item.url,
          description: item.description,
        })) || [],
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
