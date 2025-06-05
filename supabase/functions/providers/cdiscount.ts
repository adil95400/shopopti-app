import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Cdiscount API handler
export async function handleCdiscount(
  action: string,
  data: any,
  supabase: SupabaseClient
) {
  switch (action) {
    case "test":
      return await testConnection(data);
    case "products":
      return await getProducts(data);
    case "categories":
      return await getCategories(data);
    case "import":
      return await importProducts(data, supabase);
    default:
      throw new Error(`Action '${action}' not supported for Cdiscount`);
  }
}

// Test connection to Cdiscount API
async function testConnection(data: { apiKey: string; apiSecret: string; baseUrl?: string }) {
  try {
    const baseUrl = data.baseUrl || "https://api.cdiscount.com";
    
    // Cdiscount requires both API key and secret
    if (!data.apiKey || !data.apiSecret) {
      throw new Error("Both API key and API secret are required for Cdiscount");
    }
    
    // Cdiscount uses a token-based authentication
    const tokenResponse = await fetch(`${baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: data.apiKey,
        client_secret: data.apiSecret,
        grant_type: "client_credentials"
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Cdiscount API error: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Test the token with a simple API call
    const response = await fetch(`${baseUrl}/api/products`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Cdiscount API error: ${response.status} ${response.statusText}`);
    }

    return { success: true, message: "Connection successful" };
  } catch (error) {
    console.error("Error testing Cdiscount connection:", error);
    return { success: false, message: error.message || "Connection failed" };
  }
}

// Get products from Cdiscount API
async function getProducts(data: { 
  apiKey: string; 
  apiSecret: string; 
  baseUrl?: string;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    search?: string;
    page?: number;
    limit?: number;
  }
}) {
  try {
    const baseUrl = data.baseUrl || "https://api.cdiscount.com";
    const filters = data.filters || {};
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    
    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: data.apiKey,
        client_secret: data.apiSecret,
        grant_type: "client_credentials"
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Cdiscount API error: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", limit.toString());
    
    if (filters.category) {
      queryParams.append("category", filters.category);
    }
    
    if (filters.search) {
      queryParams.append("search", filters.search);
    }
    
    if (filters.minPrice) {
      queryParams.append("minPrice", filters.minPrice.toString());
    }
    
    if (filters.maxPrice) {
      queryParams.append("maxPrice", filters.maxPrice.toString());
    }
    
    if (filters.minStock) {
      queryParams.append("minStock", filters.minStock.toString());
    }
    
    const response = await fetch(`${baseUrl}/api/products?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Cdiscount API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Transform Cdiscount products to our format
    const products = responseData.products.map((product: any) => ({
      id: `cdiscount-${product.id}`,
      externalId: product.id.toString(),
      name: product.name,
      description: product.description || "",
      price: parseFloat(product.price) || 0,
      msrp: parseFloat(product.msrp) || undefined,
      stock: product.stock || 0,
      images: product.images || [],
      category: product.category || "",
      supplier_id: data.supplierId,
      supplier_type: "cdiscount",
      sku: product.sku || "",
      shipping_time: product.shipping_time || "",
      processing_time: product.processing_time || ""
    }));

    return { 
      success: true, 
      products,
      pagination: {
        page,
        limit,
        total: responseData.total || products.length,
        hasMore: responseData.hasMore || false
      }
    };
  } catch (error) {
    console.error("Error fetching Cdiscount products:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch products",
      products: []
    };
  }
}

// Get categories from Cdiscount API
async function getCategories(data: { apiKey: string; apiSecret: string; baseUrl?: string }) {
  try {
    const baseUrl = data.baseUrl || "https://api.cdiscount.com";
    
    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: data.apiKey,
        client_secret: data.apiSecret,
        grant_type: "client_credentials"
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Cdiscount API error: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    const response = await fetch(`${baseUrl}/api/categories`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Cdiscount API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Transform Cdiscount categories to our format
    const categories = responseData.map((category: any) => ({
      id: category.id.toString(),
      name: category.name,
      parentId: category.parentId ? category.parentId.toString() : null
    }));

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching Cdiscount categories:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch categories",
      categories: []
    };
  }
}

// Import products from Cdiscount to our database
async function importProducts(data: { 
  apiKey: string; 
  apiSecret: string; 
  baseUrl?: string;
  supplierId: string;
  productIds: string[];
  userId: string;
}, supabase: SupabaseClient) {
  try {
    const baseUrl = data.baseUrl || "https://api.cdiscount.com";
    const productIds = data.productIds;
    
    if (!productIds || productIds.length === 0) {
      return { 
        success: false, 
        message: "No product IDs provided",
        importedCount: 0,
        failedCount: 0
      };
    }
    
    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: data.apiKey,
        client_secret: data.apiSecret,
        grant_type: "client_credentials"
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Cdiscount API error: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    const importedProducts = [];
    const failedProducts = [];
    
    // Process each product
    for (const productId of productIds) {
      try {
        // Get product details from Cdiscount
        const response = await fetch(`${baseUrl}/api/products/${productId}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`Cdiscount API error: ${response.status} ${response.statusText}`);
        }

        const productData = await response.json();
        
        // Insert product into our database
        const { data: insertedProduct, error } = await supabase
          .from('products')
          .insert([{
            title: productData.name,
            description: productData.description || "",
            price: parseFloat(productData.price) || 0,
            category: productData.category || "",
            is_published: true,
            created_by: data.userId
          }])
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        // Record the import in product_imports table
        const { error: importError } = await supabase
          .from('product_imports')
          .insert([{
            product_id: insertedProduct.id,
            external_id: productId,
            supplier_id: data.supplierId,
            status: 'success',
            user_id: data.userId,
            metadata: {
              source: 'cdiscount',
              importDate: new Date().toISOString()
            }
          }]);
        
        if (importError) {
          console.error("Error recording import:", importError);
        }
        
        importedProducts.push(insertedProduct);
      } catch (error) {
        console.error(`Error importing product ${productId}:`, error);
        failedProducts.push(productId);
      }
    }

    return { 
      success: true, 
      message: `Imported ${importedProducts.length} products, ${failedProducts.length} failed`,
      importedCount: importedProducts.length,
      failedCount: failedProducts.length,
      failedProductIds: failedProducts
    };
  } catch (error) {
    console.error("Error importing Cdiscount products:", error);
    return { 
      success: false, 
      message: error.message || "Failed to import products",
      importedCount: 0,
      failedCount: data.productIds?.length || 0
    };
  }
}