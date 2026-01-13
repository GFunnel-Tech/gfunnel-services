import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APIHUB_URL = "https://apihub.gfunnel.com/webhook/wallet-lookup";

// Mock data for testing
const MOCK_DATA: Record<string, unknown> = {
  "cam@gfunnel.com": {
    success: true,
    data: {
      user_email: "cam@gfunnel.com",
      user_id: "usr_cam123",
      plan_name: "Pro",
      plan_price: 2497,
      plan_value: 13720,
      savings_percentage: 82,
      response_time: "24-48 hrs",
      hours_included: 80,
      hours_used: 48,
      hours_remaining: 32,
      billing_cycle_end: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      overage_rate: 75,
      access_items: [
        {
          id: "recordings",
          label: "Recording Sessions",
          icon: "video",
          url: "https://onscreen.gfunnel.com/users/usr_cam123/recordings",
          description: "View your screen recordings"
        },
        {
          id: "projects",
          label: "Projects",
          icon: "folder",
          url: "https://projects.gfunnel.com/usr_cam123",
          description: "Access your project files"
        },
        {
          id: "documents",
          label: "Documents",
          icon: "file",
          url: "https://docs.gfunnel.com/usr_cam123",
          description: "View shared documents"
        }
      ],
      last_updated: new Date().toISOString()
    }
  }
};

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

    // Check for mock data first
    if (MOCK_DATA[normalizedEmail]) {
      console.log(`Returning mock data for ${normalizedEmail}`);
      return new Response(
        JSON.stringify(MOCK_DATA[normalizedEmail]),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call APIHUB for real data
    const response = await fetch(APIHUB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "get_wallet_data", 
        email: normalizedEmail 
      }),
    });

    if (!response.ok) {
      throw new Error(`APIHUB returned status ${response.status}`);
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