import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { 
  Save, 
  Plus, 
  Trash2, 
  Loader2,
  ArrowRight,
  ArrowDown
} from 'lucide-react';

interface DataMappingConfigProps {
  onSaveMapping: (mapping: DataMapping[]) => Promise<void>;
}

export interface DataMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
  defaultValue?: string;
}

const DataMappingConfig: React.FC<DataMappingConfigProps> = ({ onSaveMapping }) => {
  const [loading, setLoading] = useState(false);
  const [mappings, setMappings] = useState<DataMapping[]>([
    {
      id: '1',
      sourceField: 'title',
      targetField: 'title',
      required: true
    },
    {
      id: '2',
      sourceField: 'description',
      targetField: 'description',
      required: true
    },
    {
      id: '3',
      sourceField: 'price',
      targetField: 'price',
      required: true
    },
    {
      id: '4',
      sourceField: 'images',
      targetField: 'images',
      required: true
    },
    {
      id: '5',
      sourceField: 'variants',
      targetField: 'variants',
      required: false
    }
  ]);

  const handleAddMapping = () => {
    const newMapping: DataMapping = {
      id: Date.now().toString(),
      sourceField: '',
      targetField: '',
      required: false
    };
    
    setMappings([...mappings, newMapping]);
  };

  const handleRemoveMapping = (id: string) => {
    setMappings(mappings.filter(mapping => mapping.id !== id));
  };

  const handleFieldChange = (id: string, field: keyof DataMapping, value: string | boolean) => {
    setMappings(mappings.map(mapping => 
      mapping.id === id ? { ...mapping, [field]: value } : mapping
    ));
  };

  const handleSave = async () => {
    // Validate mappings
    const invalidMappings = mappings.filter(mapping => 
      mapping.required && (!mapping.sourceField || !mapping.targetField)
    );
    
    if (invalidMappings.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      await onSaveMapping(mappings);
      toast.success('Data mappings saved successfully');
    } catch (error: any) {
      toast.error(`Failed to save mappings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Data Field Mapping</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleAddMapping}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Mapping
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Mappings'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm text-gray-500">
            <div className="col-span-4">Source Field</div>
            <div className="col-span-1 flex justify-center items-center">
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="col-span-4">Target Field</div>
            <div className="col-span-2">Options</div>
            <div className="col-span-1">Actions</div>
          </div>
          
          {mappings.map((mapping) => (
            <div key={mapping.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4">
                <input
                  type="text"
                  value={mapping.sourceField}
                  onChange={(e) => handleFieldChange(mapping.id, 'sourceField', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Source field name"
                />
              </div>
              
              <div className="col-span-1 flex justify-center">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="col-span-4">
                <input
                  type="text"
                  value={mapping.targetField}
                  onChange={(e) => handleFieldChange(mapping.id, 'targetField', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Target field name"
                />
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required-${mapping.id}`}
                    checked={mapping.required}
                    onChange={(e) => handleFieldChange(mapping.id, 'required', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`required-${mapping.id}`} className="ml-2 block text-sm text-gray-700">
                    Required
                  </label>
                </div>
              </div>
              
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => handleRemoveMapping(mapping.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              {mapping.transformation && (
                <div className="col-span-12 pl-4 border-l-2 border-gray-200 ml-4">
                  <div className="flex items-center mb-2">
                    <ArrowDown className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Transformation</span>
                  </div>
                  <textarea
                    value={mapping.transformation}
                    onChange={(e) => handleFieldChange(mapping.id, 'transformation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="JavaScript transformation function"
                    rows={3}
                  />
                </div>
              )}
            </div>
          ))}
          
          {mappings.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-2">No mappings defined</h4>
              <p className="text-gray-500 mb-4">
                Define how data should be mapped between platforms.
              </p>
              <Button onClick={handleAddMapping}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Mapping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataMappingConfig;