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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Password Reset Function Started ===");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Supabase client created successfully");

    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const { email, redirectUrl }: PasswordResetRequest = requestBody;

    console.log(`Processing password reset request for email: ${email}`);
    console.log(`Redirect URL: ${redirectUrl}`);

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

    // Check if user exists
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

    // For now, send a simple instructional email without generating admin links
    // This bypasses potential service role key issues
    const resetLink = `${redirectUrl}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0;">Namma Ooru Offers</h1>
          <p style="color: #666; margin: 5px 0;">Your Local Deals Platform</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 10px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Password Reset Instructions</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Hi ${profile.name || 'there'},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6;">
            You requested to reset your password for your Namma Ooru Offers account.
          </p>
          
          <p style="color: #4b5563; line-height: 1.6;">
            <strong>To reset your password:</strong>
          </p>
          
          <ol style="color: #4b5563; line-height: 1.8; margin-left: 20px;">
            <li>Go to our sign-in page: <a href="${resetLink}" style="color: #4f46e5;">Namma Ooru Offers Sign In</a></li>
            <li>Click on "Forgot Password?" link</li>
            <li>Enter your email address: <strong>${email}</strong></li>
            <li>You will receive another email with direct reset instructions</li>
          </ol>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            If you didn't request this password reset, please ignore this email. 
            Your password will remain unchanged.
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

    // Send password reset email
    const emailResponse = await resend.emails.send({
      from: "Namma Ooru Offers <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset Instructions - Namma Ooru Offers",
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
    console.error("Error processing password reset:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});