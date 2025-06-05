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
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // Handle different endpoints
    if (path === "products") {
      return await handleProducts(req);
    } else if (path === "orders") {
      return await handleOrders(req);
    } else if (path === "inventory") {
      return await handleInventory(req);
    } else if (path === "categories") {
      return await handleCategories(req);
    } else {
      // Default handler for validation and connection
      return await handleConnection(req);
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function handleConnection(req: Request) {
  const { storeUrl, accessToken } = await req.json();
  
  if (!storeUrl || !accessToken) {
    return new Response(
      JSON.stringify({ success: false, error: "Store URL and Access Token are required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
  
  try {
    // In a real implementation, you would make an API call to Shopify to validate the credentials
    // For now, we'll simulate the validation
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Shopify connection successful",
        shop: {
          name: storeUrl.replace(".myshopify.com", ""),
          url: `https://${storeUrl}`,
          plan: "Basic Shopify",
          email: `admin@${storeUrl}`
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

async function handleProducts(req: Request) {
  const { storeUrl, accessToken, action, productId, productData } = await req.json();
  
  if (!storeUrl || !accessToken) {
    return new Response(
      JSON.stringify({ success: false, error: "Store URL and Access Token are required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
  
  try {
    // In a real implementation, you would make API calls to Shopify to manage products
    // For now, we'll simulate the API calls
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (req.method === "GET") {
      // Get products
      const products = Array(10).fill(0).map((_, i) => ({
        id: `gid://shopify/Product/${1000000 + i}`,
        title: `Shopify Product ${i + 1}`,
        description: `This is a sample product from Shopify.`,
        price: Math.floor(Math.random() * 100) + 10,
        variants: [
          {
            id: `gid://shopify/ProductVariant/${2000000 + i}`,
            title: "Default",
            price: Math.floor(Math.random() * 100) + 10,
            inventory_quantity: Math.floor(Math.random() * 100) + 5
          }
        ],
        images: [
          {
            id: `gid://shopify/ProductImage/${3000000 + i}`,
            src: `https://images.pexels.com/photos/${1037992 + i * 10}/pexels-photo-${1037992 + i * 10}.jpeg?auto=compress&cs=tinysrgb&w=300`
          }
        ],
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      return new Response(
        JSON.stringify({ success: true, products }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (req.method === "POST") {
      // Create product
      if (!productData) {
        return new Response(
          JSON.stringify({ success: false, error: "Product data is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const product = {
        id: `gid://shopify/Product/${Math.floor(Math.random() * 1000000)}`,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        variants: [
          {
            id: `gid://shopify/ProductVariant/${Math.floor(Math.random() * 1000000)}`,
            title: "Default",
            price: productData.price,
            inventory_quantity: productData.inventory_quantity || 0
          }
        ],
        images: productData.images?.map((src: string, i: number) => ({
          id: `gid://shopify/ProductImage/${Math.floor(Math.random() * 1000000) + i}`,
          src
        })) || [],
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({ success: true, product }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (req.method === "PUT") {
      // Update product
      if (!productId) {
        return new Response(
          JSON.stringify({ success: false, error: "Product ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (!productData) {
        return new Response(
          JSON.stringify({ success: false, error: "Product data is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const product = {
        id: productId,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        variants: [
          {
            id: `gid://shopify/ProductVariant/${Math.floor(Math.random() * 1000000)}`,
            title: "Default",
            price: productData.price,
            inventory_quantity: productData.inventory_quantity || 0
          }
        ],
        images: productData.images?.map((src: string, i: number) => ({
          id: `gid://shopify/ProductImage/${Math.floor(Math.random() * 1000000) + i}`,
          src
        })) || [],
        status: "active",
        updated_at: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({ success: true, product }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (req.method === "DELETE") {
      // Delete product
      if (!productId) {
        return new Response(
          JSON.stringify({ success: false, error: "Product ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Product deleted successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request method" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

async function handleOrders(req: Request) {
  const { storeUrl, accessToken, action, orderId, orderData } = await req.json();
  
  if (!storeUrl || !accessToken) {
    return new Response(
      JSON.stringify({ success: false, error: "Store URL and Access Token are required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
  
  try {
    // In a real implementation, you would make API calls to Shopify to manage orders
    // For now, we'll simulate the API calls
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (req.method === "GET") {
      // Get orders
      const orders = Array(5).fill(0).map((_, i) => ({
        id: `gid://shopify/Order/${4000000 + i}`,
        order_number: 1000 + i,
        customer: {
          id: `gid://shopify/Customer/${5000000 + i}`,
          email: `customer${i + 1}@example.com`,
          first_name: `Customer`,
          last_name: `${i + 1}`
        },
        line_items: [
          {
            id: `gid://shopify/LineItem/${6000000 + i}`,
            title: `Shopify Product ${i + 1}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 100) + 10
          }
        ],
        total_price: Math.floor(Math.random() * 200) + 50,
        financial_status: "paid",
        fulfillment_status: ["fulfilled", "unfulfilled", "partial"][Math.floor(Math.random() * 3)],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      return new Response(
        JSON.stringify({ success: true, orders }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (req.method === "POST") {
      // Create order
      if (!orderData) {
        return new Response(
          JSON.stringify({ success: false, error: "Order data is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const order = {
        id: `gid://shopify/Order/${Math.floor(Math.random() * 1000000)}`,
        order_number: Math.floor(Math.random() * 10000),
        customer: orderData.customer,
        line_items: orderData.line_items,
        total_price: orderData.total_price,
        financial_status: "pending",
        fulfillment_status: "unfulfilled",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({ success: true, order }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (req.method === "PUT") {
      // Update order
      if (!orderId) {
        return new Response(
          JSON.stringify({ success: false, error: "Order ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (!orderData) {
        return new Response(
          JSON.stringify({ success: false, error: "Order data is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const order = {
        id: orderId,
        order_number: Math.floor(Math.random() * 10000),
        customer: orderData.customer,
        line_items: orderData.line_items,
        total_price: orderData.total_price,
        financial_status: orderData.financial_status,
        fulfillment_status: orderData.fulfillment_status,
        updated_at: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({ success: true, order }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request method" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

async function handleInventory(req: Request) {
  const { storeUrl, accessToken, action, productId, variantId, quantity } = await req.json();
  
  if (!storeUrl || !accessToken) {
    return new Response(
      JSON.stringify({ success: false, error: "Store URL and Access Token are required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
  
  try {
    // In a real implementation, you would make API calls to Shopify to manage inventory
    // For now, we'll simulate the API calls
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (req.method === "GET") {
      // Get inventory levels
      const inventoryLevels = Array(10).fill(0).map((_, i) => ({
        inventory_item_id: `gid://shopify/InventoryItem/${7000000 + i}`,
        location_id: `gid://shopify/Location/1`,
        available: Math.floor(Math.random() * 100) + 5,
        updated_at: new Date().toISOString()
      }));
      
      return new Response(
        JSON.stringify({ success: true, inventory_levels: inventoryLevels }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (req.method === "POST" || req.method === "PUT") {
      // Update inventory level
      if (!variantId) {
        return new Response(
          JSON.stringify({ success: false, error: "Variant ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (quantity === undefined) {
        return new Response(
          JSON.stringify({ success: false, error: "Quantity is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const inventoryLevel = {
        inventory_item_id: `gid://shopify/InventoryItem/${Math.floor(Math.random() * 1000000)}`,
        location_id: `gid://shopify/Location/1`,
        available: quantity,
        updated_at: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({ success: true, inventory_level: inventoryLevel }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request method" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

async function handleCategories(req: Request) {
  const { storeUrl, accessToken } = await req.json();
  
  if (!storeUrl || !accessToken) {
    return new Response(
      JSON.stringify({ success: false, error: "Store URL and Access Token are required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
  
  try {
    // In a real implementation, you would make API calls to Shopify to get collections
    // For now, we'll simulate the API calls
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get collections (categories)
    const collections = [
      { id: "gid://shopify/Collection/1", title: "Home page", handle: "frontpage" },
      { id: "gid://shopify/Collection/2", title: "Electronics", handle: "electronics" },
      { id: "gid://shopify/Collection/3", title: "Clothing", handle: "clothing" },
      { id: "gid://shopify/Collection/4", title: "Home & Garden", handle: "home-garden" },
      { id: "gid://shopify/Collection/5", title: "Beauty & Personal Care", handle: "beauty-personal-care" }
    ];
    
    return new Response(
      JSON.stringify({ success: true, collections }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}