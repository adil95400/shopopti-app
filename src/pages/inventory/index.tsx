import React, { useState, useEffect } from 'react';
import { inventoryService, StockAlert, InventorySettings } from '../../modules/inventory';
import { Package, AlertTriangle, Settings, RefreshCw, Search, Filter, CheckCircle, XCircle, Bell } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const InventoryPage: React.FC = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [settings, setSettings] = useState<InventorySettings>({
    lowStockThreshold: 5,
    notifyOnLowStock: true,
    autoReorder: false,
    reorderQuantity: 10,
    trackInventoryChanges: true
  });
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedAlerts, fetchedSettings] = await Promise.all([
        inventoryService.getStockAlerts('active'),
        inventoryService.getInventorySettings()
      ]);
      setAlerts(fetchedAlerts);
      setSettings(fetchedSettings);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResolveAlert = async (alertId: string) => {
    try {
      await inventoryService.resolveStockAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert resolved successfully');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };
  
  const handleIgnoreAlert = async (alertId: string) => {
    try {
      await inventoryService.ignoreStockAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert ignored');
    } catch (error) {
      console.error('Error ignoring alert:', error);
      toast.error('Failed to ignore alert');
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      await inventoryService.updateInventorySettings(settings);
      setSettingsOpen(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Monitor stock levels and manage inventory alerts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setSettingsOpen(!settingsOpen)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {settingsOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Inventory Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Alert will be triggered when stock falls below this number
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Notify on Low Stock</p>
                <p className="text-sm text-gray-500">Receive notifications when stock is low</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-notify"
                  checked={settings.notifyOnLowStock}
                  onChange={(e) => setSettings({ ...settings, notifyOnLowStock: e.target.checked })}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-notify"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.notifyOnLowStock ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      settings.notifyOnLowStock ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Auto-Reorder</p>
                <p className="text-sm text-gray-500">Automatically create reorder when stock is low</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-reorder"
                  checked={settings.autoReorder}
                  onChange={(e) => setSettings({ ...settings, autoReorder: e.target.checked })}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-reorder"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.autoReorder ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      settings.autoReorder ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            {settings.autoReorder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={settings.reorderQuantity}
                  onChange={(e) => setSettings({ ...settings, reorderQuantity: parseInt(e.target.value) })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Quantity to reorder when stock is low
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Track Inventory Changes</p>
                <p className="text-sm text-gray-500">Keep a history of all inventory changes</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-track"
                  checked={settings.trackInventoryChanges}
                  onChange={(e) => setSettings({ ...settings, trackInventoryChanges: e.target.checked })}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-track"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.trackInventoryChanges ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      settings.trackInventoryChanges ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Low Stock Alerts</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No low stock alerts</h3>
            <p className="text-gray-500">
              All your products have sufficient stock levels.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="p-2 bg-red-100 rounded-full mr-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.productName}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Current stock: <span className="font-medium text-red-600">{alert.currentStock}</span> (below threshold of {alert.threshold})
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleIgnoreAlert(alert.id!)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Ignore
                    </Button>
                    <Button size="sm" onClick={() => handleResolveAlert(alert.id!)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">Inventory Overview</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">248</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Pending Reorders</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
            
            <Button className="w-full">
              View Inventory Report
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive low stock alerts via email</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-email"
                  checked={true}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-email"
                  className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive low stock alerts via push notifications</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-push"
                  checked={true}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-push"
                  className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Daily Inventory Report</p>
                <p className="text-sm text-gray-500">Receive a daily inventory report</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-report"
                  checked={false}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-report"
                  className="block overflow-hidden h-6 rounded-full cursor-pointer bg-gray-300"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white transform translate-x-0"
                  ></span>
                </label>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Manage Notification Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;