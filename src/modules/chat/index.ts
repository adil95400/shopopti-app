import { supabase } from '../../lib/supabase';
import { aiService } from '../ai';

export interface ChatMessage {
  id?: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id?: string;
  userId: string;
  title: string;
  lastMessage: string;
  lastMessageTime: Date;
  status: 'active' | 'closed';
}

export const chatService = {
  async getOrCreateSession(userId: string): Promise<ChatSession> {
    try {
      // Check for an active session
      const { data: existingSessions, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('last_message_time', { ascending: false })
        .limit(1);
      
      if (sessionError) throw sessionError;
      
      // If an active session exists, return it
      if (existingSessions && existingSessions.length > 0) {
        return {
          id: existingSessions[0].id,
          userId,
          title: existingSessions[0].title,
          lastMessage: existingSessions[0].last_message,
          lastMessageTime: new Date(existingSessions[0].last_message_time),
          status: existingSessions[0].status
        };
      }
      
      // Otherwise, create a new session
      const { data: newSession, error: createError } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: userId,
          title: 'New Conversation',
          last_message: 'How can I help you today?',
          last_message_time: new Date().toISOString(),
          status: 'active'
        }])
        .select()
        .single();
      
      if (createError) throw createError;
      
      return {
        id: newSession.id,
        userId,
        title: newSession.title,
        lastMessage: newSession.last_message,
        lastMessageTime: new Date(newSession.last_message_time),
        status: newSession.status
      };
    } catch (error) {
      console.error('Error getting or creating chat session:', error);
      throw error;
    }
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(message => ({
        id: message.id,
        userId: message.user_id,
        role: message.role,
        content: message.content,
        timestamp: new Date(message.timestamp),
        metadata: message.metadata
      }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  },

  async sendMessage(sessionId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
    try {
      // Insert the user message
      const { data: userMessage, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          user_id: message.userId,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp.toISOString(),
          metadata: message.metadata
        }])
        .select()
        .single();
      
      if (userMessageError) throw userMessageError;
      
      // Update the session with the last message
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .update({
          last_message: message.content,
          last_message_time: message.timestamp.toISOString()
        })
        .eq('id', sessionId);
      
      if (sessionError) throw sessionError;
      
      // If the message is from the user, generate an AI response
      if (message.role === 'user') {
        // Get previous messages for context
        const { data: previousMessages, error: previousMessagesError } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true })
          .limit(10);
        
        if (previousMessagesError) throw previousMessagesError;
        
        // Build context from previous messages
        const context = previousMessages
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n');
        
        // Generate AI response
        const aiResponse = await aiService.generateResponse({
          review: message.content,
          rating: 5,
          sentiment: 'positive',
          verified: true
        });
        
        // Insert the AI response
        const { data: assistantMessage, error: assistantMessageError } = await supabase
          .from('chat_messages')
          .insert([{
            session_id: sessionId,
            user_id: message.userId,
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString(),
            metadata: { generated: true }
          }])
          .select()
          .single();
        
        if (assistantMessageError) throw assistantMessageError;
        
        // Update the session with the AI response
        const { error: updateSessionError } = await supabase
          .from('chat_sessions')
          .update({
            last_message: aiResponse,
            last_message_time: new Date().toISOString()
          })
          .eq('id', sessionId);
        
        if (updateSessionError) throw updateSessionError;
        
        return {
          id: assistantMessage.id,
          userId: assistantMessage.user_id,
          role: assistantMessage.role,
          content: assistantMessage.content,
          timestamp: new Date(assistantMessage.timestamp),
          metadata: assistantMessage.metadata
        };
      }
      
      return {
        id: userMessage.id,
        userId: userMessage.user_id,
        role: userMessage.role,
        content: userMessage.content,
        timestamp: new Date(userMessage.timestamp),
        metadata: userMessage.metadata
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  async closeSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({
          status: 'closed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error closing chat session:', error);
      throw error;
    }
  },

  async getSessions(userId: string): Promise<ChatSession[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_time', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(session => ({
        id: session.id,
        userId,
        title: session.title,
        lastMessage: session.last_message,
        lastMessageTime: new Date(session.last_message_time),
        status: session.status
      }));
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }
};