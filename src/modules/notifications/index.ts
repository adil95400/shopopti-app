import { supabase } from '../../lib/supabase';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if in browser environment and all required env vars are present
let messaging: any = null;
let firebaseApp: any = null;

if (typeof window !== 'undefined' && 
    firebaseConfig.apiKey && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'product' | 'system' | 'marketing' | 'stock';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  orderUpdates: boolean;
  stockAlerts: boolean;
  marketingMessages: boolean;
  systemAnnouncements: boolean;
}

export const notificationService = {
  async getNotifications(userId: string, limit = 20): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        actionUrl: notification.action_url,
        createdAt: new Date(notification.created_at)
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          action_url: notification.actionUrl,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
        actionUrl: data.action_url,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // If no preferences exist, return defaults
        if (error.code === 'PGRST116') {
          return {
            email: true,
            push: true,
            inApp: true,
            orderUpdates: true,
            stockAlerts: true,
            marketingMessages: true,
            systemAnnouncements: true
          };
        }
        throw error;
      }
      
      return {
        email: data.email,
        push: data.push,
        inApp: data.in_app,
        orderUpdates: data.order_updates,
        stockAlerts: data.stock_alerts,
        marketingMessages: data.marketing_messages,
        systemAnnouncements: data.system_announcements
      };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      // Return default preferences if there's an error
      return {
        email: true,
        push: true,
        inApp: true,
        orderUpdates: true,
        stockAlerts: true,
        marketingMessages: true,
        systemAnnouncements: true
      };
    }
  },

  async updateNotificationPreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert([{
          user_id: userId,
          email: preferences.email,
          push: preferences.push,
          in_app: preferences.inApp,
          order_updates: preferences.orderUpdates,
          stock_alerts: preferences.stockAlerts,
          marketing_messages: preferences.marketingMessages,
          system_announcements: preferences.systemAnnouncements
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  // Firebase Cloud Messaging (FCM) methods for push notifications
  async requestPushPermission(userId: string): Promise<boolean> {
    if (!messaging) {
      console.error('Firebase messaging not initialized');
      return false;
    }
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }
      
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (!token) {
        console.log('No registration token available');
        return false;
      }
      
      // Save the token to the database
      const { error } = await supabase
        .from('push_tokens')
        .upsert([{
          user_id: userId,
          token,
          device_type: 'web',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      // Set up message handler
      onMessage(messaging, (payload) => {
        console.log('Message received:', payload);
        // Display the notification using the browser's Notification API
        if (payload.notification) {
          new Notification(payload.notification.title || 'New notification', {
            body: payload.notification.body,
            icon: '/logo.png'
          });
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error requesting push permission:', error);
      return false;
    }
  },

  async sendPushNotification(userId: string, title: string, body: string, data?: Record<string, string>): Promise<boolean> {
    try {
      // In a real app, you would call your backend API to send the push notification
      // For now, we'll just simulate it
      console.log(`Sending push notification to user ${userId}: ${title} - ${body}`);
      
      // Create an in-app notification as well
      await this.createNotification({
        userId,
        title,
        message: body,
        type: 'system',
        read: false,
        actionUrl: data?.url
      });
      
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }
};