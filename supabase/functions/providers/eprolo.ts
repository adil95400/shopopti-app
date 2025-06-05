import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// EPROLO API handler
export async function handleEprolo(
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
      throw new Error(`Action '${action}' not supported for EPROLO`);
  }
}

// Test connection to EPROLO API
async function testConnection(data: { apiKey: string; apiSecret?: string; baseUrl?: string }) {
  try {
    const baseUrl = data.baseUrl || "https://api.eprolo.com";
    const response = await fetch(`${baseUrl}/api/v1/products`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": data.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`EPROLO API error: ${response.status} ${response.statusText}`);
    }

    return { success: true, message: "Connection successful" };
  } catch (error) {
    console.error("Error testing EPROLO connection:", error);
    return { success: false, message: error.message || "Connection failed" };
  }
}

// Get products from EPROLO API
async function getProducts(data: { 
  apiKey: string; 
  apiSecret?: string; 
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
    const baseUrl = data.baseUrl || "https://api.eprolo.com";
    const filters = data.filters || {};
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    
    if (filters.category) {
      queryParams.append("category", filters.category);
    }
    
    if (filters.search) {
      queryParams.append("search", filters.search);
    }
    
    if (filters.minPrice) {
      queryParams.append("min_price", filters.minPrice.toString());
    }
    
    if (filters.maxPrice) {
      queryParams.append("max_price", filters.maxPrice.toString());
    }
    
    if (filters.minStock) {
      queryParams.append("min_stock", filters.minStock.toString());
    }
    
    const response = await fetch(`${baseUrl}/api/v1/products?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": data.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`EPROLO API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Transform EPROLO products to our format
    const products = responseData.data.map((product: any) => ({
      id: `eprolo-${product.id}`,
      externalId: product.id.toString(),
      name: product.name,
      description: product.description || "",
      price: parseFloat(product.price) || 0,
      msrp: parseFloat(product.msrp) || undefined,
      stock: product.inventory || 0,
      images: product.images || [],
      category: product.category || "",
      supplier_id: data.supplierId,
      supplier_type: "eprolo",
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
        hasMore: responseData.has_more || false
      }
    };
  } catch (error) {
    console.error("Error fetching EPROLO products:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch products",
      products: []
    };
  }
}

// Get categories from EPROLO API
async function getCategories(data: { apiKey: string; apiSecret?: string; baseUrl?: string }) {
  try {
    const baseUrl = data.baseUrl || "https://api.eprolo.com";
    const response = await fetch(`${baseUrl}/api/v1/categories`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": data.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`EPROLO API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Transform EPROLO categories to our format
    const categories = responseData.map((category: any) => ({
      id: category.id.toString(),
      name: category.name,
      parentId: category.parent_id ? category.parent_id.toString() : null
    }));

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching EPROLO categories:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch categories",
      categories: []
    };
  }
}

// Import products from EPROLO to our database
async function importProducts(data: { 
  apiKey: string; 
  apiSecret?: string; 
  baseUrl?: string;
  supplierId: string;
  productIds: string[];
  userId: string;
}, supabase: SupabaseClient) {
  try {
    const baseUrl = data.baseUrl || "https://api.eprolo.com";
    const productIds = data.productIds;
    
    if (!productIds || productIds.length === 0) {
      return { 
        success: false, 
        message: "No product IDs provided",
        importedCount: 0,
        failedCount: 0
      };
    }
    
    const importedProducts = [];
    const failedProducts = [];
    
    // Process each product
    for (const productId of productIds) {
      try {
        // Get product details from EPROLO
        const response = await fetch(`${baseUrl}/api/v1/products/${productId}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": data.apiKey
          }
        });

        if (!response.ok) {
          throw new Error(`EPROLO API error: ${response.status} ${response.statusText}`);
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
              source: 'eprolo',
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
    console.error("Error importing EPROLO products:", error);
    return { 
      success: false, 
      message: error.message || "Failed to import products",
      importedCount: 0,
      failedCount: data.productIds?.length || 0
    };
  }
}