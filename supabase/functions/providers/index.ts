import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Provider handlers
import { handleBigBuy } from "./bigbuy.ts";
import { handleEprolo } from "./eprolo.ts";
import { handleCdiscount } from "./cdiscount.ts";
import { handleAutoDS } from "./autods.ts";

// Provider mapping
const providers = {
  bigbuy: handleBigBuy,
  eprolo: handleEprolo,
  cdiscount: handleCdiscount,
  autods: handleAutoDS,
};

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Validate path format: /providers/{provider}/{action}
    if (pathParts.length < 3 || pathParts[0] !== "providers") {
      return new Response(
        JSON.stringify({ error: "Invalid endpoint" }),
        { headers, status: 400 }
      );
    }

    const providerName = pathParts[1];
    const action = pathParts[2];
    
    // Check if provider exists
    if (!providers[providerName]) {
      return new Response(
        JSON.stringify({ error: `Provider '${providerName}' not supported` }),
        { headers, status: 400 }
      );
    }

    // Parse request body
    const requestData = await req.json();
    
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { headers, status: 401 }
      );
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers, status: 401 }
      );
    }
    
    // Add user ID to request data
    requestData.userId = user.id;
    
    // Call provider handler
    const result = await providers[providerName](action, requestData, supabase);
    
    return new Response(
      JSON.stringify(result),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers, status: 500 }
    );
  }
});