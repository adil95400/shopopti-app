import React, { useState } from 'react';
import { Clock, Save, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface InventorySyncSettingsProps {
  onSave: (settings: InventorySyncSettings) => Promise<void>;
}

interface InventorySyncSettings {
  autoSync: boolean;
  syncInterval: number;
  syncThreshold: number;
  notifyOnLowStock: boolean;
  lowStockThreshold: number;
}

const InventorySyncSettings: React.FC<InventorySyncSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<InventorySyncSettings>({
    autoSync: true,
    syncInterval: 12,
    syncThreshold: 5,
    notifyOnLowStock: true,
    lowStockThreshold: 10
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Inventory Sync Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto-Sync Inventory</label>
            <p className="text-sm text-gray-500">Automatically sync inventory with suppliers</p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id="toggle-auto-sync"
              checked={settings.autoSync}
              onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
              className="sr-only"
            />
            <label
              htmlFor="toggle-auto-sync"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${settings.autoSync ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${settings.autoSync ? 'translate-x-6' : 'translate-x-0'}`}
              ></span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sync Interval (hours)</label>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="number"
              min="1"
              max="72"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={settings.syncInterval}
              onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) })}
              disabled={!settings.autoSync}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">How often to check for inventory changes</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sync Threshold (%)</label>
          <input
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={settings.syncThreshold}
            onChange={(e) => setSettings({ ...settings, syncThreshold: parseInt(e.target.value) })}
            disabled={!settings.autoSync}
          />
          <p className="mt-1 text-xs text-gray-500">Only sync when inventory changes by this percentage</p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700">Low Stock Notifications</label>
            <p className="text-sm text-gray-500">Get notified when stock is low</p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id="toggle-low-stock"
              checked={settings.notifyOnLowStock}
              onChange={(e) => setSettings({ ...settings, notifyOnLowStock: e.target.checked })}
              className="sr-only"
            />
            <label
              htmlFor="toggle-low-stock"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifyOnLowStock ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${settings.notifyOnLowStock ? 'translate-x-6' : 'translate-x-0'}`}
              ></span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
          <input
            type="number"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={settings.lowStockThreshold}
            onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
            disabled={!settings.notifyOnLowStock}
          />
          <p className="mt-1 text-xs text-gray-500">Notify when stock falls below this number</p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
    </div>
  );
};

export default InventorySyncSettings;