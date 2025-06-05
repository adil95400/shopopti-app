import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

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
    // Parse request body
    const requestData = await req.json();
    const { products } = requestData;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No products provided",
          importedCount: 0,
          failedCount: 0
        }),
        { headers, status: 400 }
      );
    }
    
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
    
    // Get Shopify credentials from store_connections table
    const { data: storeConnection, error: storeError } = await supabase
      .from('store_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'shopify')
      .eq('status', 'active')
      .single();
    
    if (storeError || !storeConnection) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No active Shopify connection found",
          importedCount: 0,
          failedCount: products.length
        }),
        { headers, status: 400 }
      );
    }
    
    const shopifyDomain = storeConnection.store_url;
    const shopifyApiKey = storeConnection.api_key;
    
    // Import products to Shopify
    const importedProducts = [];
    const failedProducts = [];
    
    for (const product of products) {
      try {
        // Prepare product data for Shopify
        const shopifyProduct = {
          title: product.name,
          body_html: product.description,
          vendor: "Shopopti+",
          product_type: product.category || "Other",
          status: "active",
          variants: [
            {
              price: product.price,
              sku: product.sku || "",
              inventory_quantity: product.stock || 0,
              inventory_management: "shopify"
            }
          ],
          images: product.images.map((image: string) => ({ src: image }))
        };
        
        // Send product to Shopify
        const response = await fetch(`https://${shopifyDomain}/admin/api/2023-07/products.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": shopifyApiKey
          },
          body: JSON.stringify({ product: shopifyProduct })
        });
        
        if (!response.ok) {
          throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        
        // Record the import in product_imports table
        const { error: importError } = await supabase
          .from('product_imports')
          .insert([{
            product_id: product.id,
            external_id: product.externalId,
            shopify_product_id: responseData.product.id.toString(),
            supplier_id: product.supplier_id,
            status: 'success',
            user_id: user.id,
            metadata: {
              source: product.supplier_type,
              shopify_id: responseData.product.id,
              importDate: new Date().toISOString()
            }
          }]);
        
        if (importError) {
          console.error("Error recording import:", importError);
        }
        
        importedProducts.push(responseData.product);
      } catch (error) {
        console.error(`Error importing product ${product.id} to Shopify:`, error);
        failedProducts.push(product.id);
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Imported ${importedProducts.length} products to Shopify, ${failedProducts.length} failed`,
        importedCount: importedProducts.length,
        failedCount: failedProducts.length,
        failedProductIds: failedProducts
      }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "Internal server error",
        importedCount: 0,
        failedCount: 0
      }),
      { headers, status: 500 }
    );
  }
});