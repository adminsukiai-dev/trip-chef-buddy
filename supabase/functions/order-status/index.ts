import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simulates order status progression: confirmed → preparing → delivering → delivered
const STATUS_FLOW = ["confirmed", "preparing", "delivering", "delivered"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get current order status
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex >= STATUS_FLOW.length - 1) {
      return new Response(JSON.stringify({ message: "Order already delivered" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Progress to next status
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: nextStatus,
        status_updated_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ status: nextStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("order-status error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
