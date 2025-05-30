import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Minus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FaqPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'all', name: 'Toutes les questions' },
    { id: 'getting-started', name: 'Démarrage' },
    { id: 'account', name: 'Compte et facturation' },
    { id: 'products', name: 'Produits et importation' },
    { id: 'ai', name: 'Intelligence artificielle' },
    { id: 'integrations', name: 'Intégrations' },
    { id: 'shipping', name: 'Expédition et suivi' },
    { id: 'technical', name: 'Questions techniques' }
  ];

  const faqItems = [
    {
      id: 'connect-shopify',
      question: 'Comment connecter ma boutique Shopify à Shopopti+ ?',
      answer: 'Pour connecter votre boutique Shopify, accédez à "Paramètres > Connexion boutique" dans votre tableau de bord Shopopti+. Suivez les instructions pour générer une clé API dans votre admin Shopify, puis copiez-collez cette clé dans Shopopti+. La synchronisation se fera automatiquement.',
      category: 'getting-started'
    },
    {
      id: 'import-products',
      question: 'Comment importer des produits depuis AliExpress ?',
      answer: 'Accédez à la section "Importer des produits" dans votre tableau de bord. Choisissez la source "AliExpress" et collez l\'URL du produit que vous souhaitez importer. Notre système extraira automatiquement toutes les informations du produit, que vous pourrez ensuite optimiser avec notre IA avant de les publier dans votre boutique.',
      category: 'products'
    },
    {
      id: 'ai-optimization',
      question: 'Comment l\'IA optimise-t-elle mes descriptions de produits ?',
      answer: 'Notre technologie d\'IA analyse votre produit et génère des descriptions optimisées pour le SEO et les conversions. Elle améliore le titre, crée une description engageante, suggère des mots-clés pertinents et structure le contenu pour une meilleure lisibilité. Vous pouvez personnaliser le ton et le style selon votre marque.',
      category: 'ai'
    },
    {
      id: 'subscription-management',
      question: 'Comment gérer mon abonnement Shopopti+ ?',
      answer: 'Vous pouvez gérer votre abonnement dans la section "Mon compte > Abonnement". Ici, vous pouvez voir les détails de votre forfait actuel, mettre à niveau vers un forfait supérieur, ou modifier vos informations de paiement. Si vous souhaitez annuler, vous pouvez le faire à tout moment sans frais supplémentaires.',
      category: 'account'
    },
    {
      id: 'order-fulfillment',
      question: 'Comment fonctionne l\'automatisation des commandes ?',
      answer: 'Lorsqu\'une commande est passée sur votre boutique, Shopopti+ la détecte automatiquement et peut la transmettre à votre fournisseur (AliExpress, etc.) sans intervention manuelle. Le système remplit les informations d\'expédition, effectue le paiement avec votre méthode enregistrée, et met à jour le statut de la commande avec les informations de suivi.',
      category: 'shipping'
    },
    {
      id: 'multi-channel',
      question: 'Puis-je vendre sur plusieurs plateformes avec Shopopti+ ?',
      answer: 'Oui, Shopopti+ prend en charge la vente multicanal. Vous pouvez connecter plusieurs boutiques (Shopify, WooCommerce, etc.) et marketplaces (Amazon, eBay, etc.) à votre compte. Cela vous permet de gérer vos produits, stocks et commandes depuis une seule interface, tout en vendant sur différentes plateformes.',
      category: 'integrations'
    },
    {
      id: 'api-access',
      question: 'Comment utiliser l\'API de Shopopti+ ?',
      answer: 'Notre API RESTful vous permet d\'intégrer Shopopti+ à vos systèmes existants. Pour commencer, générez une clé API dans "Paramètres > API". Consultez notre documentation technique complète pour les endpoints disponibles, les exemples de requêtes et les réponses. Nous proposons également des bibliothèques clientes pour plusieurs langages de programmation.',
      category: 'technical'
    },
    {
      id: 'data-security',
      question: 'Comment Shopopti+ protège-t-il mes données ?',
      answer: 'La sécurité de vos données est notre priorité. Nous utilisons un chiffrement SSL/TLS pour toutes les communications, stockons vos données sur des serveurs sécurisés avec chiffrement au repos, et implémentons des contrôles d\'accès stricts. Nous sommes conformes au RGPD et ne partageons jamais vos données avec des tiers sans votre consentement explicite.',
      category: 'technical'
    },
    {
      id: 'payment-methods',
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer: 'Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), PayPal, et pour les forfaits annuels, les virements bancaires. Toutes les transactions sont sécurisées et chiffrées. Vous pouvez mettre à jour vos informations de paiement à tout moment dans la section "Mon compte > Facturation".',
      category: 'account'
    },
    {
      id: 'product-research',
      question: 'Comment trouver des produits gagnants avec Shopopti+ ?',
      answer: 'Utilisez notre outil "Produits gagnants" qui analyse les tendances du marché, les données de vente et les signaux sociaux pour identifier les produits à fort potentiel. Vous pouvez filtrer par catégorie, marge bénéficiaire, niveau de concurrence et tendance de croissance. Chaque produit reçoit un score basé sur notre algorithme propriétaire.',
      category: 'products'
    }
  ];

  // Filtrer les FAQ en fonction de la catégorie et de la recherche
  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link to="/help-center">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au centre d'aide
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Questions fréquemment posées</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Trouvez rapidement des réponses aux questions les plus courantes sur Shopopti+
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une question..."
          className="w-full pl-12 pr-4 py-3 border rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(item => (
            <div 
              key={item.id} 
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                  <h3 className="font-medium text-lg">{item.question}</h3>
                </div>
                {openItems.includes(item.id) ? (
                  <Minus className="h-5 w-5 text-gray-400" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="p-5 bg-gray-50 border-t">
                  <p className="text-gray-700 whitespace-pre-line">{item.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-500 mb-6">
              Nous n'avons pas trouvé de réponse correspondant à votre recherche.
            </p>
            <Button>
              Contacter le support
            </Button>
          </div>
        )}
      </div>

      <div className="mt-16 bg-primary-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous n'avez pas trouvé votre réponse ?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Notre équipe d'assistance est disponible 24h/24 et 7j/7 pour vous aider avec toutes vos questions. Contactez-nous et nous vous répondrons dans les plus brefs délais.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button>
            Discuter avec un expert
          </Button>
          <Button variant="outline">
            Envoyer un email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;