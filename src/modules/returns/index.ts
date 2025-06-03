import { supabase } from '../../lib/supabase';

export interface ReturnRequest {
  id?: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  reason: string;
  items: ReturnItem[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refundAmount?: number;
  trackingNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  reason: string;
  condition: 'new' | 'used' | 'damaged';
  images?: string[];
}

export interface RefundDetails {
  amount: number;
  method: 'original' | 'store_credit' | 'bank_transfer';
  notes?: string;
}

export const returnsService = {
  async getReturnRequests(filters?: {
    status?: 'pending' | 'approved' | 'rejected' | 'completed';
    customerId?: string;
    orderId?: string;
  }): Promise<ReturnRequest[]> {
    try {
      let query = supabase
        .from('return_requests')
        .select('*, return_items(*)')
        .order('created_at', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }
      
      if (filters?.orderId) {
        query = query.eq('order_id', filters.orderId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(request => ({
        id: request.id,
        orderId: request.order_id,
        orderNumber: request.order_number,
        customerId: request.customer_id,
        customerName: request.customer_name,
        customerEmail: request.customer_email,
        reason: request.reason,
        items: request.return_items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          price: item.price,
          reason: item.reason,
          condition: item.condition,
          images: item.images
        })),
        status: request.status,
        refundAmount: request.refund_amount,
        trackingNumber: request.tracking_number,
        createdAt: new Date(request.created_at),
        updatedAt: new Date(request.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching return requests:', error);
      throw error;
    }
  },

  async getReturnRequest(id: string): Promise<ReturnRequest> {
    try {
      const { data, error } = await supabase
        .from('return_requests')
        .select('*, return_items(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        orderId: data.order_id,
        orderNumber: data.order_number,
        customerId: data.customer_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        reason: data.reason,
        items: data.return_items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          price: item.price,
          reason: item.reason,
          condition: item.condition,
          images: item.images
        })),
        status: data.status,
        refundAmount: data.refund_amount,
        trackingNumber: data.tracking_number,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching return request:', error);
      throw error;
    }
  },

  async createReturnRequest(request: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReturnRequest> {
    try {
      // Start a transaction
      const { data, error } = await supabase
        .from('return_requests')
        .insert([{
          order_id: request.orderId,
          order_number: request.orderNumber,
          customer_id: request.customerId,
          customer_name: request.customerName,
          customer_email: request.customerEmail,
          reason: request.reason,
          status: request.status || 'pending',
          refund_amount: request.refundAmount,
          tracking_number: request.trackingNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert return items
      const returnItems = request.items.map(item => ({
        return_request_id: data.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: item.price,
        reason: item.reason,
        condition: item.condition,
        images: item.images
      }));
      
      const { error: itemsError } = await supabase
        .from('return_items')
        .insert(returnItems);
      
      if (itemsError) throw itemsError;
      
      // Get the complete return request with items
      return this.getReturnRequest(data.id);
    } catch (error) {
      console.error('Error creating return request:', error);
      throw error;
    }
  },

  async updateReturnStatus(id: string, status: 'pending' | 'approved' | 'rejected' | 'completed'): Promise<void> {
    try {
      const { error } = await supabase
        .from('return_requests')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating return status:', error);
      throw error;
    }
  },

  async processRefund(id: string, refundDetails: RefundDetails): Promise<void> {
    try {
      // In a real app, you would process the refund through your payment processor
      console.log(`Processing refund for return request ${id}: ${JSON.stringify(refundDetails)}`);
      
      // Update the return request with the refund amount
      const { error } = await supabase
        .from('return_requests')
        .update({
          refund_amount: refundDetails.amount,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Create a refund record
      const { error: refundError } = await supabase
        .from('refunds')
        .insert([{
          return_request_id: id,
          amount: refundDetails.amount,
          method: refundDetails.method,
          notes: refundDetails.notes,
          status: 'completed',
          created_at: new Date().toISOString()
        }]);
      
      if (refundError) throw refundError;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  async addReturnTracking(id: string, trackingNumber: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('return_requests')
        .update({
          tracking_number: trackingNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error adding return tracking:', error);
      throw error;
    }
  }
};