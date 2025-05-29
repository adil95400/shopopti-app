import React, { useState } from 'react';
import { Upload, FileSpreadsheet, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';

interface BulkImporterProps {
  onImport: (files: File[], options: ImportOptions) => Promise<void>;
}

interface ImportOptions {
  updateExisting: boolean;
  importImages: boolean;
  autoOptimize: boolean;
  applyPricingRules: boolean;
}

const BulkImporter: React.FC<BulkImporterProps> = ({ onImport }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<ImportOptions>({
    updateExisting: true,
    importImages: true,
    autoOptimize: true,
    applyPricingRules: true
  });
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });
  
  const handleImport = async () => {
    if (files.length === 0) return;
    
    try {
      setImporting(true);
      setProgress(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);
      
      await onImport(files, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Reset after successful import
      setTimeout(() => {
        setFiles([]);
        setProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center ${
        isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
      }`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {files.length > 0 ? (
            <>
              <FileText className="h-12 w-12 text-blue-500 mb-4" />
              <p className="text-lg font-medium">{files[0].name}</p>
              <p className="text-sm text-gray-500 mt-1">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to select a file
              </p>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Import Options</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Update Existing Products</label>
              <p className="text-sm text-gray-500">Update products if they already exist</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-update"
                checked={options.updateExisting}
                onChange={(e) => setOptions({ ...options, updateExisting: e.target.checked })}
                className="sr-only"
              />
              <label
                htmlFor="toggle-update"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${options.updateExisting ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${options.updateExisting ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Import Images</label>
              <p className="text-sm text-gray-500">Download and import product images</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-images"
                checked={options.importImages}
                onChange={(e) => setOptions({ ...options, importImages: e.target.checked })}
                className="sr-only"
              />
              <label
                htmlFor="toggle-images"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${options.importImages ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${options.importImages ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Auto-Optimize with AI</label>
              <p className="text-sm text-gray-500">Optimize titles and descriptions with AI</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-optimize"
                checked={options.autoOptimize}
                onChange={(e) => setOptions({ ...options, autoOptimize: e.target.checked })}
                className="sr-only"
              />
              <label
                htmlFor="toggle-optimize"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${options.autoOptimize ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${options.autoOptimize ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Apply Pricing Rules</label>
              <p className="text-sm text-gray-500">Apply your pricing rules to imported products</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-pricing"
                checked={options.applyPricingRules}
                onChange={(e) => setOptions({ ...options, applyPricingRules: e.target.checked })}
                className="sr-only"
              />
              <label
                htmlFor="toggle-pricing"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${options.applyPricingRules ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${options.applyPricingRules ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-start">
          <FileSpreadsheet className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-gray-700">File Format Requirements</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your file should include the following columns:
            </p>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>title (required)</li>
              <li>description</li>
              <li>price (required)</li>
              <li>cost_price</li>
              <li>sku</li>
              <li>barcode</li>
              <li>stock</li>
              <li>weight</li>
              <li>images (comma-separated URLs)</li>
              <li>category</li>
              <li>tags (comma-separated)</li>
              <li>variants (JSON format)</li>
            </ul>
            <div className="mt-3">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download sample template
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {importing && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Importing...</h3>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={handleImport} 
          disabled={files.length === 0 || importing}
          className="px-6"
        >
          {importing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            'Import Products'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BulkImporter;