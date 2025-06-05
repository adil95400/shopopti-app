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
    const { apiKey, apiSecret, baseUrl, filters } = await req.json();
    
    if (!apiKey) {
      throw new Error("API key is required");
    }
    
    // Simulate API call to BigBuy
    // In a real implementation, you would make an actual API call to BigBuy
    
    // Generate mock products
    const products = Array(20).fill(0).map((_, i) => ({
      id: `bb-${i + 1}`,
      externalId: `BB${10000 + i}`,
      name: `BigBuy Product ${i + 1}`,
      description: `High-quality product from BigBuy with excellent features and customer satisfaction.`,
      price: Math.floor(Math.random() * 100) + 10,
      msrp: Math.floor(Math.random() * 150) + 20,
      stock: Math.floor(Math.random() * 100) + 5,
      images: [
        `https://images.pexels.com/photos/${1037992 + i * 10}/pexels-photo-${1037992 + i * 10}.jpeg?auto=compress&cs=tinysrgb&w=300`
      ],
      category: ['Electronics', 'Fashion', 'Home', 'Beauty'][Math.floor(Math.random() * 4)],
      supplier_id: "bigbuy",
      supplier_type: "bigbuy",
      shipping_time: `${Math.floor(Math.random() * 10) + 3} days`,
      processing_time: `${Math.floor(Math.random() * 3) + 1} days`,
    }));
    
    // Apply filters if provided
    let filteredProducts = [...products];
    
    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
      }
      
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Pagination
      if (filters.page && filters.limit) {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit;
        filteredProducts = filteredProducts.slice(start, end);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        products: filteredProducts,
        total: products.length,
        filtered: filteredProducts.length
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