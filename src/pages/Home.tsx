import React, { useState, useEffect } from 'react';
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
  BarChart3,
  Truck,
  Package,
  Star,
  Users,
  Sun,
  Moon
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user preference in localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={toggleDarkMode} 
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Créez votre boutique dropshipping en <span className="text-orange-500">2 minutes</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                Bénéficiez d'une boutique IA gratuite et prête à vendre. Trouvez les produits les plus vendus. Achetez au meilleur prix. Livraison ultra-rapide. Profitez d'une expérience de dropshipping IA tout-en-un.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn bg-orange-500 hover:bg-orange-600 text-white">
                  Commencer - C'est GRATUIT
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <a href="#features" className="btn btn-outline dark:border-gray-600 dark:text-gray-300">
                  En savoir plus
                </a>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>Essai de 14 jours pour 1€ • Annuler à tout moment</p>
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
                <div className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-bl-lg px-3 py-1 shadow-md">
                  <div className="flex items-center">
                    <span className="text-green-500 font-semibold">$1,060</span>
                    <span className="ml-1 text-xs text-green-500">+25%</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ventes aujourd'hui</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-white">98 commandes</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aujourd'hui</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500">1,8M+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Dropshippers utilisent Shopopti+</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500">1 Md$+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Gagné par nos dropshippers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500">800M+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Produits gagnants disponibles</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500">24/7</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Support client disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Des outils puissants et des fonctionnalités pour vous aider à construire une entreprise de dropshipping rentable
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm">
              <div className="rounded-lg bg-orange-100 dark:bg-orange-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Bot className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Boutique Shopify construite par l'IA</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Obtenez une boutique Shopify créée par l'IA avec des produits gagnants et des pages prêtes à vendre pour démarrer votre activité de dropshipping.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Commencer <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Système de recherche de produits</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Comparez instantanément plus de 8 millions de produits tendance de fournisseurs mondiaux et ajoutez-les à votre boutique en un clic.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Commencer <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm">
              <div className="rounded-lg bg-green-100 dark:bg-green-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Importations de produits</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Importez plus de 500 millions de produits de fournisseurs mondiaux en un clic, avec optimisation automatique des descriptions et images.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Commencer <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Réalisé par Shopopti+</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Automatisez les commandes, les mises à jour de suivi et les retours sans avoir besoin d'un compte acheteur, tout en un seul endroit.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Commencer <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm">
              <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Truck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Impression à la demande</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Créez et vendez une large gamme de produits conçus sur mesure directement via Shopopti+, sans stock ni investissement initial.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Commencer <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm">
              <div className="rounded-lg bg-red-100 dark:bg-red-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Sourcing de produits</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Envoyez n'importe quel lien de produit ou image à notre équipe, et nous le trouverons pour vous à des prix inférieurs.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Commencer <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Accompagner votre croissance à chaque étape
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Bénéficiez d'un service client exceptionnel 24h/24 et 7j/7. Notre équipe d'assistance professionnelle vous accompagne à chaque étape.
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3 mb-3">
                    <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Assistance par chat en direct 24h/24</h3>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3 mb-3">
                    <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">1h de temps de réponse moyen</h3>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3 mb-3">
                    <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Équipe de soutien professionnelle</h3>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/register" className="btn bg-orange-500 hover:bg-orange-600 text-white">
                  COMMENCER
                </Link>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Essai de 14 jours pour 1€ • Annuler à tout moment
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Support client" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Support Shopopti+</p>
                  </div>
                </div>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm dark:text-white">Comment puis-je vous aider aujourd'hui ?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nos fournisseurs soutenus dans le monde entier
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Travaillez avec des fournisseurs fiables et dignes de confiance du monde entier, pris en charge par Shopopti+.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/AliExpress_logo.svg/1280px-AliExpress_logo.svg.png" alt="AliExpress" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" alt="Amazon" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png" alt="Etsy" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png" alt="eBay" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png" alt="Shopify" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Woocommerce_logo.svg/2560px-Woocommerce_logo.svg.png" alt="WooCommerce" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png" alt="Facebook" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1024px-Instagram_logo_2022.svg.png" alt="Instagram" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/TikTok_logo.svg/2560px-TikTok_logo.svg.png" alt="TikTok" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Wix.com_website_logo.svg/2560px-Wix.com_website_logo.svg.png" alt="Wix" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Target_Corporation_logo_%28vector%29.svg/1024px-Target_Corporation_logo_%28vector%29.svg.png" alt="Target" className="h-8" />
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Walmart_symbol.svg/1024px-Walmart_symbol.svg.png" alt="Walmart" className="h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-800 dark:to-amber-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              L'outil tout-en-un dont vous avez besoin pour rationaliser et développer votre entreprise
            </h2>
            <div className="mt-8">
              <Link to="/register" className="btn bg-white text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-200">
                COMMENCER
              </Link>
              <p className="mt-2 text-sm text-white/80">
                Essai de 14 jours pour 1€ • Annuler à tout moment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Que disent les autres entrepreneurs à propos de Shopopti+ ?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Témoignage" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Nahar Geva</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PDG de ZIK Analytics</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Je gère l'automatisation complète de mes commandes, l'importation d'articles, le service client et tout le reste avec Shopopti+. C'est un excellent outil qui me fait gagner un temps précieux."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Témoignage" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Sophie Martin</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Entrepreneuse e-commerce</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Grâce à Shopopti+, j'ai pu lancer ma boutique en quelques heures seulement. L'outil de recherche de produits m'a permis de trouver des articles tendance qui se vendent très bien."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Témoignage" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Thomas Dubois</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dropshipper depuis 2 ans</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "C'est tellement facile, je recommande à tous. Avant Shopopti+, je passais des heures à gérer mes commandes. Maintenant tout est automatisé et je peux me concentrer sur le marketing."
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center space-x-4">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-2 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Capterra_logo.svg/2560px-Capterra_logo.svg.png" alt="Capterra" className="h-6" />
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-2 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/G2_crowd_logo.svg/1280px-G2_crowd_logo.svg.png" alt="G2" className="h-6" />
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-2 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Trustpilot_logo.svg/2560px-Trustpilot_logo.svg.png" alt="Trustpilot" className="h-6" />
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Le soutien dont vous avez besoin, quand vous en avez besoin
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Trouvez les meilleures ressources adaptées à vos besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <div className="rounded-lg bg-amber-100 dark:bg-amber-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Bot className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cours privés gratuits</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Cours et formations exclusifs spécialement conçus pour vous, du débutant à la création d'une boutique de dropshipping à 10 000 €/mois.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Apprendre <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <div className="rounded-lg bg-green-100 dark:bg-green-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Book className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Manuel du débutant</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Obtenez les conseils pour réaliser les meilleures ventes et les manuels étape par étape du 1% des meilleurs dropshippers.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Lire <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <div className="rounded-lg bg-red-100 dark:bg-red-900 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Centre d'aide</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Obtenez des réponses immédiates à toutes vos questions et défis grâce à notre équipe d'assistance dédiée 24h/24 et 7j/7.
              </p>
              <Link to="/register" className="text-orange-500 dark:text-orange-400 font-medium flex items-center">
                Obtenir de l'aide <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Un pro du Dropshipping à vos côtés
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Shopopti+ aide tous les dropshippers avec des outils d'automatisation tout-en-un et des ressources d'apprentissage pour les guider des débutants aux experts.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-12">
            <Link to="/register" className="btn border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:border-orange-400 dark:text-orange-400">
              Commencez à vendre
            </Link>
            <Link to="/pricing" className="btn bg-orange-500 hover:bg-orange-600 text-white">
              Développez votre entreprise
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-blue-950 dark:to-indigo-950 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Commencez à vendre
                </h3>
                <ul className="space-y-4 text-white">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span>Trouvez des produits dropshipping gagnants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span>Accès complet aux cours et livres électroniques de dropshipping gratuits</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span>Configuration adaptée aux débutants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <span>Centre d'aide Dropshipping et assistance par chat individuel</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/register" className="btn bg-orange-500 hover:bg-orange-600 text-white">
                    DÉMARRER LE DROPSHIPPING
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Dashboard mobile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1/4 left-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aujourd'hui</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">$1,060</p>
                    <p className="text-xs text-green-500">+25%</p>
                  </div>
                </div>
                <div className="absolute bottom-1/4 right-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium dark:text-white">Produits gagnants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Questions fréquemment posées
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Qu'est-ce que Shopopti+ ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Shopopti+ est une plateforme tout-en-un pour le dropshipping qui vous permet de trouver des produits, de créer une boutique, d'automatiser les commandes et de gérer votre entreprise.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Puis-je annuler à tout moment ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Oui, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires. Nous proposons également une garantie de remboursement de 14 jours.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Est-ce que Shopopti+ automatise les commandes pour moi ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Oui, Shopopti+ automatise entièrement le processus de commande, y compris le placement des commandes, le suivi des expéditions et la gestion des retours.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Puis-je gérer plusieurs magasins sur Shopopti+ ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Oui, selon votre forfait, vous pouvez gérer plusieurs boutiques à partir d'un seul tableau de bord Shopopti+, ce qui simplifie la gestion de plusieurs niches.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Comment fonctionne la recherche de produits sur Shopopti+ ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Notre moteur de recherche de produits vous permet de trouver des produits tendance parmi des millions d'articles, avec des filtres pour le prix, les évaluations, les ventes et plus encore.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Puis-je utiliser Shopopti+ en tant que débutant ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolument ! Shopopti+ est conçu pour les débutants comme pour les experts. Nous proposons des tutoriels, des guides et un support client pour vous aider à chaque étape.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function Book(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
    </svg>
  );
}

export default Home;