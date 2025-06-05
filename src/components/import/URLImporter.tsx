import React, { useState } from 'react';
import { Link as LinkIcon, AlertCircle, ArrowRight, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { importService } from '../../services/importService';
import { scrapingService } from '../../services/scrapingService';

interface URLImporterProps {
  marketplace?: string;
}

const URLImporter: React.FC<URLImporterProps> = ({ marketplace }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any | null>(null);

  const handleImport = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      let product;
      
      switch (marketplace) {
        case 'amazon':
          product = await importService.importFromAmazon(url);
          break;
        case 'aliexpress':
          product = await scrapingService.scrapeAliExpress(url);
          break;
        case 'temu':
          product = await scrapingService.scrapeTemu(url);
          break;
        case 'shein':
          product = await scrapingService.scrapeShein(url);
          break;
        default:
          product = await scrapingService.scrapeByUrl(url);
      }

      setPreview(product);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'importation du produit');
    } finally {
      setLoading(false);
    }
  };

  // Determine which content to show
  const renderContent = () => {
    if (error) {
      return (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-md bg-error-400/10 p-4"
        >
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-error-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error-400">
                Erreur d'importation
              </h3>
              <div className="mt-1 text-sm text-error-400/90 whitespace-pre-line">
                {error}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (preview) {
      return (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="card">
            <h4 className="text-lg font-medium text-white mb-4">Aperçu du produit</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {preview.images && preview.images.length > 0 && (
                  <>
                    <img 
                      src={preview.images[0]} 
                      alt={preview.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {preview.images.slice(1, 5).map((img: string, i: number) => (
                        <img 
                          key={`thumbnail-${i}`}
                          src={img}
                          alt={`${preview.title} ${i + 2}`}
                          className="w-full h-12 object-cover rounded"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm text-accent-200">Titre</h5>
                  <p className="text-white">{preview.title}</p>
                </div>

                <div>
                  <h5 className="text-sm text-accent-200">Prix</h5>
                  <p className="text-white">${preview.price}</p>
                </div>

                {preview.variants && preview.variants.length > 0 && (
                  <div>
                    <h5 className="text-sm text-accent-200">Variantes</h5>
                    <p className="text-white">{preview.variants.length} variantes disponibles</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 pt-6 border-t border-accent-200/10">
              <button className="btn btn-outline w-full sm:w-auto">
                Optimiser avec l'IA
              </button>
              <button className="btn btn-primary w-full sm:w-auto">
                Importer vers Shopify
              </button>
            </div>
          </div>

          {preview.reviews && preview.reviews.length > 0 && (
            <div className="card">
              <h4 className="text-lg font-medium text-white mb-4">
                Avis ({preview.reviews.length})
              </h4>
              <div className="space-y-4">
                {preview.reviews.slice(0, 3).map((review: any, i: number) => (
                  <div 
                    key={`review-${i}`}
                    className="border-b border-accent-200/10 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={`star-${i}-${starIndex}`}
                              className={`h-4 w-4 ${
                                starIndex < review.rating 
                                  ? 'text-warning-400 fill-warning-400' 
                                  : 'text-accent-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-accent-200">
                          {review.author}
                        </span>
                      </div>
                      <span className="text-xs text-accent-200">
                        {review.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline w-full mt-4">
                Importer tous les avis
              </button>
            </div>
          )}
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
            <LinkIcon className="h-4 w-4 text-primary-400" />
          </div>
          <h3 className="text-lg font-medium text-white">
            {marketplace ? `Entrez l'URL ${marketplace}` : 'Entrez l\'URL du produit'}
          </h3>
        </div>

        <div className="space-y-4">
          <input
            type="url"
            className="input w-full"
            placeholder={marketplace ? `https://${marketplace}.com/...` : "https://..."}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            className="btn btn-primary w-full"
            onClick={handleImport}
            disabled={loading || !url}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Importation...
              </>
            ) : (
              <>
                Importer le produit
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

export default URLImporter;