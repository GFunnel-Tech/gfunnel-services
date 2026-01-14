import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCTION_WEBHOOK = "https://apihub.gfunnel.com/webhook/project-intake";

interface ProjectPayload {
  form_type: string;
  form_category: string;
  email: string;
  video_link?: string;
  request_type?: string;
  assign_to?: string;
  delegate_email?: string;
  delegate_name?: string;
  vision_title?: string;
  service_name?: string;
  action_title?: string;
  description?: string;
  [key: string]: unknown;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const payload: ProjectPayload = await req.json();
    
    console.log("[submit-project] Received payload:", {
      form_type: payload.form_type,
      form_category: payload.form_category,
      email: payload.email,
    });
    
    const email = payload.email?.toLowerCase().trim();
    
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Step 1: Check if email exists in company_users
    const { data: existingUser, error: userError } = await supabase
      .from("company_users")
      .select("id, company_id, email, is_primary")
      .eq("email", email)
      .maybeSingle();
    
    if (userError) {
      console.error("[submit-project] Error checking user:", userError);
    }
    
    let companyId: string | null = null;
    
    if (existingUser) {
      // User exists, use their company
      companyId = existingUser.company_id;
      console.log("[submit-project] Found existing user with company:", companyId);
    } else {
      // User doesn't exist, create company and user
      console.log("[submit-project] Creating new company and user for:", email);
      
      // Generate company name from email domain or use email prefix
      const emailParts = email.split("@");
      const domain = emailParts[1] || "unknown";
      const domainName = domain.split(".")[0];
      const companyName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
      
      // Create a slug from the company name
      const baseSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const timestamp = Date.now().toString(36);
      const slug = `${baseSlug}-${timestamp}`;
      
      // Create company
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: companyName,
          slug: slug,
          hours_included: 40,
          hours_used: 0,
          overage_rate: 75,
          plan_name: "Starter",
          response_time: "Up to 48 hrs",
          plan_price: 1497,
          plan_value: 7500,
          savings_percentage: 80,
        })
        .select("id")
        .single();
      
      if (companyError) {
        console.error("[submit-project] Error creating company:", companyError);
        // Continue without company linkage
      } else {
        companyId = newCompany.id;
        console.log("[submit-project] Created company:", companyId);
        
        // Create company user as primary owner
        const { error: createUserError } = await supabase
          .from("company_users")
          .insert({
            company_id: companyId,
            email: email,
            display_name: emailParts[0],
            role: "owner",
            is_primary: true,
          });
        
        if (createUserError) {
          console.error("[submit-project] Error creating company user:", createUserError);
        } else {
          console.log("[submit-project] Created company user for:", email);
        }
      }
    }
    
    // Step 2: Handle delegation - add delegate as company user if provided
    const delegateEmail = (payload.delegate_email || payload.assign_to)?.toLowerCase().trim();
    
    if (delegateEmail && companyId) {
      // Check if delegate already exists for this company
      const { data: existingDelegate } = await supabase
        .from("company_users")
        .select("id")
        .eq("company_id", companyId)
        .eq("email", delegateEmail)
        .maybeSingle();
      
      if (!existingDelegate) {
        // Add delegate as member
        const { error: delegateError } = await supabase
          .from("company_users")
          .insert({
            company_id: companyId,
            email: delegateEmail,
            display_name: payload.delegate_name || delegateEmail.split("@")[0],
            role: "member",
            is_primary: false,
          });
        
        if (delegateError) {
          console.error("[submit-project] Error adding delegate:", delegateError);
        } else {
          console.log("[submit-project] Added delegate:", delegateEmail);
        }
      }
    }
    
    // Step 3: Determine request title based on form type
    let requestTitle = payload.vision_title || payload.service_name || payload.action_title || null;
    if (payload.form_category === "service_intake" && payload.service_name) {
      requestTitle = payload.service_name;
    }
    
    // Step 4: Store project request in database
    const { data: projectRequest, error: requestError } = await supabase
      .from("project_requests")
      .insert({
        form_type: payload.form_type,
        form_category: payload.form_category,
        request_title: requestTitle,
        description: payload.description || null,
        email: email,
        video_link: payload.video_link || null,
        delegate_email: delegateEmail || null,
        delegate_name: payload.delegate_name || null,
        payload: payload,
        status: "pending",
        priority: "medium",
        company_id: companyId,
      })
      .select("id")
      .single();
    
    if (requestError) {
      console.error("[submit-project] Error storing request:", requestError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to store request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("[submit-project] Stored request:", projectRequest.id);
    
    // Step 5: Forward to production webhook
    try {
      const webhookResponse = await fetch(PRODUCTION_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          project_request_id: projectRequest.id,
          company_id: companyId,
        }),
      });
      
      console.log("[submit-project] Webhook response status:", webhookResponse.status);
    } catch (webhookError) {
      // Log but don't fail - data is stored in database
      console.error("[submit-project] Webhook forward failed:", webhookError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        project_request_id: projectRequest.id,
        company_id: companyId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("[submit-project] Unexpected error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});