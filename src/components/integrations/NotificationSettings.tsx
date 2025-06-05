import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Save,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface NotificationSettingsProps {
  onSaveSettings: (settings: NotificationSettings) => Promise<void>;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  events: {
    syncSuccess: boolean;
    syncError: boolean;
    syncPartial: boolean;
    lowStock: boolean;
    newOrder: boolean;
    orderStatusChange: boolean;
    priceChange: boolean;
  };
  emailRecipients: string[];
  phoneNumbers: string[];
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSaveSettings }) => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    inApp: true,
    events: {
      syncSuccess: false,
      syncError: true,
      syncPartial: true,
      lowStock: true,
      newOrder: true,
      orderStatusChange: false,
      priceChange: false
    },
    emailRecipients: ['admin@example.com'],
    phoneNumbers: []
  });
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleToggle = (field: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleEventToggle = (event: keyof NotificationSettings['events']) => {
    setSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: !prev.events[event]
      }
    }));
  };

  const handleAddEmail = () => {
    if (!newEmail) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      emailRecipients: [...prev.emailRecipients, newEmail]
    }));
    setNewEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      emailRecipients: prev.emailRecipients.filter(e => e !== email)
    }));
  };

  const handleAddPhone = () => {
    if (!newPhone) return;
    
    // Simple phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(newPhone)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, newPhone]
    }));
    setNewPhone('');
  };

  const handleRemovePhone = (phone: string) => {
    setSettings(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter(p => p !== phone)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSaveSettings(settings);
      toast.success('Notification settings saved successfully');
    } catch (error: any) {
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Notification Settings</h3>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Notification Channels</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Email Notifications</h5>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-email"
                    checked={settings.email}
                    onChange={() => handleToggle('email')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-email"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.email ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        settings.email ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">SMS Notifications</h5>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-sms"
                    checked={settings.sms}
                    onChange={() => handleToggle('sms')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-sms"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.sms ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        settings.sms ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Push Notifications</h5>
                    <p className="text-sm text-gray-500">Receive push notifications</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-push"
                    checked={settings.push}
                    onChange={() => handleToggle('push')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-push"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.push ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        settings.push ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">In-App Notifications</h5>
                    <p className="text-sm text-gray-500">Receive notifications in the app</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-inapp"
                    checked={settings.inApp}
                    onChange={() => handleToggle('inApp')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-inapp"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.inApp ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        settings.inApp ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Notification Events</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="event-sync-success"
                  checked={settings.events.syncSuccess}
                  onChange={() => handleEventToggle('syncSuccess')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="event-sync-success" className="ml-2 block text-sm text-gray-700">
                  Successful Synchronization
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="event-sync-error"
                  checked={settings.events.syncError}
                  onChange={() => handleEventToggle('syncError')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="event-sync-error" className="ml-2 block text-sm text-gray-700">
                  Synchronization Errors
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="event-sync-partial"
                  checked={settings.events.syncPartial}
                  onChange={() => handleEventToggle('syncPartial')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="event-sync-partial" className="ml-2 block text-sm text-gray-700">
                  Partial Synchronization
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="event-low-stock"
                  checked={settings.events.lowStock}
                  onChange={() => handleEventToggle('lowStock')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="event-low-stock" className="ml-2 block text-sm text-gray-700">
                  Low Stock Alerts
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="event-new-order"
                  checked={settings.events.newOrder}
                  onChange={() => handleEventToggle('newOrder')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="event-new-order" className="ml-2 block text-sm text-gray-700">
                  New Orders
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="event-order-status"
                  checked={settings.events.orderStatusChange}
                  onChange={() => handleEventToggle('orderStatusChange')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="event-order-status" className="ml-2 block text-sm text-gray-700">
                  Order Status Changes
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="event-price-change"
                  checked={settings.events.priceChange}
                  onChange={() => handleEventToggle('priceChange')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="event-price-change" className="ml-2 block text-sm text-gray-700">
                  Price Changes
                </label>
              </div>
            </div>
          </div>
          
          {settings.email && (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Email Recipients</h4>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <Button 
                    onClick={handleAddEmail}
                    disabled={!newEmail}
                  >
                    Add
                  </Button>
                </div>
                
                {settings.emailRecipients.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">No email recipients</h3>
                        <p className="mt-1 text-sm text-yellow-700">
                          Add at least one email recipient to receive email notifications.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settings.emailRecipients.map((email) => (
                      <div key={email} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{email}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {settings.sms && (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Phone Numbers</h4>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Enter phone number (with country code)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <Button 
                    onClick={handleAddPhone}
                    disabled={!newPhone}
                  >
                    Add
                  </Button>
                </div>
                
                {settings.phoneNumbers.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">No phone numbers</h3>
                        <p className="mt-1 text-sm text-yellow-700">
                          Add at least one phone number to receive SMS notifications.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settings.phoneNumbers.map((phone) => (
                      <div key={phone} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{phone}</span>
                        </div>
                        <button
                          onClick={() => handleRemovePhone(phone)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

export { NotificationSettings }