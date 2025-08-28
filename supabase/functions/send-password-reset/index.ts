import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  redirectUrl: string;
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

serve(async (req) => {
  console.log("=== Password Reset Function Started ===");
  console.log("Request method:", req.method);
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing POST request...");
    
    // Check environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    console.log("Environment check:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasResendKey: !!resendKey
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const requestBody = await req.json();
    console.log("Request body received:", JSON.stringify(requestBody, null, 2));
    
    const { email, redirectUrl }: PasswordResetRequest = requestBody;

    // Validate email address
    if (!email || !isValidEmail(email)) {
      console.error(`Invalid email: ${email}`);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Email validation passed");

    // For now, just return success without actually sending email
    // This will help us identify if the issue is with email sending or something else
    console.log("Returning success response (email sending temporarily disabled for testing)");
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Password reset request processed (test mode)",
        email: email,
        redirectUrl: redirectUrl
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Unexpected error in password reset function:", error);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});