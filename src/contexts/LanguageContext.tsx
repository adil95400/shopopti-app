// ✅ LanguageContext optimisé avec i18n et détection navigateur
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import i18n from '@/i18n';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('shopopti-lang') || 'fr');

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('shopopti-lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};