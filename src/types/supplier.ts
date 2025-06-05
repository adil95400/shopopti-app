export interface ExternalSupplier {
  id: string;
  name: string;
  type: 'bigbuy' | 'eprolo' | 'cdiscount' | 'autods';
  apiKey: string;
  apiSecret?: string;
  baseUrl: string;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
  created_at: string;
  user_id: string;
}

export interface SupplierProduct {
  id: string;
  externalId: string;
  name: string;
  description: string;
  price: number;
  msrp?: number;
  stock: number;
  images: string[];
  category: string;
  variants?: ProductVariant[];
  supplier_id: string;
  supplier_type: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shipping_time?: string;
  processing_time?: string;
  metadata?: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  attributes: {
    name: string;
    value: string;
  }[];
  image?: string;
}

export interface SupplierCategory {
  id: string;
  name: string;
  externalId: string;
  parentId?: string;
  supplier_id: string;
  level: number;
}

export interface ImportFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  failedCount: number;
  errors?: string[];
}

export interface OrderRequest {
  external_order_id: string;
  shipping_address: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
    email?: string;
  };
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}

export interface OrderResult {
  success: boolean;
  message: string;
  externalOrderId?: string;
  errors?: string[];
}