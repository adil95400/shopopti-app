import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { importService } from '../../services/importService';

interface CSVImporterProps {
  marketplace?: string;
}

const CSVImporter: React.FC<CSVImporterProps> = () => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setProgress(0);

    try {
      await importService.importFromCSV(file);
      // Le progrès est géré par le service d'import
    } catch (err) {
      setError('Une erreur est survenue lors de l\'importation');
    } finally {
      setImporting(false);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    maxSize: 200 * 1024 * 1024, // 200MB
    multiple: false,
    disabled: importing
  });

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-primary-400 bg-primary-400/5' 
            : importing 
              ? 'border-accent-200 opacity-50 cursor-not-allowed' 
              : 'border-accent-200 hover:border-primary-400 hover:bg-primary-400/5'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {importing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="rounded-full bg-primary-400 bg-opacity-10 p-3 mb-4"
              >
                <Loader2 className="h-6 w-6 text-primary-400 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="rounded-full bg-primary-400 bg-opacity-10 p-3 mb-4"
              >
                <FileSpreadsheet className="h-6 w-6 text-primary-400" />
              </motion.div>
            )}
          </AnimatePresence>
          <h3 className="text-lg font-medium text-white">
            {importing 
              ? 'Importation en cours...'
              : isDragActive 
                ? 'Déposez le fichier ici...'
                : 'Déposez votre fichier CSV ou Excel ici'
            }
          </h3>
          <p className="mt-1 text-accent-200">
            {importing 
              ? `${Math.round(progress)}% traités`
              : 'ou cliquez pour sélectionner un fichier'
            }
          </p>
          <p className="mt-2 text-xs text-accent-200">
            Taille maximale : 200MB
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-md bg-error-400/10 p-4"
          >
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-error-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error-400">
                  Erreur d'importation
                </h3>
                <p className="mt-1 text-sm text-error-400/90">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-md bg-secondary-600 p-4">
        <div className="flex">
          <FileSpreadsheet className="h-5 w-5 text-accent-200" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-white">Format requis</h3>
            <div className="mt-2 text-sm text-accent-200">
              <p>Le fichier doit contenir les colonnes suivantes :</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>title (obligatoire)</li>
                <li>description</li>
                <li>price (obligatoire)</li>
                <li>sku</li>
                <li>stock</li>
                <li>images (URLs séparées par des virgules)</li>
                <li>category</li>
                <li>variants (JSON)</li>
              </ul>
            </div>
            <div className="mt-3">
              <a
                href="#"
                className="text-sm font-medium text-primary-400 hover:text-primary-500"
              >
                Télécharger le modèle
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;