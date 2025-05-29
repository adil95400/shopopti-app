import React, { useState } from 'react';
import { Code, Key, Lock, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ApiIntegrationProps {
  onSave?: (credentials: ApiCredentials) => Promise<void>;
}

interface ApiCredentials {
  apiKey: string;
  apiSecret?: string;
  endpoint?: string;
  webhookUrl?: string;
}

const ApiIntegration: React.FC<ApiIntegrationProps> = ({ onSave }) => {
  const [credentials, setCredentials] = useState<ApiCredentials>({
    apiKey: '',
    apiSecret: '',
    endpoint: '',
    webhookUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    if (!credentials.apiKey) {
      setStatus('error');
      setMessage('API Key is required');
      return;
    }
    
    try {
      setLoading(true);
      setStatus('idle');
      setMessage('');
      
      if (onSave) {
        await onSave(credentials);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setStatus('success');
      setMessage('API credentials saved successfully');
    } catch (error) {
      console.error('Error saving API credentials:', error);
      setStatus('error');
      setMessage('Failed to save API credentials');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTest = async () => {
    if (!credentials.apiKey) {
      setStatus('error');
      setMessage('API Key is required');
      return;
    }
    
    try {
      setLoading(true);
      setStatus('idle');
      setMessage('');
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.3) {
        setStatus('success');
        setMessage('API connection test successful');
      } else {
        setStatus('error');
        setMessage('API connection test failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error testing API connection:', error);
      setStatus('error');
      setMessage('Failed to test API connection');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 rounded-full mr-3">
          <Code className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium">API Integration</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Connect your store to external services using API credentials.
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="apiKey"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your API key"
              value={credentials.apiKey}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="apiSecret"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your API secret"
              value={credentials.apiSecret}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint (Optional)</label>
          <input
            type="text"
            name="endpoint"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://api.example.com/v1"
            value={credentials.endpoint}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL (Optional)</label>
          <input
            type="text"
            name="webhookUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://your-store.com/api/webhook"
            value={credentials.webhookUrl}
            onChange={handleChange}
          />
        </div>
      </div>
      
      {status !== 'idle' && (
        <div className={`mb-6 p-4 rounded-md ${
          status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center">
            {status === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p>{message}</p>
          </div>
        </div>
      )}
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={handleTest}
          disabled={loading || !credentials.apiKey}
          className="flex-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            'Test Connection'
          )}
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={loading || !credentials.apiKey}
          className="flex-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Credentials
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApiIntegration;