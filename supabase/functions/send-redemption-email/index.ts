import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'redemption_requested' | 'redemption_approved' | 'redemption_rejected';
  redemptionId: string;
  customerEmail: string;
  merchantEmail: string;
  customerName: string;
  merchantName: string;
  offerTitle: string;
  storeName: string;
}

const getEmailContent = (type: string, data: any) => {
  const { customerName, merchantName, offerTitle, storeName } = data;
  
  switch (type) {
    case 'redemption_requested':
      return {
        customerSubject: "Redemption Request Submitted Successfully",
        customerHtml: `
          <h1>Redemption Request Submitted</h1>
          <p>Hi ${customerName},</p>
          <p>Your redemption request for the offer "<strong>${offerTitle}</strong>" from ${storeName} has been submitted successfully.</p>
          <p>The merchant will review your request and respond shortly.</p>
          <p>You will receive another email once the merchant makes a decision.</p>
          <p>Thank you for using our platform!</p>
        `,
        merchantSubject: "New Redemption Request Received",
        merchantHtml: `
          <h1>New Redemption Request</h1>
          <p>Hi ${merchantName},</p>
          <p>You have received a new redemption request from <strong>${customerName}</strong> for your offer:</p>
          <p><strong>Offer:</strong> ${offerTitle}</p>
          <p>Please log in to your merchant dashboard to approve or reject this redemption request.</p>
          <p>Prompt action helps maintain customer satisfaction!</p>
        `
      };
    case 'redemption_approved':
      return {
        customerSubject: "Redemption Request Approved! 🎉",
        customerHtml: `
          <h1>Great News! Your Redemption is Approved</h1>
          <p>Hi ${customerName},</p>
          <p>Wonderful news! Your redemption request for "<strong>${offerTitle}</strong>" from ${storeName} has been <strong>approved</strong>!</p>
          <p>You can now visit ${storeName} to claim your offer.</p>
          <p>Please present this email or your account information to the merchant when claiming.</p>
          <p>Enjoy your savings!</p>
        `,
        merchantSubject: "Redemption Approved - Customer Notification Sent",
        merchantHtml: `
          <h1>Redemption Approved</h1>
          <p>Hi ${merchantName},</p>
          <p>You have successfully approved the redemption request from <strong>${customerName}</strong> for offer "${offerTitle}".</p>
          <p>The customer has been notified and will visit your store to claim the offer.</p>
          <p>Thank you for using our platform!</p>
        `
      };
    case 'redemption_rejected':
      return {
        customerSubject: "Redemption Request Update",
        customerHtml: `
          <h1>Redemption Request Status Update</h1>
          <p>Hi ${customerName},</p>
          <p>We regret to inform you that your redemption request for "<strong>${offerTitle}</strong>" from ${storeName} could not be processed at this time.</p>
          <p>This might be due to offer expiry, stock limitations, or other merchant policies.</p>
          <p>We encourage you to explore other exciting offers available on our platform.</p>
          <p>Thank you for your understanding!</p>
        `,
        merchantSubject: "Redemption Rejected - Customer Notification Sent",
        merchantHtml: `
          <h1>Redemption Rejected</h1>
          <p>Hi ${merchantName},</p>
          <p>You have rejected the redemption request from <strong>${customerName}</strong> for offer "${offerTitle}".</p>
          <p>The customer has been notified about this decision.</p>
          <p>Thank you for managing your offers responsibly!</p>
        `
      };
    default:
      throw new Error("Invalid email type");
  }
};

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

    const { type, redemptionId, customerEmail, merchantEmail, customerName, merchantName, offerTitle, storeName }: EmailRequest = await req.json();

    console.log(`Sending ${type} emails for redemption ${redemptionId}`);
    console.log(`Customer email: ${customerEmail}, Merchant email: ${merchantEmail}`);

    // Validate email addresses
    if (!customerEmail || !isValidEmail(customerEmail)) {
      console.error(`Invalid customer email: ${customerEmail}`);
      return new Response(
        JSON.stringify({ error: "Invalid customer email address" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!merchantEmail || !isValidEmail(merchantEmail)) {
      console.error(`Invalid merchant email: ${merchantEmail}`);
      return new Response(
        JSON.stringify({ error: "Invalid merchant email address" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const emailContent = getEmailContent(type, { customerName, merchantName, offerTitle, storeName });

    let customerEmailResponse;
    let merchantEmailResponse;

    // Note: In Resend testing mode, emails can only be sent to verified addresses
    // For production use, verify your domain at https://resend.com/domains
    const verifiedEmail = "nammaooruoffers.official@gmail.com"; // Your verified Resend email
    
    // Send email to customer
    try {
      customerEmailResponse = await resend.emails.send({
        from: "OfferHub <onboarding@resend.dev>",
        to: [verifiedEmail], // Use verified email for testing
        subject: `[FOR ${customerEmail}] ${emailContent.customerSubject}`,
        html: `
          <p><strong>This email was intended for: ${customerEmail}</strong></p>
          <p><strong>Customer Name: ${customerName}</strong></p>
          <hr>
          ${emailContent.customerHtml}
        `,
      });
      console.log("Customer email sent:", customerEmailResponse);
    } catch (emailError) {
      console.error("Failed to send customer email:", emailError);
      customerEmailResponse = { error: emailError };
    }

    // Send email to merchant
    try {
      merchantEmailResponse = await resend.emails.send({
        from: "OfferHub <onboarding@resend.dev>",
        to: [verifiedEmail], // Use verified email for testing
        subject: `[FOR ${merchantEmail}] ${emailContent.merchantSubject}`,
        html: `
          <p><strong>This email was intended for: ${merchantEmail}</strong></p>
          <p><strong>Merchant Name: ${merchantName}</strong></p>
          <hr>
          ${emailContent.merchantHtml}
        `,
      });
      console.log("Merchant email sent:", merchantEmailResponse);
    } catch (emailError) {
      console.error("Failed to send merchant email:", emailError);
      merchantEmailResponse = { error: emailError };
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmailId: customerEmailResponse?.data?.id,
        merchantEmailId: merchantEmailResponse?.data?.id,
        customerEmailStatus: customerEmailResponse?.error ? 'failed' : 'sent',
        merchantEmailStatus: merchantEmailResponse?.error ? 'failed' : 'sent'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error sending redemption emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});