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
    // Get all active suppliers
    const { data: suppliers, error } = await supabase
      .from("external_suppliers")
      .select("*")
      .eq("status", "active");
    
    if (error) {
      throw error;
    }
    
    const results = [];
    
    // Sync products for each supplier
    for (const supplier of suppliers) {
      try {
        // Get all products for this supplier
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("*")
          .filter("metadata->source_supplier_id", "eq", supplier.id);
        
        if (productsError) {
          throw productsError;
        }
        
        // Simulate updating product stock and prices
        // In a real implementation, you would make actual API calls to the supplier
        
        let updated = 0;
        let failed = 0;
        
        for (const product of products) {
          try {
            // Simulate getting updated product data from supplier
            const newStock = Math.floor(Math.random() * 100) + 5;
            const newPrice = Math.round((product.price * (0.95 + Math.random() * 0.1)) * 100) / 100;
            
            // Update product in database
            const { error: updateError } = await supabase
              .from("products")
              .update({
                stock: newStock,
                price: newPrice,
                updated_at: new Date().toISOString()
              })
              .eq("id", product.id);
            
            if (updateError) {
              throw updateError;
            }
            
            updated++;
          } catch (error) {
            console.error(`Failed to update product ${product.id}:`, error);
            failed++;
          }
        }
        
        // Update last sync time for the supplier
        await supabase
          .from("external_suppliers")
          .update({ last_sync: new Date().toISOString() })
          .eq("id", supplier.id);
        
        results.push({
          supplier: supplier.name,
          updated,
          failed,
          total: products.length
        });
      } catch (error) {
        console.error(`Failed to sync products for supplier ${supplier.name}:`, error);
        results.push({
          supplier: supplier.name,
          error: error.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});