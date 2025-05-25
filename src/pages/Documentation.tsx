import React from 'react';
import { FileText, Search, Book, Code, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Documentation: React.FC = () => {
  const categories = [
    {
      title: 'Démarrage rapide',
      icon: Book,
      articles: [
        { title: 'Introduction', link: '/docs/introduction' },
        { title: 'Installation', link: '/docs/installation' },
        { title: 'Configuration', link: '/docs/configuration' },
        { title: 'Premier pas', link: '/docs/first-steps' }
      ]
    },
    {
      title: 'Guides',
      icon: FileText,
      articles: [
        { title: 'Importer des produits', link: '/docs/importing-products' },
        { title: 'Gérer les commandes', link: '/docs/managing-orders' },
        { title: 'Optimisation SEO', link: '/docs/seo-optimization' },
        { title: 'Automatisation', link: '/docs/automation' }
      ]
    },
    {
      title: 'API Reference',
      icon: Code,
      articles: [
        { title: 'Authentication', link: '/docs/api/auth' },
        { title: 'Products', link: '/docs/api/products' },
        { title: 'Orders', link: '/docs/api/orders' },
        { title: 'Webhooks', link: '/docs/api/webhooks' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Documentation</h1>
          <p className="text-accent-200">
            Guides et documentation technique
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-400" />
        <input
          type="text"
          placeholder="Rechercher dans la documentation..."
          className="input w-full pl-10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                <category.icon className="h-5 w-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-medium text-white">{category.title}</h2>
            </div>
            <div className="space-y-2">
              {category.articles.map((article) => (
                <a
                  key={article.title}
                  href={article.link}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary-400 transition-colors"
                >
                  <span className="text-accent-200 hover:text-white">{article.title}</span>
                  <ExternalLink className="h-4 w-4 text-accent-400" />
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="card">
        <h2 className="text-lg font-medium text-white mb-4">Ressources populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/docs/getting-started"
            className="flex items-center space-x-3 p-4 rounded-lg bg-secondary-400 hover:bg-secondary-500 transition-colors"
          >
            <Book className="h-5 w-5 text-primary-400" />
            <div>
              <p className="font-medium text-white">Guide de démarrage</p>
              <p className="text-sm text-accent-200">Commencez avec Shopopti+</p>
            </div>
          </a>
          <a
            href="/docs/api"
            className="flex items-center space-x-3 p-4 rounded-lg bg-secondary-400 hover:bg-secondary-500 transition-colors"
          >
            <Code className="h-5 w-5 text-primary-400" />
            <div>
              <p className="font-medium text-white">Documentation API</p>
              <p className="text-sm text-accent-200">Référence technique</p>
            </div>
          </a>
          <a
            href="/docs/tutorials"
            className="flex items-center space-x-3 p-4 rounded-lg bg-secondary-400 hover:bg-secondary-500 transition-colors"
          >
            <FileText className="h-5 w-5 text-primary-400" />
            <div>
              <p className="font-medium text-white">Tutoriels</p>
              <p className="text-sm text-accent-200">Guides pas à pas</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Documentation;