import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertCircle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageImporterProps {
  marketplace?: string;
}

const ImageImporter: React.FC<ImageImporterProps> = () => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string; name: string }[]>([]);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setImporting(true);
    setError(null);
    setProgress(0);

    try {
      const newPreviews = acceptedFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name
      }));

      // Simulate processing time for each image
      for (let i = 0; i < acceptedFiles.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(((i + 1) / acceptedFiles.length) * 100);
      }

      setPreview(prev => [...prev, ...newPreviews]);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des images');
    } finally {
      setImporting(false);
      setProgress(0);
    }
  }, []);

  const removeImage = (index: number) => {
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    multiple: true,
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
                <ImageIcon className="h-6 w-6 text-primary-400" />
              </motion.div>
            )}
          </AnimatePresence>
          <h3 className="text-lg font-medium text-white">
            {importing 
              ? 'Chargement des images...'
              : isDragActive 
                ? 'Déposez les images ici...'
                : 'Déposez vos images ici'
            }
          </h3>
          <p className="mt-1 text-accent-200">
            {importing 
              ? `${Math.round(progress)}% traités`
              : 'ou cliquez pour sélectionner des fichiers'
            }
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
                  Erreur de chargement
                </h3>
                <p className="mt-1 text-sm text-error-400/90">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-white">Aperçu des images</h4>
              <button
                onClick={() => setPreview([])}
                className="text-sm text-accent-200 hover:text-white"
              >
                Tout supprimer
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {preview.map((image, index) => (
                <motion.div
                  key={image.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-secondary-400"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="p-2 bg-error-400 rounded-full text-white hover:bg-error-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <p className="text-xs text-white truncate">{image.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-md bg-secondary-600 p-4">
        <div className="flex">
          <ImageIcon className="h-5 w-5 text-accent-200" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-white">Formats acceptés</h3>
            <div className="mt-2 text-sm text-accent-200">
              <ul className="list-disc list-inside space-y-1">
                <li>JPG/JPEG</li>
                <li>PNG</li>
                <li>WebP</li>
              </ul>
              <p className="mt-2">
                Taille maximale recommandée : 2000x2000px, 5MB par image
              </p>
            </div>
          </div>
        </div>
      </div>

      {preview.length > 0 && (
        <button
          className="w-full btn btn-primary"
          onClick={() => {
            // Handle image processing
            console.log('Processing images...');
          }}
        >
          Traiter {preview.length} image{preview.length > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
};

export default ImageImporter;