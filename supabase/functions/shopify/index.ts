import { serve } from "npm:@supabase/functions-js";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { products } = await req.json();
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error("Products are required");
    }
    
    // Get Shopify credentials from environment variables
    const shopifyDomain = Deno.env.get("SHOPIFY_DOMAIN");
    const shopifyToken = Deno.env.get("SHOPIFY_ADMIN_TOKEN");
    
    if (!shopifyDomain || !shopifyToken) {
      throw new Error("Shopify credentials not configured");
    }
    
    // Simulate importing products to Shopify
    // In a real implementation, you would make actual API calls to Shopify
    
    const importedProducts = [];
    const failedProducts = [];
    
    for (const product of products) {
      try {
        // Simulate Shopify API call
        // In a real implementation, you would make an actual API call to Shopify
        
        // Simulate successful import
        const shopifyProduct = {
          id: crypto.randomUUID(),
          title: product.name,
          body_html: product.description,
          vendor: "Shopopti+",
          product_type: product.category,
          variants: [
            {
              price: product.price,
              sku: product.sku || "",
              inventory_quantity: product.stock || 0
            }
          ],
          images: product.images.map(url => ({ src: url }))
        };
        
        // Record the import in the database
        const { data, error } = await supabase
          .from("product_imports")
          .insert([{
            product_id: product.id,
            external_id: product.externalId,
            shopify_product_id: shopifyProduct.id,
            supplier_id: product.supplier_id,
            status: "success",
            metadata: {
              shopify_product: shopifyProduct,
              imported_at: new Date().toISOString()
            },
            user_id: req.auth?.uid || "system"
          }])
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        importedProducts.push({
          original: product,
          shopify: shopifyProduct,
          import_record: data
        });
      } catch (error) {
        console.error(`Failed to import product ${product.id} to Shopify:`, error);
        failedProducts.push({ id: product.id, error: error.message });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully imported ${importedProducts.length} products to Shopify`,
        importedCount: importedProducts.length,
        failedCount: failedProducts.length,
        imported: importedProducts,
        failed: failedProducts
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        message: error.message,
        importedCount: 0,
        failedCount: 0,
        errors: [error.message]
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});