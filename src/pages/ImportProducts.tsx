import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';
import { Tab } from '@headlessui/react';
import { 
  FileSpreadsheet, 
  FileJson, 
  FileCode, 
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Server,
  ShoppingBag,
  Store,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import CSVImporter from '../components/import/CSVImporter';
import JSONImporter from '../components/import/JSONImporter';
import XMLImporter from '../components/import/XMLImporter';
import ImageImporter from '../components/import/ImageImporter';
import URLImporter from '../components/import/URLImporter';
import FTPImporter from '../components/import/FTPImporter';
import MarketplaceImporter from '../components/import/MarketplaceImporter';

const importMethods = [
  {
    id: 'csv',
    name: 'CSV / Excel',
    icon: FileSpreadsheet,
    description: 'Importez des produits depuis un fichier CSV ou Excel',
    component: CSVImporter
  },
  {
    id: 'json',
    name: 'JSON',
    icon: FileJson,
    description: 'Importez des produits depuis un fichier JSON',
    component: JSONImporter
  },
  {
    id: 'xml',
    name: 'XML',
    icon: FileCode,
    description: 'Importez des produits depuis un fichier XML',
    component: XMLImporter
  },
  {
    id: 'image',
    name: 'Images en masse',
    icon: ImageIcon,
    description: 'Importez des produits à partir d\'images',
    component: ImageImporter
  },
  {
    id: 'url',
    name: 'URL / Liens',
    icon: LinkIcon,
    description: 'Importez des produits depuis des URLs',
    component: URLImporter
  },
  {
    id: 'ftp',
    name: 'FTP / SFTP',
    icon: Server,
    description: 'Importez des produits via FTP/SFTP',
    component: FTPImporter
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    icon: ShoppingBag,
    description: 'Importez des produits depuis AliExpress',
    component: MarketplaceImporter
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: Store,
    description: 'Importez des produits depuis Amazon',
    component: MarketplaceImporter
  }
];

const ImportProducts: React.FC = () => {
  const { isConnected } = useShop();
  const [selectedMethod, setSelectedMethod] = useState(importMethods[0]);

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-primary-400 bg-opacity-10 p-3">
          <Upload size={28} className="text-primary-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-white">Aucune boutique connectée</h2>
        <p className="mt-1 text-accent-200">Connectez votre boutique pour importer des produits</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white md:text-3xl">Importer des produits</h1>
        <p className="mt-2 text-accent-200">
          Importez des produits depuis différentes sources vers votre boutique
        </p>
      </motion.div>

      <div className="card">
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-lg bg-secondary-400 p-1">
            {importMethods.map((method) => (
              <Tab
                key={method.id}
                className={({ selected }) =>
                  `flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${selected 
                    ? 'bg-primary-400 text-white' 
                    : 'text-accent-200 hover:bg-secondary-600 hover:text-white'
                  }`
                }
                onClick={() => setSelectedMethod(method)}
              >
                <method.icon size={16} />
                <span>{method.name}</span>
              </Tab>
            ))}
          </Tab.List>

          <div className="mt-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white">{selectedMethod.name}</h2>
              <p className="mt-1 text-accent-200">{selectedMethod.description}</p>
            </div>

            <Tab.Panels>
              {importMethods.map((method) => (
                <Tab.Panel key={method.id}>
                  <method.component marketplace={method.id} />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </div>
        </Tab.Group>

        <div className="mt-8 rounded-lg bg-primary-400 bg-opacity-10 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-primary-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary-400">Conseils d'importation</h3>
              <div className="mt-2 text-sm text-primary-400">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Assurez-vous que vos données sont bien formatées</li>
                  <li>Vérifiez que les images sont de haute qualité</li>
                  <li>Incluez des descriptions détaillées pour un meilleur SEO</li>
                  <li>Ajoutez des variantes si nécessaire</li>
                </ul>
              </div>
              <div className="mt-3">
                <a
                  href="/guides/import"
                  className="inline-flex items-center text-sm font-medium text-primary-400 hover:text-primary-500"
                >
                  Voir le guide complet
                  <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProducts;