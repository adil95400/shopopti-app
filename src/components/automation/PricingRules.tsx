import React, { useState } from 'react';
import { Plus, Trash2, Save, DollarSign, Percent } from 'lucide-react';
import { Button } from '../ui/button';

interface PricingRule {
  id: string;
  name: string;
  type: 'fixed' | 'percentage' | 'cost_plus';
  value: number;
  minPrice?: number;
  maxPrice?: number;
  applyTo: 'all' | 'category' | 'supplier' | 'tag';
  applyToValue: string;
  isActive: boolean;
}

const PricingRules: React.FC = () => {
  const [rules, setRules] = useState<PricingRule[]>([
    {
      id: '1',
      name: 'Standard Markup',
      type: 'percentage',
      value: 30,
      applyTo: 'all',
      applyToValue: '',
      isActive: true
    },
    {
      id: '2',
      name: 'Electronics Markup',
      type: 'percentage',
      value: 20,
      minPrice: 50,
      applyTo: 'category',
      applyToValue: 'Electronics',
      isActive: true
    },
    {
      id: '3',
      name: 'Premium Products',
      type: 'cost_plus',
      value: 15,
      minPrice: 100,
      applyTo: 'tag',
      applyToValue: 'premium',
      isActive: true
    }
  ]);
  
  const [newRule, setNewRule] = useState<Omit<PricingRule, 'id'>>({
    name: '',
    type: 'percentage',
    value: 0,
    applyTo: 'all',
    applyToValue: '',
    isActive: true
  });
  
  const [isAddingRule, setIsAddingRule] = useState(false);
  
  const handleAddRule = () => {
    if (!newRule.name || newRule.value <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    setRules([...rules, { ...newRule, id: Date.now().toString() }]);
    setNewRule({
      name: '',
      type: 'percentage',
      value: 0,
      applyTo: 'all',
      applyToValue: '',
      isActive: true
    });
    setIsAddingRule(false);
  };
  
  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };
  
  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Pricing Rules</h2>
        <Button onClick={() => setIsAddingRule(true)} disabled={isAddingRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
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
            <Button onClick={handleAddRule}>
              <Save className="h-4 w-4 mr-2" />
              Save Rule
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {rules.length === 0 ? (
          <div className="bg-gray-50 p-6 text-center rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No pricing rules created yet.</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className={`bg-white p-6 rounded-lg shadow-sm border ${rule.isActive ? 'border-blue-200' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{rule.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`toggle-${rule.id}`}
                      checked={rule.isActive}
                      onChange={() => handleToggleRule(rule.id)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`toggle-${rule.id}`}
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${rule.isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${rule.isActive ? 'translate-x-4' : 'translate-x-0'}`}
                      ></span>
                    </label>
                  </div>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
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
          ))
        )}
      </div>
    </div>
  );
};

export default PricingRules;