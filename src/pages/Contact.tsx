import React from 'react';
import { Mail, MessageCircle, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Contact</h1>
          <p className="text-accent-200">
            Contactez notre équipe pour toute question
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <h2 className="text-lg font-medium text-white mb-6">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-accent-200 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-200 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-200 mb-1">
                  Message
                </label>
                <textarea
                  className="input w-full h-32 resize-none"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-lg font-medium text-white mb-6">Informations de contact</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                  <Mail className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-accent-200">Email</p>
                  <a href="mailto:contact@shopopti.com" className="text-white hover:text-primary-400">
                    contact@shopopti.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                  <Phone className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-accent-200">Téléphone</p>
                  <a href="tel:+33123456789" className="text-white hover:text-primary-400">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                  <MapPin className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-accent-200">Adresse</p>
                  <p className="text-white">
                    123 Rue du Commerce<br />
                    75001 Paris, France
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-400/20 to-primary-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="h-6 w-6 text-primary-400" />
              <h3 className="text-lg font-medium text-white">Chat en direct</h3>
            </div>
            <p className="text-accent-200 mb-4">
              Notre équipe est disponible en chat du lundi au vendredi de 9h à 18h.
            </p>
            <button className="btn btn-primary w-full">
              Démarrer une conversation
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-lg font-medium text-white mb-6">FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              question: 'Comment puis-je obtenir de l\'aide ?',
              answer: 'Nous proposons plusieurs canaux de support : chat en direct, email, téléphone et notre centre d\'aide.'
            },
            {
              question: 'Quels sont vos délais de réponse ?',
              answer: 'Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 heures ouvrées.'
            },
            {
              question: 'Proposez-vous un support technique ?',
              answer: 'Oui, notre équipe technique est disponible pour vous aider avec les questions techniques.'
            }
          ].map((item, index) => (
            <div key={index} className="rounded-lg bg-secondary-400 p-4">
              <h3 className="font-medium text-white mb-2">{item.question}</h3>
              <p className="text-sm text-accent-200">{item.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;