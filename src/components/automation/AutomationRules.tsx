import React, { useState } from 'react';
import { Plus, Trash2, Save, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Rule {
  id: string;
  name: string;
  condition: {
    field: string;
    operator: string;
    value: string;
  };
  action: {
    type: string;
    value: string;
  };
  isActive: boolean;
}

const AutomationRules: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: 'Low Stock Alert',
      condition: {
        field: 'stock',
        operator: 'less_than',
        value: '10'
      },
      action: {
        type: 'notification',
        value: 'email'
      },
      isActive: true
    },
    {
      id: '2',
      name: 'Price Increase',
      condition: {
        field: 'cost',
        operator: 'increased_by',
        value: '5'
      },
      action: {
        type: 'adjust_price',
        value: 'percentage:10'
      },
      isActive: true
    }
  ]);
  
  const [newRule, setNewRule] = useState<Omit<Rule, 'id'>>({
    name: '',
    condition: {
      field: 'stock',
      operator: 'less_than',
      value: ''
    },
    action: {
      type: 'notification',
      value: 'email'
    },
    isActive: true
  });
  
  const [isAddingRule, setIsAddingRule] = useState(false);
  
  const handleAddRule = () => {
    if (!newRule.name || !newRule.condition.value || !newRule.action.value) {
      alert('Please fill in all fields');
      return;
    }
    
    setRules([...rules, { ...newRule, id: Date.now().toString() }]);
    setNewRule({
      name: '',
      condition: {
        field: 'stock',
        operator: 'less_than',
        value: ''
      },
      action: {
        type: 'notification',
        value: 'email'
      },
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
        <h2 className="text-xl font-bold">Automation Rules</h2>
        <Button onClick={() => setIsAddingRule(true)} disabled={isAddingRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>
      
      {isAddingRule && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">New Automation Rule</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Low Stock Alert"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <div className="flex space-x-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={newRule.condition.field}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    condition: { ...newRule.condition, field: e.target.value }
                  })}
                >
                  <option value="stock">Stock Level</option>
                  <option value="cost">Cost Price</option>
                  <option value="sales">Sales Count</option>
                  <option value="margin">Profit Margin</option>
                </select>
                
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={newRule.condition.operator}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    condition: { ...newRule.condition, operator: e.target.value }
                  })}
                >
                  <option value="less_than">Less than</option>
                  <option value="greater_than">Greater than</option>
                  <option value="equals">Equals</option>
                  <option value="increased_by">Increased by</option>
                  <option value="decreased_by">Decreased by</option>
                </select>
                
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={newRule.condition.value}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    condition: { ...newRule.condition, value: e.target.value }
                  })}
                  placeholder="Value"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <div className="flex space-x-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={newRule.action.type}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    action: { ...newRule.action, type: e.target.value }
                  })}
                >
                  <option value="notification">Send Notification</option>
                  <option value="adjust_price">Adjust Price</option>
                  <option value="update_stock">Update Stock</option>
                  <option value="change_status">Change Status</option>
                </select>
                
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={newRule.action.value}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    action: { ...newRule.action, value: e.target.value }
                  })}
                  placeholder="Value (e.g., email, percentage:10)"
                />
              </div>
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
            <p className="text-gray-500">No automation rules created yet.</p>
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
              
              <div className="flex items-center text-sm">
                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  {rule.condition.field === 'stock' && 'Stock Level'}
                  {rule.condition.field === 'cost' && 'Cost Price'}
                  {rule.condition.field === 'sales' && 'Sales Count'}
                  {rule.condition.field === 'margin' && 'Profit Margin'}
                </div>
                <div className="mx-2">
                  {rule.condition.operator === 'less_than' && 'is less than'}
                  {rule.condition.operator === 'greater_than' && 'is greater than'}
                  {rule.condition.operator === 'equals' && 'equals'}
                  {rule.condition.operator === 'increased_by' && 'increased by'}
                  {rule.condition.operator === 'decreased_by' && 'decreased by'}
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  {rule.condition.value}
                </div>
                <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                  {rule.action.type === 'notification' && 'Send Notification'}
                  {rule.action.type === 'adjust_price' && 'Adjust Price'}
                  {rule.action.type === 'update_stock' && 'Update Stock'}
                  {rule.action.type === 'change_status' && 'Change Status'}
                  {rule.action.value && `: ${rule.action.value}`}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AutomationRules;