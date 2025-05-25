import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, FileJson } from 'lucide-react';

interface JSONImporterProps {
  marketplace?: string;
}

const JSONImporter: React.FC<JSONImporterProps> = () => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      setPreview(json);
    } catch (err) {
      setError('Format JSON invalide');
    } finally {
      setImporting(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-primary-400 bg-primary-400/5' 
            : 'border-accent-200 hover:border-primary-400 hover:bg-primary-400/5'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-primary-400 bg-opacity-10 p-3 mb-4">
            <Upload className="h-6 w-6 text-primary-400" />
          </div>
          <h3 className="text-lg font-medium text-white">
            {isDragActive 
              ? 'Déposez le fichier ici...'
              : 'Déposez votre fichier JSON ici'
            }
          </h3>
          <p className="mt-1 text-accent-200">ou cliquez pour sélectionner un fichier</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-error-400/10 p-4">
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
        </div>
      )}

      {preview && (
        <div className="rounded-md bg-secondary-400 p-4">
          <h4 className="font-medium text-white mb-4">Aperçu des données</h4>
          <pre className="overflow-x-auto p-4 rounded bg-secondary-600 text-accent-200">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}

      <div className="rounded-md bg-secondary-600 p-4">
        <div className="flex">
          <FileJson className="h-5 w-5 text-accent-200" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-white">Format requis</h3>
            <div className="mt-2 text-sm text-accent-200">
              <p>Le fichier JSON doit suivre cette structure :</p>
              <pre className="mt-2 p-3 rounded bg-secondary-500 text-xs">
{`{
  "products": [
    {
      "title": "string",
      "description": "string",
      "price": number,
      "sku": "string",
      "stock": number,
      "images": ["string"],
      "category": "string",
      "variants": [
        {
          "title": "string",
          "price": number,
          "sku": "string",
          "stock": number
        }
      ]
    }
  ]
}`}
              </pre>
            </div>
            <div className="mt-3">
              <a
                href="#"
                className="text-sm font-medium text-primary-400 hover:text-primary-500"
              >
                Télécharger le modèle JSON
              </a>
            </div>
          </div>
        </div>
      </div>

      {preview && (
        <button
          className="w-full btn btn-primary"
          onClick={() => {
            // Handle import
            console.log('Importing data...');
          }}
        >
          Importer les produits
        </button>
      )}
    </div>
  );
};

export default JSONImporter;