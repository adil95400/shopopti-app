import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { 
  RefreshCw, 
  Clock, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface SyncSettingsProps {
  platforms: {
    id: string;
    name: string;
    connected: boolean;
    lastSync?: string;
  }[];
  onSyncNow: () => Promise<void>;
  onUpdateSettings: (settings: SyncSettings) => Promise<void>;
}

export interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // in minutes
  syncInventory: boolean;
  syncPrices: boolean;
  syncOrders: boolean;
  syncProducts: boolean;
  conflictResolution: 'newer' | 'manual' | 'primary';
  primaryPlatform: string;
}

const SyncSettings: React.FC<SyncSettingsProps> = ({ 
  platforms, 
  onSyncNow, 
  onUpdateSettings 
}) => {
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SyncSettings>({
    autoSync: true,
    syncInterval: 60, // 1 hour
    syncInventory: true,
    syncPrices: true,
    syncOrders: true,
    syncProducts: true,
    conflictResolution: 'newer',
    primaryPlatform: platforms.length > 0 ? platforms[0].id : ''
  });

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      await onSyncNow();
      toast.success('Synchronization completed successfully');
    } catch (error: any) {
      toast.error(`Synchronization failed: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await onUpdateSettings(settings);
      toast.success('Sync settings saved successfully');
    } catch (error: any) {
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const connectedPlatforms = platforms.filter(p => p.connected);
  const disconnectedPlatforms = platforms.filter(p => !p.connected);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Synchronization Status</h3>
          <Button 
            onClick={handleSyncNow}
            disabled={syncing || connectedPlatforms.length === 0}
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>

        {connectedPlatforms.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">No platforms connected</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Connect at least one platform to enable synchronization.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {connectedPlatforms.map(platform => (
              <div key={platform.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <h4 className="font-medium">{platform.name}</h4>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {platform.lastSync 
                        ? `Last synced: ${new Date(platform.lastSync).toLocaleString()}` 
                        : 'Never synced'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </span>
                </div>
              </div>
            ))}

            {disconnectedPlatforms.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Disconnected Platforms</h4>
                <div className="space-y-2">
                  {disconnectedPlatforms.map(platform => (
                    <div key={platform.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md opacity-60">
                      <div>
                        <h5 className="font-medium">{platform.name}</h5>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Disconnected
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Synchronization Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Automatic Synchronization</label>
                <p className="text-sm text-gray-500">Automatically sync data between platforms</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  name="autoSync"
                  id="autoSync"
                  checked={settings.autoSync}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor="autoSync"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.autoSync ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      settings.autoSync ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            {settings.autoSync && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Interval (minutes)
                </label>
                <select
                  name="syncInterval"
                  value={settings.syncInterval}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every hour</option>
                  <option value="360">Every 6 hours</option>
                  <option value="720">Every 12 hours</option>
                  <option value="1440">Every day</option>
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="syncInventory"
                  name="syncInventory"
                  checked={settings.syncInventory}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="syncInventory" className="ml-2 block text-sm text-gray-700">
                  Sync Inventory
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="syncPrices"
                  name="syncPrices"
                  checked={settings.syncPrices}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="syncPrices" className="ml-2 block text-sm text-gray-700">
                  Sync Prices
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="syncOrders"
                  name="syncOrders"
                  checked={settings.syncOrders}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="syncOrders" className="ml-2 block text-sm text-gray-700">
                  Sync Orders
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="syncProducts"
                  name="syncProducts"
                  checked={settings.syncProducts}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="syncProducts" className="ml-2 block text-sm text-gray-700">
                  Sync Products
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conflict Resolution
              </label>
              <select
                name="conflictResolution"
                value={settings.conflictResolution}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="newer">Use newer data</option>
                <option value="manual">Manual resolution</option>
                <option value="primary">Use primary platform</option>
              </select>
            </div>
            
            {settings.conflictResolution === 'primary' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Platform
                </label>
                <select
                  name="primaryPlatform"
                  value={settings.primaryPlatform}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {connectedPlatforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncSettings;

export { SyncSettings }