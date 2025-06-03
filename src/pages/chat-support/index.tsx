import React, { useState, useEffect, useRef } from 'react';
import { chatService, ChatMessage, ChatSession } from '../../modules/chat';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Send, User, Bot, Loader2, Clock, ArrowLeft, MoreVertical } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const ChatSupportPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    initializeChat();
  }, []);
  
  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id!);
    }
  }, [activeSession]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error('You must be logged in to use the chat');
        return;
      }
      
      // Get or create a chat session
      const chatSessions = await chatService.getSessions(session.user.id);
      setSessions(chatSessions);
      
      if (chatSessions.length > 0) {
        setActiveSession(chatSessions[0]);
      } else {
        const newSession = await chatService.getOrCreateSession(session.user.id);
        setSessions([newSession]);
        setActiveSession(newSession);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to initialize chat');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMessages = async (sessionId: string) => {
    try {
      setLoading(true);
      const chatMessages = await chatService.getMessages(sessionId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!input.trim() || !activeSession) return;
    
    try {
      setSendingMessage(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error('You must be logged in to send messages');
        return;
      }
      
      // Send user message
      const userMessage: Omit<ChatMessage, 'id'> = {
        userId: session.user.id,
        role: 'user',
        content: input,
        timestamp: new Date()
      };
      
      // Add user message to UI immediately
      setMessages([...messages, userMessage]);
      setInput('');
      
      // Send message to server and get AI response
      const response = await chatService.sendMessage(activeSession.id!, userMessage);
      
      // Add AI response to UI
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const createNewSession = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error('You must be logged in to create a new chat');
        return;
      }
      
      const newSession = await chatService.getOrCreateSession(session.user.id);
      setSessions([newSession, ...sessions]);
      setActiveSession(newSession);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new session:', error);
      toast.error('Failed to create new chat');
    }
  };
  
  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Support</h1>
        <Button onClick={createNewSession}>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
      
      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Conversations</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading && sessions.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      activeSession?.id === session.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setActiveSession(session)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 truncate">{session.title}</h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(session.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {session.lastMessage}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {activeSession ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Button variant="ghost\" size="sm\" className="mr-2 md:hidden">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-medium">{activeSession.title}</h3>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                        <Bot size={40} className="text-primary mb-4" />
                        <p className="font-medium text-gray-600 mb-2">How can I help you today?</p>
                        <p className="text-sm">Ask me anything about Shopopti+, product imports, or any other features.</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start max-w-[80%] ${
                            msg.role === 'user' ? 'flex-row-reverse' : ''
                          }`}>
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                              msg.role === 'user' ? 'bg-primary text-white ml-2' : 'bg-gray-200'
                            }`}>
                              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`px-4 py-3 rounded-lg ${
                              msg.role === 'user' 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-gray-100 rounded-tl-none'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              <div className="mt-1 text-xs opacity-70 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <textarea
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Type your message..."
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sendingMessage}
                  />
                  <Button
                    className="rounded-l-none"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || sendingMessage}
                  >
                    {sendingMessage ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Our AI assistant is here to help with any questions about Shopopti+
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <MessageSquare size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No conversation selected</h3>
              <p className="mb-4">Select a conversation from the sidebar or start a new one</p>
              <Button onClick={createNewSession}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSupportPage;