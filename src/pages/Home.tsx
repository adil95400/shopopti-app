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
  Shield,
  Users,
  Star,
  Layers,
  Settings
} from 'lucide-react';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <MainNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Créez votre boutique e-commerce en <span className="text-primary">2 minutes</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Bénéficiez d'une boutique IA gratuite et prête à vendre. Trouvez les produits les plus vendus. Achetez au meilleur prix. Livraison ultra-rapide. Profitez d'une expérience e-commerce IA tout-en-un.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-600 transition-colors">
                  Commencer gratuitement
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <a href="#features" className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-base font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors">
                  En savoir plus
                </a>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Essai gratuit de 14 jours • Aucune carte de crédit requise</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Dashboard Shopopti+" 
                  className="w-full h-auto"
                />
                <div className="absolute top-0 right-0 bg-white rounded-bl-lg px-3 py-1 shadow-md">
                  <div className="flex items-center">
                    <span className="text-green-500 font-semibold">$1,060</span>
                    <span className="ml-1 text-xs text-green-500">+25%</span>
                  </div>
                  <p className="text-xs text-gray-500">Ventes aujourd'hui</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">98 commandes</p>
                    <p className="text-xs text-gray-500">Aujourd'hui</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-6">UTILISÉ PAR DES MILLIERS D'ENTREPRISES</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png" alt="Shopify" className="h-6 object-contain grayscale opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" alt="Amazon" className="h-6 object-contain grayscale opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png" alt="eBay" className="h-6 object-contain grayscale opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png" alt="Etsy" className="h-6 object-contain grayscale opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png" alt="Facebook" className="h-6 object-contain grayscale opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">1,8M+</p>
              <p className="mt-2 text-gray-600">Utilisateurs actifs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">1 Md$+</p>
              <p className="mt-2 text-gray-600">Chiffre d'affaires généré</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">800M+</p>
              <p className="mt-2 text-gray-600">Produits disponibles</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">24/7</p>
              <p className="mt-2 text-gray-600">Support client disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Des outils puissants et des fonctionnalités pour vous aider à construire une entreprise e-commerce rentable
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-orange-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Bot className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Optimisation IA</h3>
              <p className="text-gray-600 mb-4">
                Optimisez automatiquement vos fiches produits, descriptions et prix grâce à notre technologie d'intelligence artificielle avancée.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Recherche de produits</h3>
              <p className="text-gray-600 mb-4">
                Trouvez des produits à fort potentiel parmi des millions d'articles et ajoutez-les à votre boutique en un clic.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Importation facile</h3>
              <p className="text-gray-600 mb-4">
                Importez des produits depuis AliExpress, Amazon, ou votre propre catalogue en quelques clics avec notre système d'importation intelligent.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatisation complète</h3>
              <p className="text-gray-600 mb-4">
                Automatisez les commandes, les mises à jour de stock, les notifications et bien plus encore pour gagner du temps et réduire les erreurs.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-yellow-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestion des expéditions</h3>
              <p className="text-gray-600 mb-4">
                Suivez vos expéditions en temps réel, gérez les retours et offrez une expérience de livraison exceptionnelle à vos clients.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-red-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vente multicanal</h3>
              <p className="text-gray-600 mb-4">
                Vendez sur plusieurs plateformes simultanément et gérez toutes vos boutiques depuis une seule interface centralisée.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Comment ça fonctionne
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Démarrez votre boutique e-commerce en quelques étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Créez votre compte</h3>
              <p className="mt-2 text-base text-gray-500">
                Inscrivez-vous gratuitement et configurez votre profil en quelques minutes
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Connectez votre boutique</h3>
              <p className="mt-2 text-base text-gray-500">
                Intégrez Shopify, WooCommerce ou d'autres plateformes e-commerce
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Importez des produits</h3>
              <p className="mt-2 text-base text-gray-500">
                Trouvez et importez des produits à fort potentiel pour votre boutique
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Commencez à vendre</h3>
              <p className="mt-2 text-base text-gray-500">
                Lancez votre boutique et gérez vos ventes depuis un tableau de bord unique
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg">
              <Zap className="h-5 w-5 mr-2" />
              Démarrer maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Prêt à développer votre business e-commerce ?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Rejoignez des milliers d'entrepreneurs qui utilisent Shopopti+ pour créer, gérer et développer leur boutique en ligne.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Commencer gratuitement
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                Voir une démo
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Aucune carte de crédit requise • Annulez à tout moment
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;