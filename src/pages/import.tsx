import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import CSVImporter from '../components/import/CSVImporter';
import { Button } from '../components/ui/button';

interface DraftProduct {
  id: number;
  image: string;
  name: string;
  shop: string;
  supplier: string;
  variants: number;
  status: 'pending' | 'importing' | 'imported';
  progress: number;
}

const ImportPage: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [drafts, setDrafts] = useState<DraftProduct[]>([
    {
      id: 1,
      image: 'https://via.placeholder.com/40',
      name: 'Sample product',
      shop: 'MyShopify',
      supplier: 'AliExpress',
      variants: 2,
      status: 'pending',
      progress: 0
    }
  ]);

  const startImport = (id: number) => {
    setDrafts(prev =>
      prev.map(d =>
        d.id === id ? { ...d, status: 'importing', progress: 0 } : d
      )
    );
    // Simulate progress
    setTimeout(() => {
      setDrafts(prev =>
        prev.map(d =>
          d.id === id ? { ...d, progress: 100, status: 'imported' } : d
        )
      );
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Import Products</h1>
        <div className="relative">
          <Button onClick={() => setShowMenu(!showMenu)}>
            Add products
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg z-10">
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                Single product
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                Multiple products
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                Winning products
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                Shopopti+ Finder
              </button>
            </div>
          )}
        </div>
      </div>

      <CSVImporter />

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {drafts.map(draft => (
              <tr key={draft.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={draft.image} alt={draft.name} className="h-10 w-10 rounded object-cover" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{draft.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.shop}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.supplier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.variants}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {draft.status === 'importing' && (
                    <div className="mb-2 h-2 w-32 rounded bg-gray-200">
                      <div
                        className="h-2 rounded bg-primary"
                        style={{ width: `${draft.progress}%` }}
                      />
                    </div>
                  )}
                  <Button
                    size="sm"
                    disabled={draft.status !== 'pending'}
                    onClick={() => startImport(draft.id)}
                  >
                    {draft.status === 'imported' ? 'Imported' : 'Import'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImportPage;
