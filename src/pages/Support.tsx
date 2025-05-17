import React from 'react';
import { HelpCircle, MessageCircle, Mail, Phone, Video, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Support: React.FC = () => {
  const supportChannels = [
    {
      title: 'Chat en direct',
      description: 'Discutez avec notre équipe support',
      icon: MessageCircle,
      action: 'Démarrer une conversation',
      onClick: () => console.log('Open chat')
    },
    {
      title: 'Email',
      description: 'Envoyez-nous un email',
      icon: Mail,
      action: 'Envoyer un email',
      onClick: () => window.location.href = 'mailto:support@shopopti.com'
    },
    {
      title: 'Téléphone',
      description: 'Appelez notre équipe support',
      icon: Phone,
      action: 'Appeler',
      onClick: () => window.location.href = 'tel:+33123456789'
    },
    {
      title: 'Visioconférence',
      description: 'Planifiez un appel vidéo',
      icon: Video,
      action: 'Planifier',
      onClick: () => console.log('Schedule call')
    }
  ];

  const faqCategories = [
    {
      title: 'Démarrage',
      questions: [
        'Comment créer un compte ?',
        'Comment connecter ma boutique ?',
        'Comment importer des produits ?'
      ]
    },
    {
      title: 'Facturation',
      questions: [
        'Quels sont les tarifs ?',
        'Comment fonctionne la facturation ?',
        'Quels moyens de paiement acceptez-vous ?'
      ]
    },
    {
      title: 'Technique',
      questions: [
        'Comment fonctionne l\'API ?',
        'Quelles sont les limites techniques ?',
        'Comment gérer les webhooks ?'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Support</h1>
          <p className="text-accent-200">
            Obtenez de l'aide pour utiliser Shopopti+
          </p>
        </div>
        <button className="btn btn-primary">
          <FileText className="h-5 w-5 mr-2" />
          Créer un ticket
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {supportChannels.map((channel, index) => (
          <motion.div
            key={channel.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={channel.onClick}
          >
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary-400 bg-opacity-10 p-4 mb-4">
                <channel.icon className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{channel.title}</h3>
              <p className="text-sm text-accent-200 mb-4">{channel.description}</p>
              <button className="btn btn-outline w-full">
                {channel.action}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="card">
        <h2 className="text-lg font-medium text-white mb-6">Questions fréquentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <h3 className="font-medium text-white mb-4">{category.title}</h3>
              <ul className="space-y-3">
                {category.questions.map((question) => (
                  <li key={question}>
                    <a
                      href="#"
                      className="flex items-center text-accent-200 hover:text-white transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{question}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gradient-to-br from-primary-400/20 to-primary-500/20"
        >
          <h3 className="text-lg font-medium text-white mb-2">Centre d'aide</h3>
          <p className="text-accent-200 mb-4">
            Parcourez notre base de connaissances complète
          </p>
          <button className="btn btn-primary">
            Accéder au centre d'aide
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-gradient-to-br from-secondary-400/20 to-secondary-500/20"
        >
          <h3 className="text-lg font-medium text-white mb-2">Communauté</h3>
          <p className="text-accent-200 mb-4">
            Rejoignez notre communauté d'utilisateurs
          </p>
          <button className="btn btn-outline">
            Rejoindre le forum
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;