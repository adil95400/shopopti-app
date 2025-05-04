import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Globe, 
  Zap, 
  TrendingUp, 
  Search,
  ArrowRight,
  CheckCircle,
  Store,
  ChevronDown,
  ShoppingCart,
  Bot,
  BarChart3
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-400">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Plus De 500 000 Vendeurs
              <span className="block text-primary-400">Font Confiance À Shopopti+</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-accent-200">
              Lancez et développez votre entreprise e-commerce avec notre plateforme tout-en-un de dropshipping. 
              Accédez à des millions de produits, automatisez vos opérations et augmentez vos ventes avec l'optimisation IA.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/register" className="btn btn-primary">
                Commencer - C'est GRATUIT
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <a href="#features" className="btn btn-outline">
                En savoir plus
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { value: '100M+', label: 'Produits disponibles' },
              { value: '500K+', label: 'Vendeurs actifs' },
              { value: '50M+', label: 'Commandes traitées' },
              { value: '100+', label: 'Pays desservis' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-primary-400">{stat.value}</p>
                <p className="mt-2 text-accent-200">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-secondary-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Tout Ce Dont Vous Avez Besoin Pour Réussir
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-200">
              Des outils puissants et des fonctionnalités pour vous aider à construire une entreprise de dropshipping rentable
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Globe,
                title: 'Fournisseurs Mondiaux',
                description: 'Connectez-vous avec des fournisseurs vérifiés dans le monde entier et importez des produits directement dans votre boutique.'
              },
              {
                icon: Bot,
                title: 'Automatisation IA',
                description: 'Automatisez l\'optimisation des produits, la tarification et la gestion des stocks avec l\'IA.'
              },
              {
                icon: BarChart3,
                title: 'Analyse de Marché',
                description: 'Obtenez des insights en temps réel et découvrez les produits tendance dans votre niche.'
              },
              {
                icon: Search,
                title: 'Recherche de Produits',
                description: 'Trouvez des produits gagnants avec nos outils de recherche avancés.'
              },
              {
                icon: Store,
                title: 'Multi-Canal',
                description: 'Vendez sur plusieurs canaux et marketplaces depuis une seule plateforme.'
              },
              {
                icon: ShoppingCart,
                title: 'Gestion des Commandes',
                description: 'Rationalisez vos processus de traitement et d\'expédition des commandes.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <div className="rounded-lg bg-primary-400 bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-accent-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-secondary-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Intégrez-Vous À Votre Magasin
            </h2>
            <p className="mt-4 text-accent-200">
              Shopopti+ s'intègre à toutes vos plateformes de commerce électronique préférées
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Shopify', 'WooCommerce', 'Wix', 'BigCommerce'].map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-6 rounded-lg bg-secondary-500 border border-accent-200/10"
              >
                <img 
                  src={`/images/${platform.toLowerCase()}.svg`} 
                  alt={platform}
                  className="h-12 w-12 mb-4"
                />
                <h3 className="text-white font-medium">{platform}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary-400 to-primary-500 px-6 py-16 sm:px-12 sm:py-20 lg:flex lg:items-center lg:justify-between lg:px-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Prêt à commencer votre voyage ?
                <span className="block text-white/90">Rejoignez des milliers d'entrepreneurs qui réussissent</span>
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  'Pas de carte de crédit requise',
                  'Essai gratuit de 14 jours',
                  'Annulez à tout moment'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="ml-2 text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <Link
                to="/register"
                className="btn bg-white text-primary-500 hover:bg-white/90"
              >
                Commencer Gratuitement
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;