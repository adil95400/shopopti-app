import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Mail, BookOpen, MessageSquare, FileText, Phone, Video, Search } from 'lucide-react';

const HelpCenterPage = () => {
  const { t } = useTranslation();

  const supportCategories = [
    {
      title: "Documentation",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      description: "Consultez notre documentation complète",
      link: "/documentation",
      linkText: "Parcourir la documentation"
    },
    {
      title: "FAQ",
      icon: <HelpCircle className="w-6 h-6 text-primary" />,
      description: "Questions fréquemment posées",
      link: "/faq",
      linkText: "Consulter la FAQ"
    },
    {
      title: "Tutoriels",
      icon: <FileText className="w-6 h-6 text-primary" />,
      description: "Guides pas à pas et vidéos explicatives",
      link: "/tutorials",
      linkText: "Voir les tutoriels"
    },
    {
      title: "Chat en direct",
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      description: "Discutez avec notre équipe support",
      link: "#",
      linkText: "Démarrer une conversation",
      onClick: () => console.log("Open chat")
    },
    {
      title: "Email",
      icon: <Mail className="w-6 h-6 text-primary" />,
      description: "Envoyez-nous un email",
      link: "mailto:support@shopopti.com",
      linkText: "Envoyer un email"
    },
    {
      title: "Téléphone",
      icon: <Phone className="w-6 h-6 text-primary" />,
      description: "Appelez notre équipe support",
      link: "tel:+33123456789",
      linkText: "Appeler",
      hours: "Lun-Ven, 9h-18h CET"
    }
  ];

  const faqItems = [
    {
      question: "Comment connecter ma boutique Shopify ?",
      answer: "Accédez à Paramètres > Connexion boutique et suivez les instructions pour générer et saisir votre clé API Shopify.",
      category: "Intégration"
    },
    {
      question: "Comment importer des produits depuis AliExpress ?",
      answer: "Utilisez notre outil d'importation dans la section 'Importer des produits' et collez l'URL du produit AliExpress.",
      category: "Importation"
    },
    {
      question: "Comment optimiser mes descriptions produit avec l'IA ?",
      answer: "Sélectionnez un produit, cliquez sur 'Optimiser avec IA' et choisissez les éléments à optimiser (titre, description, SEO).",
      category: "IA"
    },
    {
      question: "Comment gérer mes abonnements ?",
      answer: "Accédez à votre compte > Abonnement pour voir les détails de votre forfait, mettre à niveau ou annuler.",
      category: "Facturation"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('Retour au tableau de bord')}
          </Button>
        </Link>
        
        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher dans l'aide..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        
        <Button variant="outline" size="sm">
          <Video className="w-4 h-4 mr-2" /> Planifier un appel
        </Button>
      </div>

      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="w-8 h-8 text-primary" /> Centre d'assistance Shopopti+
        </h1>

        <p className="text-muted-foreground text-lg">
          Notre équipe d'experts est là pour vous aider à réussir avec Shopopti+. Trouvez rapidement des réponses ou contactez-nous directement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {supportCategories.map((category, index) => (
          <div key={index} className="border border-border rounded-xl p-6 bg-card hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                {category.icon}
              </div>
              <h2 className="text-xl font-semibold">{category.title}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{category.description}</p>
            {category.hours && (
              <p className="text-sm text-muted-foreground mb-4">
                Disponibilité: {category.hours}
              </p>
            )}
            <Link 
              to={category.link} 
              onClick={category.onClick}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
            >
              {category.linkText}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12 border border-border rounded-xl p-6 bg-card">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {item.category}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/faq" className="text-primary hover:underline font-medium">
            Voir toutes les questions fréquentes →
          </Link>
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Notre équipe d'assistance est disponible 24h/24 et 7j/7 pour vous aider avec toutes vos questions. Contactez-nous et nous vous répondrons dans les plus brefs délais.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Discuter avec un expert
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Envoyer un email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;