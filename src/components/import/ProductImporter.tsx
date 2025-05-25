import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { importService, ProductData } from '../../services/importService';

const ProductImporter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [aliExpressUrl, setAliExpressUrl] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleCSVImport(acceptedFiles[0]);
      }
    }
  });

  const handleCSVImport = async (file: File) => {
    try {
      setIsLoading(true);
      const products = await importService.importFromCSV(file);
      await importService.saveProducts(products);
      toast.success(`Successfully imported ${products.length} products`);
    } catch (error) {
      toast.error('Failed to import products from CSV');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAliExpressImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliExpressUrl) return;

    try {
      setIsLoading(true);
      const product = await importService.importFromAliExpress(aliExpressUrl);
      await importService.saveProducts([product]);
      toast.success('Successfully imported product from AliExpress');
      setAliExpressUrl('');
    } catch (error) {
      toast.error('Failed to import product from AliExpress');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* AliExpress Import */}
        <div className="card">
          <h3 className="text-lg font-medium text-neutral-900">Import from AliExpress</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Paste an AliExpress product URL to import details automatically
          </p>
          
          <form onSubmit={handleAliExpressImport} className="mt-4">
            <input
              type="url"
              value={aliExpressUrl}
              onChange={(e) => setAliExpressUrl(e.target.value)}
              placeholder="https://aliexpress.com/item/..."
              className="input w-full"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary mt-3 w-full"
            >
              {isLoading ? 'Importing...' : 'Import Product'}
            </button>
          </form>
        </div>

        {/* CSV Import */}
        <div className="card">
          <h3 className="text-lg font-medium text-neutral-900">Import from CSV</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Upload a CSV file with your product data
          </p>

          <div
            {...getRootProps()}
            className="mt-4 border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-neutral-400" />
            <p className="mt-2 text-sm font-medium text-neutral-900">
              Drag & drop your CSV file here
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              or click to select a file
            </p>
          </div>
        </div>
      </div>

      {/* Import Guidelines */}
      <div className="rounded-lg bg-neutral-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-neutral-800">
              Import Guidelines
            </h3>
            <div className="mt-2 text-sm text-neutral-600">
              <ul className="list-disc space-y-1 pl-5">
                <li>CSV files should include columns: title, description, price, images, sku, stock, category</li>
                <li>Multiple images should be comma-separated</li>
                <li>Prices should be in your store's currency</li>
                <li>Stock quantities should be whole numbers</li>
              </ul>
            </div>
            <div className="mt-3">
              <a
                href="#"
                className="text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                Download sample CSV template
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImporter;