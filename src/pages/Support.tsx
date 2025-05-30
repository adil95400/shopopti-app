import React from 'react';
import { HelpCircle, MessageSquare, Mail, Phone, Video, FileText, Book, CheckCircle, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';

const Support: React.FC = () => {
  const supportChannels = [
    {
      title: 'Chat en direct',
      description: 'Assistance immédiate par chat',
      icon: MessageSquare,
      action: 'Démarrer une conversation',
      availability: '24h/24, 7j/7',
      responseTime: 'Moins de 5 minutes',
      onClick: () => console.log('Open chat')
    },
    {
      title: 'Email',
      description: 'Envoyez-nous un message détaillé',
      icon: Mail,
      action: 'Envoyer un email',
      availability: '24h/24, 7j/7',
      responseTime: 'Sous 24 heures',
      onClick: () => window.location.href = 'mailto:support@shopopti.com'
    },
    {
      title: 'Téléphone',
      description: 'Parlez directement à un expert',
      icon: Phone,
      action: 'Appeler',
      availability: 'Lun-Ven, 9h-18h CET',
      responseTime: 'Immédiat',
      onClick: () => window.location.href = 'tel:+33123456789'
    },
    {
      title: 'Visioconférence',
      description: 'Réservez une session personnalisée',
      icon: Video,
      action: 'Planifier',
      availability: 'Lun-Ven, 9h-18h CET',
      responseTime: 'Sur rendez-vous',
      onClick: () => console.log('Schedule call')
    }
  ];

  const faqCategories = [
    {
      title: 'Démarrage',
      questions: [
        { q: 'Comment créer un compte ?', a: 'Cliquez sur "S\'inscrire" en haut à droite de la page d\'accueil et suivez les instructions pour créer votre compte Shopopti+.' },
        { q: 'Comment connecter ma boutique ?', a: 'Accédez à Paramètres > Connexion boutique et suivez les instructions pour générer et saisir votre clé API.' },
        { q: 'Comment importer des produits ?', a: 'Utilisez notre outil d\'importation dans la section "Importer des produits" et choisissez votre méthode préférée (URL, CSV, etc.).' }
      ]
    },
    {
      title: 'Facturation',
      questions: [
        { q: 'Quels sont les tarifs ?', a: 'Nous proposons plusieurs forfaits adaptés à différents besoins. Consultez notre page Tarifs pour plus de détails.' },
        { q: 'Comment fonctionne la facturation ?', a: 'La facturation est mensuelle ou annuelle selon votre choix. Vous pouvez gérer votre abonnement dans la section "Mon compte".' },
        { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), PayPal et les virements bancaires pour les forfaits annuels.' }
      ]
    },
    {
      title: 'Technique',
      questions: [
        { q: 'Comment fonctionne l\'API ?', a: 'Notre API RESTful vous permet d\'intégrer Shopopti+ à vos systèmes existants. Consultez notre documentation technique pour plus d\'informations.' },
        { q: 'Quelles sont les limites techniques ?', a: 'Les limites varient selon votre forfait. Consultez votre tableau de bord pour voir vos quotas actuels.' },
        { q: 'Comment gérer les webhooks ?', a: 'Configurez vos webhooks dans Paramètres > Intégrations > Webhooks pour recevoir des notifications en temps réel.' }
      ]
    }
  ];

  const supportStats = [
    { label: 'Temps de réponse moyen', value: '< 5 min', icon: Clock },
    { label: 'Taux de satisfaction', value: '98%', icon: CheckCircle },
    { label: 'Disponibilité', value: '24/7', icon: Calendar }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
        >
          Support Shopopti+
        </motion.h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Notre équipe d'experts est disponible pour vous aider à tirer le meilleur parti de Shopopti+ et résoudre rapidement tous vos problèmes.
        </p>
        
        <div className="flex justify-center gap-8 mt-8">
          {supportStats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <div className="rounded-full bg-primary-100 p-3 mb-3">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
      >
        {supportChannels.map((channel, index) => (
          <motion.div
            key={channel.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            onClick={channel.onClick}
          >
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary-100 p-4 mb-4">
                <channel.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{channel.title}</h3>
              <p className="text-gray-600 mb-4">{channel.description}</p>
              
              <div className="w-full space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Disponibilité:</span>
                  <span className="font-medium">{channel.availability}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Temps de réponse:</span>
                  <span className="font-medium">{channel.responseTime}</span>
                </div>
              </div>
              
              <Button className="w-full">
                {channel.action}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-primary-500" />
                {category.title}
              </h3>
              <div className="space-y-6">
                {category.questions.map((faq, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-lg mb-2">{faq.q}</h4>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Voir toutes les questions fréquentes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Book className="h-6 w-6 mr-2 text-primary-500" />
            Centre de documentation
          </h3>
          <p className="text-gray-600 mb-6">
            Explorez notre documentation complète avec des guides détaillés, des tutoriels vidéo et des exemples pratiques pour maîtriser toutes les fonctionnalités de Shopopti+.
          </p>
          <Button>
            Accéder à la documentation
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-primary-50 rounded-xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-primary-500" />
            Créer un ticket de support
          </h3>
          <p className="text-gray-600 mb-6">
            Besoin d'une assistance plus approfondie ? Créez un ticket de support et notre équipe technique vous aidera à résoudre votre problème dans les plus brefs délais.
          </p>
          <Button>
            Créer un ticket
          </Button>
        </motion.div>
      </div>

      <div className="bg-primary-600 text-white rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Besoin d'une assistance personnalisée ?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Nos experts sont disponibles pour vous aider à optimiser votre utilisation de Shopopti+ et à résoudre tous vos problèmes techniques.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-white text-primary-600 hover:bg-gray-100">
            <MessageSquare className="h-5 w-5 mr-2" />
            Discuter avec un expert
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-primary-700">
            <Phone className="h-5 w-5 mr-2" />
            Nous appeler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Support;