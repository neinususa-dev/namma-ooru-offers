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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, redirectUrl }: PasswordResetRequest = await req.json();

    console.log(`Processing password reset request for email: ${email}`);

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
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('name, email')
      .eq('email', email.toLowerCase())
      .single();

    if (profileError || !profile) {
      console.error(`User not found for email: ${email}`);
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

    // Generate password reset using Supabase Auth
    const { data: resetData, error: resetError } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (resetError) {
      console.error('Failed to generate reset link:', resetError);
      return new Response(
        JSON.stringify({ error: "Failed to generate reset link" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const resetLink = resetData?.properties?.action_link || redirectUrl;
    
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
            <a href="${resetLink}" 
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

    // Send password reset email
    const emailResponse = await resend.emails.send({
      from: "Namma Ooru Offers <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - Namma Ooru Offers",
      html: emailHtml,
    });

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