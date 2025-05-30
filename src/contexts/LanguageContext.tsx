import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const availableLanguages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];

type LanguageContextType = {
  currentLanguage: typeof availableLanguages[0];
  setLanguage: (code: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    availableLanguages.find(lang => lang.code === i18n.language) || availableLanguages[0]
  );

  useEffect(() => {
    // Mettre à jour la langue actuelle lorsque i18n.language change
    const language = availableLanguages.find(lang => lang.code === i18n.language);
    if (language) {
      setCurrentLanguage(language);
    }
  }, [i18n.language]);

  const setLanguage = (code: string) => {
    const language = availableLanguages.find(lang => lang.code === code);
    if (language) {
      i18n.changeLanguage(code);
      setCurrentLanguage(language);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};