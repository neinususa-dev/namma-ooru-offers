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

    if (!supabaseUrl || !supabaseKey || !resendKey) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

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

    // Check if user exists in profiles table
    console.log("Checking if user exists in profiles table...");
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('name, email')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (profileError) {
      console.error('Profile query error:', profileError);
      return new Response(
        JSON.stringify({ error: "Database error occurred" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    if (!profile) {
      console.log(`User not found for email: ${email}`);
      // Return success even if user doesn't exist for security reasons
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "If this email is registered, you will receive a password reset link."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(`User found: ${profile.name} (${profile.email})`);

    // Generate proper Supabase recovery link
    console.log("Generating recovery link...");
    const { data: linkData, error: linkError } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (linkError) {
      console.error('Failed to generate recovery link:', linkError);
      return new Response(
        JSON.stringify({ error: `Failed to generate recovery link: ${linkError.message}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const recoveryLink = linkData?.properties?.action_link || redirectUrl;
    console.log("Recovery link generated successfully");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0;">Namma Ooru Offers</h1>
          <p style="color: #666; margin: 5px 0;">Your Local Deals Platform</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 10px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Hi ${profile.name || 'there'},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6;">
            You requested to reset your password for your Namma Ooru Offers account. 
            Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${recoveryLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email. 
            Your password will remain unchanged.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            This link will expire in 24 hours for security reasons.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Namma Ooru Offers - Connecting You to Local Deals
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `;

    console.log("Preparing to send email...");

    // Send password reset email with proper recovery link
    const emailResponse = await resend.emails.send({
      from: "Namma Ooru Offers <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - Namma Ooru Offers",
      html: emailHtml,
    });

    console.log("Email send response:", emailResponse);

    if (emailResponse.error) {
      console.error("Failed to send password reset email:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: "Failed to send password reset email" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Password reset email sent successfully:", emailResponse.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Password reset email sent successfully",
        emailId: emailResponse.data?.id
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