import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AutomationRules from '../components/automation/AutomationRules';
import PricingRules from '../components/automation/PricingRules';
import InventorySyncSettings from '../components/automation/InventorySyncSettings';
import { Zap, DollarSign, BarChart, RefreshCw } from 'lucide-react';

const Automation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rules');

  const handleSaveInventorySettings = async (settings: any) => {
    // In a real app, you would save these settings to your backend
    console.log('Saving inventory settings:', settings);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
        <p className="text-gray-600">
          Automate your dropshipping business with powerful rules and workflows.
        </p>
      </div>

      <Tabs defaultValue="rules" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="rules" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            <span>Automation Rules</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>Pricing Rules</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Inventory Sync</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules">
          <AutomationRules />
        </TabsContent>
        
        <TabsContent value="pricing">
          <PricingRules />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventorySyncSettings onSave={handleSaveInventorySettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;