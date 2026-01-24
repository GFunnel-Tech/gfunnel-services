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
    const { action, company_id, requester_email, email, display_name, role, user_id } = await req.json();

    if (!company_id || !requester_email) {
      return new Response(
        JSON.stringify({ success: false, error: "company_id and requester_email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the requester is a primary user or owner/admin of this company
    const { data: requesterData, error: requesterError } = await supabase
      .from('company_users')
      .select('id, role, is_primary')
      .eq('company_id', company_id)
      .eq('email', requester_email.toLowerCase().trim())
      .maybeSingle();

    if (requesterError) {
      console.error('Error checking requester:', requesterError);
      throw requesterError;
    }

    if (!requesterData) {
      return new Response(
        JSON.stringify({ success: false, error: "You don't have access to this company" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only primary users or owner/admin can manage team
    const canManage = requesterData.is_primary || 
                      requesterData.role === 'owner' || 
                      requesterData.role === 'admin';

    if (!canManage) {
      return new Response(
        JSON.stringify({ success: false, error: "Only primary users or admins can manage team members" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'add') {
      if (!email) {
        return new Response(
          JSON.stringify({ success: false, error: "Email is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user already exists in this company
      const { data: existingUser } = await supabase
        .from('company_users')
        .select('id')
        .eq('company_id', company_id)
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, error: "This email is already a team member" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add the new user
      const { data: newUser, error: insertError } = await supabase
        .from('company_users')
        .insert({
          company_id,
          email: email.toLowerCase().trim(),
          display_name: display_name || null,
          role: role || 'member',
          is_primary: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error adding user:', insertError);
        throw insertError;
      }

      console.log(`Added user ${email} to company ${company_id}`);
      return new Response(
        JSON.stringify({ success: true, data: newUser }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === 'remove') {
      if (!user_id) {
        return new Response(
          JSON.stringify({ success: false, error: "user_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get the user to be removed
      const { data: targetUser, error: targetError } = await supabase
        .from('company_users')
        .select('id, email, is_primary')
        .eq('id', user_id)
        .eq('company_id', company_id)
        .maybeSingle();

      if (targetError || !targetUser) {
        return new Response(
          JSON.stringify({ success: false, error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Cannot remove primary user
      if (targetUser.is_primary) {
        return new Response(
          JSON.stringify({ success: false, error: "Cannot remove the primary account holder" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Delete the user
      const { error: deleteError } = await supabase
        .from('company_users')
        .delete()
        .eq('id', user_id);

      if (deleteError) {
        console.error('Error removing user:', deleteError);
        throw deleteError;
      }

      console.log(`Removed user ${targetUser.email} from company ${company_id}`);
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid action. Use 'add' or 'remove'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Manage company users error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to manage team members" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
