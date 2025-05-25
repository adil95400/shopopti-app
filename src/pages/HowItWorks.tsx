import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ShoppingBag, 
  Zap, 
  TrendingUp, 
  Truck, 
  Bot,
  ArrowRight
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Trouvez des produits",
      description: "Parcourez des millions de produits de fournisseurs vérifiés ou importez vos propres produits.",
      color: "text-primary-400",
      bgColor: "bg-primary-400/10"
    },
    {
      icon: Bot,
      title: "2. Optimisez avec l'IA",
      description: "Notre IA optimise automatiquement vos titres, descriptions et prix pour maximiser vos ventes.",
      color: "text-success-400",
      bgColor: "bg-success-400/10"
    },
    {
      icon: ShoppingBag,
      title: "3. Publiez sur votre boutique",
      description: "Publiez vos produits sur Shopify, WooCommerce ou d'autres plateformes en un clic.",
      color: "text-warning-400",
      bgColor: "bg-warning-400/10"
    },
    {
      icon: Truck,
      title: "4. Gérez les commandes",
      description: "Les commandes sont automatiquement transmises aux fournisseurs pour expédition.",
      color: "text-primary-400",
      bgColor: "bg-primary-400/10"
    }
  ];

  const features = [
    {
      title: "Automatisation IA",
      description: "Optimisation automatique des produits, des prix et du stock",
      icon: Zap
    },
    {
      title: "Analyse de marché",
      description: "Insights en temps réel et découverte de produits tendance",
      icon: TrendingUp
    },
    {
      title: "Multi-canal",
      description: "Vendez sur plusieurs plateformes depuis une seule interface",
      icon: ShoppingBag
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Comment fonctionne Shopopti+ ?
          </h1>
          <p className="text-xl text-accent-200 max-w-3xl mx-auto">
            Une solution complète pour lancer et développer votre activité e-commerce
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card relative"
            >
              <div className={`rounded-lg ${step.bgColor} p-4 mb-4 inline-block`}>
                <step.icon className={`h-6 w-6 ${step.color}`} />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">{step.title}</h3>
              <p className="text-accent-200">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gradient-to-br from-primary-400/20 to-primary-500/20 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-accent-200">
              Des outils puissants pour développer votre business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center">
                <div className="rounded-full bg-primary-400 bg-opacity-10 p-4 inline-block mb-4">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-accent-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-accent-200 mb-8">
            Rejoignez des milliers d'entrepreneurs qui utilisent Shopopti+
          </p>
          <button className="btn btn-primary">
            Commencer gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;