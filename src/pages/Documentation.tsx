import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Book, Code, ExternalLink, ArrowLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocumentationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [copied, setCopied] = useState<string | null>(null);

  const categories = [
    { id: 'getting-started', name: 'Démarrage rapide', icon: Book },
    { id: 'guides', name: 'Guides pratiques', icon: FileText },
    { id: 'api', name: 'API Reference', icon: Code }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const articles = {
    'getting-started': [
      {
        id: 'introduction',
        title: 'Introduction à Shopopti+',
        description: 'Présentation de la plateforme et de ses fonctionnalités principales',
        readTime: '5 min'
      },
      {
        id: 'account-setup',
        title: 'Configuration de votre compte',
        description: 'Comment créer et configurer votre compte Shopopti+',
        readTime: '7 min'
      },
      {
        id: 'store-connection',
        title: 'Connecter votre boutique',
        description: 'Guide pour connecter Shopify, WooCommerce et autres plateformes',
        readTime: '10 min'
      },
      {
        id: 'first-import',
        title: 'Votre première importation de produits',
        description: 'Comment importer vos premiers produits depuis différentes sources',
        readTime: '12 min'
      }
    ],
    'guides': [
      {
        id: 'product-optimization',
        title: 'Optimisation des produits avec l\'IA',
        description: 'Comment utiliser l\'IA pour améliorer vos fiches produits',
        readTime: '15 min'
      },
      {
        id: 'order-automation',
        title: 'Automatisation des commandes',
        description: 'Configuration du traitement automatique des commandes',
        readTime: '20 min'
      },
      {
        id: 'multi-channel',
        title: 'Vente multicanal',
        description: 'Comment vendre sur plusieurs plateformes simultanément',
        readTime: '18 min'
      },
      {
        id: 'analytics',
        title: 'Analyse des performances',
        description: 'Comprendre et utiliser les rapports d\'analyse',
        readTime: '15 min'
      }
    ],
    'api': [
      {
        id: 'authentication',
        title: 'Authentification',
        description: 'Comment s\'authentifier à l\'API Shopopti+',
        readTime: '8 min'
      },
      {
        id: 'products-api',
        title: 'API Produits',
        description: 'Endpoints pour gérer vos produits',
        readTime: '12 min'
      },
      {
        id: 'orders-api',
        title: 'API Commandes',
        description: 'Endpoints pour gérer vos commandes',
        readTime: '10 min'
      },
      {
        id: 'webhooks',
        title: 'Webhooks',
        description: 'Configuration et utilisation des webhooks',
        readTime: '15 min'
      }
    ]
  };

  // Exemple de contenu d'article pour la démonstration
  const articleContent = {
    'introduction': {
      title: 'Introduction à Shopopti+',
      sections: [
        {
          title: 'Qu\'est-ce que Shopopti+ ?',
          content: 'Shopopti+ est une plateforme tout-en-un pour le dropshipping et l\'e-commerce qui vous permet de trouver des produits, de créer une boutique, d\'automatiser les commandes et de gérer votre entreprise. Notre solution combine des outils puissants d\'IA, d\'automatisation et d\'analyse pour vous aider à développer votre activité en ligne.'
        },
        {
          title: 'Fonctionnalités principales',
          content: 'Shopopti+ offre de nombreuses fonctionnalités pour optimiser votre activité de dropshipping :\n\n- **Recherche de produits** : Trouvez des produits gagnants parmi des millions d\'articles\n- **Importation facile** : Importez des produits depuis AliExpress, Amazon et d\'autres sources\n- **Optimisation par IA** : Améliorez vos titres, descriptions et SEO automatiquement\n- **Automatisation des commandes** : Traitez les commandes sans intervention manuelle\n- **Analyse avancée** : Suivez vos performances et identifiez les opportunités\n- **Vente multicanal** : Gérez plusieurs boutiques et marketplaces depuis une seule interface'
        },
        {
          title: 'Pour qui est Shopopti+ ?',
          content: 'Shopopti+ est conçu pour :\n\n- **Débutants en e-commerce** qui souhaitent lancer leur première boutique\n- **Entrepreneurs expérimentés** cherchant à optimiser leurs opérations\n- **Agences e-commerce** gérant plusieurs boutiques pour leurs clients\n- **Propriétaires de boutiques** souhaitant étendre leur catalogue avec le dropshipping'
        }
      ],
      code: {
        title: 'Exemple d\'intégration rapide',
        language: 'javascript',
        content: `// Exemple d'intégration avec l'API Shopopti+
import { ShopoptiClient } from '@shopopti/api-client';

// Initialiser le client
const client = new ShopoptiClient({
  apiKey: 'votre-clé-api',
});

// Importer un produit
async function importProduct(url) {
  try {
    const product = await client.products.import({
      source: 'aliexpress',
      url: url,
      optimize: true
    });
    console.log('Produit importé avec succès:', product.id);
    return product;
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}`
      }
    }
  };

  // Filtrer les articles en fonction de la recherche
  const filteredArticles = Object.entries(articles).reduce((acc, [category, items]) => {
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof articles[keyof typeof articles]>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link to="/help-center">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au centre d'aide
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Documentation Shopopti+</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Guides complets, tutoriels et références techniques pour tirer le meilleur parti de Shopopti+
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher dans la documentation..."
          className="w-full pl-12 pr-4 py-3 border rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="sticky top-8">
            <h2 className="text-xl font-bold mb-4">Catégories</h2>
            <nav className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <category.icon className={`h-5 w-5 ${
                    activeCategory === category.id ? 'text-white' : 'text-gray-500'
                  } mr-3`} />
                  <span>{category.name}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous ne trouvez pas ce que vous cherchez ? Notre équipe de support est là pour vous aider.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contacter le support
              </Button>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          {searchQuery ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Résultats de recherche pour "{searchQuery}"</h2>
              
              {Object.keys(filteredArticles).length > 0 ? (
                Object.entries(filteredArticles).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-medium mb-4 capitalize">
                      {categories.find(c => c.id === category)?.name}
                    </h3>
                    <div className="space-y-4">
                      {items.map(item => (
                        <Link 
                          key={item.id}
                          to={`/documentation/${category}/${item.id}`}
                          className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-lg">{item.title}</h4>
                              <p className="text-gray-600 mt-1">{item.description}</p>
                            </div>
                            <span className="text-sm text-gray-500">{item.readTime}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-500 mb-6">
                    Nous n'avons pas trouvé d'article correspondant à votre recherche.
                  </p>
                  <Button onClick={() => setSearchQuery('')}>
                    Effacer la recherche
                  </Button>
                </div>
              )}
            </div>
          ) : (
            activeCategory === 'getting-started' && articleContent['introduction'] ? (
              <div>
                <div className="mb-6 flex items-center text-sm text-gray-500">
                  <Link to="/documentation" className="hover:text-gray-700">Documentation</Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <Link to="/documentation/getting-started" className="hover:text-gray-700">Démarrage rapide</Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span className="text-gray-700">Introduction</span>
                </div>

                <h1 className="text-3xl font-bold mb-6">{articleContent['introduction'].title}</h1>
                
                <div className="flex items-center text-sm text-gray-500 mb-8">
                  <span>Mis à jour le 30 mai 2025</span>
                  <span className="mx-2">•</span>
                  <span>Temps de lecture: 5 min</span>
                </div>

                <div className="prose prose-lg max-w-none">
                  {articleContent['introduction'].sections.map((section, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                      <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                    </div>
                  ))}

                  {articleContent['introduction'].code && (
                    <div className="bg-gray-900 rounded-lg p-4 mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-medium">{articleContent['introduction'].code.title}</h3>
                        <button
                          onClick={() => copyToClipboard(articleContent['introduction'].code.content, 'code-example')}
                          className="text-gray-400 hover:text-white"
                        >
                          {copied === 'code-example' ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <pre className="text-gray-300 overflow-x-auto p-2">
                        <code>{articleContent['introduction'].code.content}</code>
                      </pre>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-12 pt-6 border-t">
                  <div>
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Article précédent
                    </Button>
                  </div>
                  <div>
                    <Button>
                      Article suivant
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles[activeCategory as keyof typeof articles]?.map(article => (
                    <Link 
                      key={article.id}
                      to={`/documentation/${activeCategory}/${article.id}`}
                      className="block p-5 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{article.title}</h3>
                          <p className="text-gray-600 mt-1">{article.description}</p>
                        </div>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                      <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                        Lire l'article
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;