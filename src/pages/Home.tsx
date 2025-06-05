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
  ShoppingCart,
  Bot,
  BarChart3,
  Truck,
  Package,
  Star,
  Users,
  Sparkles,
  Layers,
  Settings,
  Shield,
  Repeat,
  BarChart,
  DollarSign
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
                Automatisez votre <span className="text-primary">dropshipping</span> avec l'IA
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Importez, optimisez et gérez vos produits en masse. Automatisez vos commandes et suivez vos expéditions en temps réel. Tout-en-un avec Shopopti+.
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
              Fonctionnalités avancées pour votre dropshipping
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Des outils puissants inspirés des meilleures plateformes pour maximiser votre efficacité
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-orange-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Traitement des commandes en masse</h3>
              <p className="text-gray-600 mb-4">
                Importez et traitez des centaines de commandes en quelques clics. Synchronisez automatiquement avec Shopify, WooCommerce et autres plateformes.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Suivi automatique des commandes</h3>
              <p className="text-gray-600 mb-4">
                Suivez vos expéditions en temps réel avec mise à jour automatique des statuts. Synchronisation avec Shopify et notifications clients automatiques.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Optimisation des fournisseurs</h3>
              <p className="text-gray-600 mb-4">
                Comparez automatiquement les prix, délais et qualité des fournisseurs pour chaque produit. Trouvez la meilleure source pour maximiser vos marges.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestion multi-boutiques</h3>
              <p className="text-gray-600 mb-4">
                Gérez plusieurs boutiques depuis une seule interface. Synchronisez produits, commandes et inventaires entre toutes vos plateformes e-commerce.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-yellow-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Bot className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Optimisation IA des produits</h3>
              <p className="text-gray-600 mb-4">
                Améliorez automatiquement vos fiches produits avec notre IA. Titres SEO, descriptions convaincantes et mots-clés optimisés en un clic.
              </p>
              <Link to="/register" className="text-primary font-medium flex items-center">
                En savoir plus <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-lg bg-red-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <BarChart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyse avancée des performances</h3>
              <p className="text-gray-600 mb-4">
                Visualisez vos performances avec des tableaux de bord détaillés. Identifiez vos produits les plus rentables et optimisez votre stratégie.
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
              <h3 className="mt-6 text-lg font-medium text-gray-900">Connectez vos boutiques</h3>
              <p className="mt-2 text-base text-gray-500">
                Intégrez Shopify, WooCommerce ou d'autres plateformes e-commerce en quelques clics
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Importez des produits</h3>
              <p className="mt-2 text-base text-gray-500">
                Trouvez et importez des produits en masse depuis AliExpress, Amazon ou d'autres fournisseurs
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Optimisez avec l'IA</h3>
              <p className="mt-2 text-base text-gray-500">
                Améliorez automatiquement vos fiches produits pour maximiser les conversions
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Automatisez les commandes</h3>
              <p className="mt-2 text-base text-gray-500">
                Traitez les commandes en masse et suivez les expéditions automatiquement
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg">
              <Sparkles className="h-5 w-5 mr-2" />
              Démarrer maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Shopopti+ vs. Autres solutions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Découvrez pourquoi Shopopti+ est la solution la plus complète pour votre business
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-left text-gray-500 font-medium">Fonctionnalités</th>
                  <th className="py-4 px-6 text-center text-gray-900 font-bold">Shopopti+</th>
                  <th className="py-4 px-6 text-center text-gray-500 font-medium">DSers</th>
                  <th className="py-4 px-6 text-center text-gray-500 font-medium">Autres solutions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-800">Traitement des commandes en masse</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Suivi automatique des commandes</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Optimisation IA des produits</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Gestion multi-boutiques</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Comparaison automatique des fournisseurs</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Synchronisation PayPal</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Extension Chrome avancée</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Importation d'avis produits</td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Extension Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Extension Chrome avancée
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Importez des produits et des avis depuis n'importe quel site en un clic. Notre extension Chrome vous permet de:
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Importer des produits depuis AliExpress, Amazon, Temu et plus</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Capturer toutes les variantes, images et descriptions</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Importer les avis clients pour ajouter de la preuve sociale</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Comparer automatiquement les prix entre différents fournisseurs</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button size="lg">
                  Télécharger l'extension
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6177677/pexels-photo-6177677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Extension Chrome Shopopti+" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                    +
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Importation en 1 clic</p>
                  </div>
                </div>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm">Produit importé avec succès! Optimiser avec l'IA?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Batch Processing Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Traitement des commandes en masse" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Traitement des commandes en masse
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Gagnez des heures chaque jour en traitant toutes vos commandes en quelques clics. Notre système automatisé vous permet de:
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <Repeat className="h-4 w-4 text-primary" />
                  </div>
                  <p className="ml-3 text-gray-600">Traiter des centaines de commandes en quelques secondes</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <Repeat className="h-4 w-4 text-primary" />
                  </div>
                  <p className="ml-3 text-gray-600">Synchroniser automatiquement les numéros de suivi avec Shopify</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <Repeat className="h-4 w-4 text-primary" />
                  </div>
                  <p className="ml-3 text-gray-600">Mettre à jour le statut des commandes automatiquement</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <Repeat className="h-4 w-4 text-primary" />
                  </div>
                  <p className="ml-3 text-gray-600">Notifier vos clients à chaque étape du processus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Store Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Gestion multi-boutiques simplifiée
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Gérez toutes vos boutiques depuis une seule interface. Synchronisez produits, commandes et inventaires entre plusieurs plateformes.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <Store className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Connectez plusieurs boutiques Shopify, WooCommerce, etc.</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <Store className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Gérez les stocks de manière centralisée pour toutes vos boutiques</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <Store className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Importez des produits vers n'importe quelle boutique en un clic</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <Store className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Visualisez les performances de chaque boutique dans un tableau de bord unifié</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button>
                  Essayer la gestion multi-boutiques
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6169659/pexels-photo-6169659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Gestion multi-boutiques" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Supplier Optimization */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.pexels.com/photos/7681731/pexels-photo-7681731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Optimisation des fournisseurs" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Optimisation intelligente des fournisseurs
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Notre système compare automatiquement les fournisseurs pour chaque produit et vous recommande la meilleure option.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Comparaison automatique des prix entre fournisseurs</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                    <Truck className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Évaluation des délais de livraison et fiabilité</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Analyse des avis et de la qualité des produits</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                    <BarChart className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="ml-3 text-gray-600">Recommandations basées sur les données historiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Prêt à automatiser votre dropshipping ?
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

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Ce que nos clients disent
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Témoignage" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">Thomas Martin</h3>
                  <p className="text-sm text-gray-500">Fondateur, TechStyle</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">
                "Shopopti+ a transformé mon business. Le traitement des commandes en masse et la synchronisation automatique des numéros de suivi m'ont fait gagner des heures chaque jour. Mes ventes ont augmenté de 35% depuis que j'utilise l'optimisation IA."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Témoignage" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">Sophie Dubois</h3>
                  <p className="text-sm text-gray-500">E-commerçante</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">
                "La gestion multi-boutiques de Shopopti+ est incroyable. Je gère maintenant 3 boutiques différentes depuis une seule interface. L'optimisation des fournisseurs m'a permis d'augmenter mes marges de 15% en trouvant automatiquement les meilleures sources."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Témoignage" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">Jean Lefebvre</h3>
                  <p className="text-sm text-gray-500">Directeur e-commerce</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">
                "L'extension Chrome de Shopopti+ est bien supérieure à celle de DSers. Elle capture non seulement les produits mais aussi les avis clients, ce qui a considérablement augmenté notre taux de conversion. Le support client est également exceptionnel."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Questions fréquemment posées
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Comment Shopopti+ se compare-t-il à DSers ?</h3>
              <p className="text-gray-600">
                Shopopti+ offre toutes les fonctionnalités de DSers (traitement des commandes en masse, suivi automatique) mais ajoute l'optimisation IA des produits, la comparaison automatique des fournisseurs et une meilleure gestion multi-boutiques.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Puis-je importer des produits en masse ?</h3>
              <p className="text-gray-600">
                Oui, Shopopti+ vous permet d'importer des centaines de produits en quelques clics depuis AliExpress, Amazon, ou via CSV/Excel. Notre extension Chrome facilite également l'importation depuis n'importe quel site.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Comment fonctionne le suivi automatique des commandes ?</h3>
              <p className="text-gray-600">
                Notre système se connecte aux API des transporteurs pour suivre automatiquement vos colis. Les numéros de suivi sont synchronisés avec Shopify et PayPal, et vos clients reçoivent des notifications à chaque étape.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Combien de boutiques puis-je gérer ?</h3>
              <p className="text-gray-600">
                Avec Shopopti+, vous pouvez gérer un nombre illimité de boutiques depuis une seule interface. Connectez Shopify, WooCommerce, Amazon, eBay et d'autres plateformes pour une gestion centralisée.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/faq" className="text-primary font-medium hover:text-primary-600 transition-colors">
              Voir toutes les questions fréquentes →
            </Link>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Prêt à révolutionner votre dropshipping ?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Rejoignez plus de 100 000 entrepreneurs qui font confiance à Shopopti+ pour développer leur business en ligne.
            </p>
            <div className="mt-8">
              <Button size="lg">
                Commencer gratuitement
              </Button>
              <p className="mt-4 text-sm text-gray-500">
                Essai gratuit de 14 jours • Aucune carte de crédit requise
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;