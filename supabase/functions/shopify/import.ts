import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean);
    
    // Ensure the request is for the shopify/import endpoint
    if (path[0] !== "shopify" || path[1] !== "import") {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the user's Shopify credentials from the database
    const { data: { user } } = await supabase.auth.getUser(req.headers.get("Authorization")?.split(" ")[1] || "");
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Get the user's Shopify connection
    const { data: shopifyConnection, error: connectionError } = await supabase
      .from("store_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", "shopify")
      .eq("status", "active")
      .single();
    
    if (connectionError || !shopifyConnection) {
      return new Response(JSON.stringify({ error: "No active Shopify connection found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Parse the request body
    const { products } = await req.json();
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return new Response(JSON.stringify({ error: "No products provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Import products to Shopify
    const importResults = await importProductsToShopify(products, shopifyConnection);
    
    return new Response(JSON.stringify(importResults), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function importProductsToShopify(products, shopifyConnection) {
  const shopifyDomain = shopifyConnection.store_url;
  const shopifyApiKey = shopifyConnection.api_key;
  
  let importedCount = 0;
  let failedCount = 0;
  const errors = [];
  
  for (const product of products) {
    try {
      // Prepare the product data for Shopify
      const shopifyProduct = {
        product: {
          title: product.name,
          body_html: product.description,
          vendor: product.metadata?.vendor || "Imported",
          product_type: product.category,
          tags: product.metadata?.tags || [],
          variants: [
            {
              price: product.price.toString(),
              sku: product.sku,
              barcode: product.barcode,
              inventory_quantity: product.stock,
              weight: product.weight,
              weight_unit: "kg",
              requires_shipping: true
            }
          ],
          images: product.images.map((image: string) => ({ src: image })),
          metafields: [
            {
              namespace: "shopopti",
              key: "supplier_id",
              value: product.supplier_id,
              type: "string"
            },
            {
              namespace: "shopopti",
              key: "external_id",
              value: product.externalId,
              type: "string"
            }
          ]
        }
      };
      
      // Add variants if available
      if (product.variants && product.variants.length > 0) {
        shopifyProduct.product.variants = product.variants.map((variant: any) => ({
          title: variant.name,
          price: variant.price.toString(),
          sku: variant.sku,
          inventory_quantity: variant.stock,
          option1: variant.attributes[0]?.value,
          option2: variant.attributes[1]?.value,
          option3: variant.attributes[2]?.value
        }));
        
        // Add options
        shopifyProduct.product.options = [];
        const optionNames = new Set();
        product.variants.forEach((variant: any) => {
          variant.attributes.forEach((attr: any) => {
            optionNames.add(attr.name);
          });
        });
        
        Array.from(optionNames).forEach((name: string, index: number) => {
          if (index < 3) { // Shopify only supports 3 options
            shopifyProduct.product.options.push({
              name,
              values: [...new Set(product.variants
                .map((v: any) => v.attributes.find((a: any) => a.name === name)?.value)
                .filter(Boolean))]
            });
          }
        });
      }
      
      // Send the product to Shopify
      const response = await fetch(`https://${shopifyDomain}/admin/api/2023-04/products.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyApiKey
        },
        body: JSON.stringify(shopifyProduct)
      });
      
      if (!response.ok) {
        throw new Error(`Shopify API request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Save the import record
      await supabase
        .from("product_imports")
        .insert([{
          product_id: product.id,
          external_id: product.externalId,
          shopify_product_id: responseData.product.id,
          supplier_id: product.supplier_id,
          status: "success",
          metadata: {
            shopify_product_url: `https://${shopifyDomain}/admin/products/${responseData.product.id}`,
            imported_at: new Date().toISOString()
          }
        }]);
      
      importedCount++;
    } catch (error) {
      console.error(`Error importing product ${product.id}:`, error);
      failedCount++;
      errors.push(`Product ${product.name}: ${error.message}`);
      
      // Save the failed import record
      await supabase
        .from("product_imports")
        .insert([{
          product_id: product.id,
          external_id: product.externalId,
          shopify_product_id: null,
          supplier_id: product.supplier_id,
          status: "failed",
          metadata: {
            error: error.message,
            attempted_at: new Date().toISOString()
          }
        }]);
    }
  }
  
  return { 
    success: importedCount > 0, 
    message: `Successfully imported ${importedCount} products, ${failedCount} failed`,
    importedCount,
    failedCount,
    errors: errors.length > 0 ? errors : undefined
  };
}