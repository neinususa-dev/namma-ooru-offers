import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RazorpayPlan {
  name: string;
  amount: number; // Amount in paise (smallest currency unit)
  currency: string;
  interval: number;
  period: string;
}

const planMapping: Record<string, RazorpayPlan> = {
  "Gold": {
    name: "Gold Plan",
    amount: 50000, // ₹500 in paise
    currency: "INR",
    interval: 1,
    period: "monthly"
  },
  "Platinum": {
    name: "Platinum Plan", 
    amount: 150000, // ₹1500 in paise
    currency: "INR",
    interval: 1,
    period: "monthly"
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Create Supabase client with service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Invalid user token");

    const user = userData.user;
    const { planName } = await req.json();

    if (!planMapping[planName]) {
      throw new Error("Invalid plan selected");
    }

    const selectedPlan = planMapping[planName];

    // Create Razorpay subscription
    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    // First create a plan in Razorpay (you can also do this via dashboard)
    const planResponse = await fetch("https://api.razorpay.com/v1/plans", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${razorpayAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        period: selectedPlan.period,
        interval: selectedPlan.interval,
        item: {
          name: selectedPlan.name,
          amount: selectedPlan.amount,
          currency: selectedPlan.currency,
        },
      }),
    });

    if (!planResponse.ok) {
      const error = await planResponse.text();
      console.error("Plan creation error:", error);
      throw new Error("Failed to create plan in Razorpay");
    }

    const plan = await planResponse.json();

    // Create subscription
    const subscriptionResponse = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${razorpayAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: plan.id,
        customer_notify: 1,
        total_count: 12, // 12 months
        notes: {
          user_id: user.id,
          plan_name: planName,
        },
      }),
    });

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.text();
      console.error("Subscription creation error:", error);
      throw new Error("Failed to create subscription in Razorpay");
    }

    const subscription = await subscriptionResponse.json();

    // Store subscription info in Supabase (optional)
    await supabaseClient.from("subscriptions").upsert({
      user_id: user.id,
      razorpay_subscription_id: subscription.id,
      plan_name: planName,
      status: "created",
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
    });

    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        key_id: razorpayKeyId,
        amount: selectedPlan.amount,
        currency: selectedPlan.currency,
        name: selectedPlan.name,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});