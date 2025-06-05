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
    
    // Ensure the request is for the providers/bigbuy endpoint
    if (path[0] !== "providers" || path[1] !== "bigbuy") {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract the action (test, products, categories, import)
    const action = path[2];
    
    // Parse the request body
    const { supplierId, apiKey, apiSecret, baseUrl, filters, productIds } = await req.json();
    
    // Validate required parameters
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle different actions
    switch (action) {
      case "test":
        return await testConnection(apiKey, apiSecret, baseUrl);
      case "products":
        return await getProducts(apiKey, apiSecret, baseUrl, filters);
      case "categories":
        return await getCategories(apiKey, apiSecret, baseUrl);
      case "import":
        return await importProducts(apiKey, apiSecret, baseUrl, productIds, supplierId);
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function testConnection(apiKey: string, apiSecret: string, baseUrl: string) {
  try {
    // BigBuy API test endpoint
    const url = `${baseUrl || "https://api.bigbuy.eu"}/rest/catalog/languages.json`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

async function getProducts(apiKey: string, apiSecret: string, baseUrl: string, filters: any = {}) {
  try {
    // BigBuy API products endpoint
    const url = `${baseUrl || "https://api.bigbuy.eu"}/rest/catalog/products.json`;
    
    // Add query parameters for filtering
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.minPrice) queryParams.append("min_price", filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append("max_price", filters.maxPrice.toString());
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    
    const fullUrl = `${url}?${queryParams.toString()}`;
    
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match our SupplierProduct interface
    const products = data.map((product: any) => ({
      id: crypto.randomUUID(),
      externalId: product.id.toString(),
      name: product.name,
      description: product.description || "",
      price: parseFloat(product.price),
      msrp: parseFloat(product.pvp),
      stock: parseInt(product.stock),
      images: product.images.map((img: any) => img.url),
      category: product.category.name,
      supplier_id: "bigbuy",
      supplier_type: "bigbuy",
      sku: product.sku,
      barcode: product.ean13,
      weight: parseFloat(product.weight),
      dimensions: {
        length: parseFloat(product.length),
        width: parseFloat(product.width),
        height: parseFloat(product.height)
      },
      shipping_time: "3-5 days",
      processing_time: "1-2 days",
      metadata: {
        source: "bigbuy",
        sourceId: product.id,
        internalReference: product.internalReference,
        manufacturer: product.manufacturer?.name
      }
    }));
    
    return new Response(JSON.stringify({ products }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

async function getCategories(apiKey: string, apiSecret: string, baseUrl: string) {
  try {
    // BigBuy API categories endpoint
    const url = `${baseUrl || "https://api.bigbuy.eu"}/rest/catalog/categories.json`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match our SupplierCategory interface
    const categories = data.map((category: any) => ({
      id: crypto.randomUUID(),
      name: category.name,
      externalId: category.id.toString(),
      parentId: category.parent ? category.parent.toString() : null,
      level: category.level
    }));
    
    return new Response(JSON.stringify({ categories }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

async function importProducts(apiKey: string, apiSecret: string, baseUrl: string, productIds: string[], supplierId: string) {
  try {
    // Fetch product details for each product ID
    const products = [];
    let importedCount = 0;
    let failedCount = 0;
    const errors = [];
    
    for (const productId of productIds) {
      try {
        // BigBuy API product detail endpoint
        const url = `${baseUrl || "https://api.bigbuy.eu"}/rest/catalog/productinfo/${productId}.json`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${apiKey}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const product = await response.json();
        
        // Transform the product data
        const transformedProduct = {
          id: crypto.randomUUID(),
          externalId: product.id.toString(),
          name: product.name,
          description: product.description || "",
          price: parseFloat(product.price),
          msrp: parseFloat(product.pvp),
          stock: parseInt(product.stock),
          images: product.images.map((img: any) => img.url),
          category: product.category.name,
          supplier_id: supplierId,
          supplier_type: "bigbuy",
          sku: product.sku,
          barcode: product.ean13,
          weight: parseFloat(product.weight),
          dimensions: {
            length: parseFloat(product.length),
            width: parseFloat(product.width),
            height: parseFloat(product.height)
          },
          shipping_time: "3-5 days",
          processing_time: "1-2 days",
          metadata: {
            source: "bigbuy",
            sourceId: product.id,
            internalReference: product.internalReference,
            manufacturer: product.manufacturer?.name
          }
        };
        
        // Save the product to the database
        const { error } = await supabase
          .from('supplier_products')
          .insert([transformedProduct]);
        
        if (error) throw error;
        
        products.push(transformedProduct);
        importedCount++;
      } catch (error) {
        console.error(`Error importing product ${productId}:`, error);
        failedCount++;
        errors.push(`Product ${productId}: ${error.message}`);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully imported ${importedCount} products, ${failedCount} failed`,
      importedCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      importedCount: 0,
      failedCount: productIds.length
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}