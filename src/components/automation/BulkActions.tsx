import React, { useState } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: string, value?: any) => Promise<void>;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  
  const handleAction = async (action: string, value?: any) => {
    try {
      setLoading(true);
      setCurrentAction(action);
      await onAction(action, value);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    } finally {
      setLoading(false);
      setCurrentAction(null);
      setIsOpen(false);
    }
  };
  
  if (selectedCount === 0) {
    return null;
  }
  
  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{selectedCount} items selected</span>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center"
          >
            Bulk Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => handleAction('update_price', { type: 'increase', value: 10 })}
                  disabled={loading}
                >
                  {loading && currentAction === 'update_price' ? (
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Increase Price by 10%'
                  )}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => handleAction('update_status', 'active')}
                  disabled={loading}
                >
                  {loading && currentAction === 'update_status' ? (
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Set Status to Active'
                  )}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => handleAction('publish_to_channel', 'shopify')}
                  disabled={loading}
                >
                  {loading && currentAction === 'publish_to_channel' ? (
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Publish to Shopify'
                  )}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => handleAction('optimize_with_ai')}
                  disabled={loading}
                >
                  {loading && currentAction === 'optimize_with_ai' ? (
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Optimize with AI'
                  )}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => handleAction('delete')}
                  disabled={loading}
                >
                  {loading && currentAction === 'delete' ? (
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Delete Selected'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActions;