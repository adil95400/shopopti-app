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
    const { supplierId, apiKey, apiSecret, baseUrl, productIds } = await req.json();
    
    if (!apiKey) {
      throw new Error("API key is required");
    }
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("Product IDs are required");
    }
    
    // Get supplier details
    const { data: supplier, error: supplierError } = await supabase
      .from("external_suppliers")
      .select("*")
      .eq("id", supplierId)
      .single();
    
    if (supplierError) {
      throw new Error(`Supplier not found: ${supplierError.message}`);
    }
    
    // Simulate importing products from the supplier
    // In a real implementation, you would make actual API calls to get product details
    
    const importedProducts = [];
    const failedProducts = [];
    
    for (const productId of productIds) {
      try {
        // Simulate product import
        const product = {
          id: crypto.randomUUID(),
          title: `Imported Product ${productId}`,
          description: "This is an imported product from a supplier.",
          price: Math.floor(Math.random() * 100) + 10,
          stock: Math.floor(Math.random() * 100) + 5,
          category: ['Electronics', 'Fashion', 'Home', 'Beauty'][Math.floor(Math.random() * 4)],
          images: [
            `https://images.pexels.com/photos/${1037992 + parseInt(productId) * 10}/pexels-photo-${1037992 + parseInt(productId) * 10}.jpeg?auto=compress&cs=tinysrgb&w=300`
          ],
          metadata: {
            source: supplier.type,
            source_id: productId,
            source_supplier_id: supplierId,
            importDate: new Date().toISOString()
          }
        };
        
        // Insert product into database
        const { data, error } = await supabase
          .from("products")
          .insert([product])
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        importedProducts.push(data);
      } catch (error) {
        console.error(`Failed to import product ${productId}:`, error);
        failedProducts.push({ id: productId, error: error.message });
      }
    }
    
    // Update last sync time for the supplier
    await supabase
      .from("external_suppliers")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", supplierId);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully imported ${importedProducts.length} products`,
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