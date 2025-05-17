import React from 'react';
import { Globe, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage, availableLanguages } from '../contexts/LanguageContext';

const Language: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Langue</h1>
          <p className="text-accent-200">
            Choisissez la langue de l'interface
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-6"
      >
        <div className="card">
          <h2 className="text-lg font-medium text-white mb-4">Langues disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => setLanguage(language.code)}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors
                  ${language.code === currentLanguage.code
                    ? 'border-primary-400 bg-primary-400/10'
                    : 'border-accent-200/10 hover:border-accent-200/20'}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <span className="font-medium text-white">{language.name}</span>
                </div>
                {language.code === currentLanguage.code && (
                  <Check className="h-5 w-5 text-primary-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-secondary-600 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Globe className="h-5 w-5 text-accent-200" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-white">À propos de la traduction</h3>
              <div className="mt-2 text-sm text-accent-200">
                <p>
                  L'interface est disponible en plusieurs langues. La traduction est assurée par notre équipe
                  et la communauté. Si vous souhaitez contribuer à la traduction, contactez-nous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Language;