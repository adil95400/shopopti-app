import React, { useState, useEffect } from 'react';
import { repricingService, PricingRule } from '../../modules/repricing';
import { DollarSign, Plus, Trash2, Save, Percent, Settings, RefreshCw, TrendingUp, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const RepricingPage: React.FC = () => {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<Omit<PricingRule, 'id'>>({
    name: '',
    type: 'percentage',
    value: 0,
    applyTo: 'all',
    applyToValue: '',
    isActive: true
  });
  
  useEffect(() => {
    fetchRules();
  }, []);
  
  const fetchRules = async () => {
    try {
      setLoading(true);
      const fetchedRules = await repricingService.getPricingRules();
      setRules(fetchedRules);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      toast.error('Failed to load pricing rules');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddRule = async () => {
    if (!newRule.name || newRule.value <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      const createdRule = await repricingService.createPricingRule(newRule);
      setRules([...rules, createdRule]);
      setNewRule({
        name: '',
        type: 'percentage',
        value: 0,
        applyTo: 'all',
        applyToValue: '',
        isActive: true
      });
      setIsAddingRule(false);
      toast.success('Pricing rule created successfully');
    } catch (error) {
      console.error('Error creating pricing rule:', error);
      toast.error('Failed to create pricing rule');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleRule = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      await repricingService.updatePricingRule(id, { isActive: !isActive });
      setRules(rules.map(rule => 
        rule.id === id ? { ...rule, isActive: !isActive } : rule
      ));
      toast.success(`Rule ${!isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling pricing rule:', error);
      toast.error('Failed to update pricing rule');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) {
      return;
    }
    
    try {
      setLoading(true);
      await repricingService.deletePricingRule(id);
      setRules(rules.filter(rule => rule.id !== id));
      toast.success('Pricing rule deleted successfully');
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
      toast.error('Failed to delete pricing rule');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Price Optimization</h1>
          <p className="text-gray-600">Automatically optimize your product prices for maximum profit</p>
        </div>
        <Button onClick={() => setIsAddingRule(true)} disabled={isAddingRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Rule
        </Button>
      </div>
      
      {isAddingRule && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">New Pricing Rule</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Standard Markup"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                >
                  <option value="percentage">Percentage Markup</option>
                  <option value="fixed">Fixed Markup</option>
                  <option value="cost_plus">Cost Plus</option>
                  <option value="competitor_based">Competitor Based</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {newRule.type === 'percentage' ? (
                      <Percent className="h-5 w-5 text-gray-400" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                    value={newRule.value}
                    onChange={(e) => setNewRule({ ...newRule, value: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                    value={newRule.minPrice || ''}
                    onChange={(e) => setNewRule({ 
                      ...newRule, 
                      minPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                    value={newRule.maxPrice || ''}
                    onChange={(e) => setNewRule({ 
                      ...newRule, 
                      maxPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply To</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newRule.applyTo}
                  onChange={(e) => setNewRule({ 
                    ...newRule, 
                    applyTo: e.target.value as any,
                    applyToValue: e.target.value === 'all' ? '' : newRule.applyToValue
                  })}
                >
                  <option value="all">All Products</option>
                  <option value="category">Category</option>
                  <option value="supplier">Supplier</option>
                  <option value="tag">Tag</option>
                </select>
              </div>
              
              {newRule.applyTo !== 'all' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newRule.applyTo === 'category' && 'Category Name'}
                    {newRule.applyTo === 'supplier' && 'Supplier Name'}
                    {newRule.applyTo === 'tag' && 'Tag Name'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newRule.applyToValue}
                    onChange={(e) => setNewRule({ ...newRule, applyToValue: e.target.value })}
                    placeholder={
                      newRule.applyTo === 'category' ? 'e.g., Electronics' :
                      newRule.applyTo === 'supplier' ? 'e.g., TechSupplier' :
                      'e.g., premium'
                    }
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddingRule(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRule} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Rule
            </Button>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Active Pricing Rules</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rules..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No pricing rules yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first pricing rule to start optimizing your product prices.
            </p>
            <Button onClick={() => setIsAddingRule(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className={`border rounded-lg p-4 ${rule.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">{rule.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id={`toggle-${rule.id}`}
                        checked={rule.isActive}
                        onChange={() => handleToggleRule(rule.id!, rule.isActive)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`toggle-${rule.id}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          rule.isActive ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            rule.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                    <button
                      onClick={() => handleDeleteRule(rule.id!)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Pricing Type:</span>{' '}
                    <span className="font-medium">
                      {rule.type === 'percentage' && 'Percentage Markup'}
                      {rule.type === 'fixed' && 'Fixed Markup'}
                      {rule.type === 'cost_plus' && 'Cost Plus'}
                      {rule.type === 'competitor_based' && 'Competitor Based'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Value:</span>{' '}
                    <span className="font-medium">
                      {rule.type === 'percentage' ? `${rule.value}%` : `$${rule.value.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {(rule.minPrice !== undefined || rule.maxPrice !== undefined) && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Price Range:</span>{' '}
                      <span className="font-medium">
                        {rule.minPrice !== undefined ? `$${rule.minPrice.toFixed(2)}` : 'No minimum'} - {rule.maxPrice !== undefined ? `$${rule.maxPrice.toFixed(2)}` : 'No maximum'}
                      </span>
                    </div>
                  )}
                  
                  <div className="col-span-2">
                    <span className="text-gray-500">Applies to:</span>{' '}
                    <span className="font-medium">
                      {rule.applyTo === 'all' && 'All Products'}
                      {rule.applyTo === 'category' && `Category: ${rule.applyToValue}`}
                      {rule.applyTo === 'supplier' && `Supplier: ${rule.applyToValue}`}
                      {rule.applyTo === 'tag' && `Tag: ${rule.applyToValue}`}
                    </span>
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
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">Competitor Price Monitoring</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Monitor competitor prices and automatically adjust your prices to stay competitive.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Auto-adjust prices</p>
                <p className="text-sm text-gray-500">Automatically adjust prices based on competitor prices</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-auto-adjust"
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-auto-adjust"
                  className="block overflow-hidden h-6 rounded-full cursor-pointer bg-gray-300"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white transform translate-x-0"
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Price check frequency</p>
                <p className="text-sm text-gray-500">How often to check competitor prices</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Price adjustment strategy</p>
                <p className="text-sm text-gray-500">How to adjust prices based on competitor prices</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="match">Match competitor price</option>
                <option value="undercut">Undercut by percentage</option>
                <option value="average">Use average price</option>
              </select>
            </div>
          </div>
          
          <Button className="w-full mt-6">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan Competitor Prices Now
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">AI Price Recommendations</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Get AI-powered price recommendations based on market data, competitor prices, and your sales history.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">AI price optimization</p>
                <p className="text-sm text-gray-500">Use AI to optimize prices for maximum profit</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-ai-optimization"
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-ai-optimization"
                  className="block overflow-hidden h-6 rounded-full cursor-pointer bg-gray-300"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white transform translate-x-0"
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Optimization goal</p>
                <p className="text-sm text-gray-500">What to optimize for</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="profit">Maximum profit</option>
                <option value="revenue">Maximum revenue</option>
                <option value="volume">Maximum sales volume</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Price change limit</p>
                <p className="text-sm text-gray-500">Maximum percentage change allowed</p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md text-right"
                  defaultValue="10"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-6">
            <TrendingUp className="h-4 w-4 mr-2" />
            Generate AI Price Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RepricingPage;