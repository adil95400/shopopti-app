import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

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
    const fetchSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase
        .from('user_settings')
        .select('language')
        .eq('user_id', session.user.id)
        .single();
      if (data?.language) {
        const language = availableLanguages.find(l => l.code === data.language);
        if (language) {
          i18n.changeLanguage(language.code);
          setCurrentLanguage(language);
        }
      }
    };

    fetchSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_ev, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('user_settings')
          .select('language')
          .eq('user_id', session.user.id)
          .single();
        if (data?.language) {
          const language = availableLanguages.find(l => l.code === data.language);
          if (language) {
            i18n.changeLanguage(language.code);
            setCurrentLanguage(language);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Mettre à jour la langue actuelle lorsque i18n.language change
    const language = availableLanguages.find(lang => lang.code === i18n.language);
    if (language) {
      setCurrentLanguage(language);
    }
  }, [i18n.language]);

  const setLanguage = async (code: string) => {
    const language = availableLanguages.find(lang => lang.code === code);
    if (language) {
      i18n.changeLanguage(code);
      setCurrentLanguage(language);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('user_settings')
          .upsert({ user_id: session.user.id, language: code }, { onConflict: 'user_id' });
      }
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