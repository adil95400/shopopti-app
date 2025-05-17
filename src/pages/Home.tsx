import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Bot } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-card">
        <h1 className="text-xl font-bold">Shopopti+</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-1 rounded hover:bg-muted"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-transparent border px-2 py-1 rounded text-sm"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
          <Link to="/login">
            <Button>{t('login', 'Connexion')}</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-primary to-primary-foreground">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="text-4xl md:text-6xl font-extrabold text-white"
        >
          {t('hero.title', 'La plateforme e-commerce IA la plus complète.')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 text-white text-lg max-w-xl"
        >
          {t('hero.subtitle', 'Import. SEO. Reviews. IA. Tout-en-un pour réussir dans le e-commerce.')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link to="/register">
            <Button size="lg">{t('cta.start', 'Essayer gratuitement')}</Button>
          </Link>
          <Link to="/demo">
            <Button variant="outline" size="lg">{t('cta.demo', 'Voir la démo')}</Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background text-center">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h3 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold mb-8"
          >
            {t('features.title', 'Fonctionnalités clés')}
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-lg shadow bg-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-2">{t(`features.${i}.title`, `Fonction ${i + 1}`)}</h4>
                <p className="text-sm text-muted-foreground">{t(`features.${i}.desc`, 'Description fonction...')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assistant AI Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          to="/assistant"
          className="bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-primary-foreground transition"
        >
          <Bot size={18} /> <span>{t('assistant_ai', 'Assistant IA')}</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
