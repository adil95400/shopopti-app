import React from 'react';
import { Book, Play, Clock, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Tutorials: React.FC = () => {
  const categories = [
    'Tous',
    'Débutant',
    'Intermédiaire',
    'Avancé',
    'Nouveautés'
  ];

  const tutorials = [
    {
      title: 'Premiers pas avec Shopopti+',
      description: 'Apprenez les bases de l\'utilisation de Shopopti+',
      duration: '15 min',
      level: 'Débutant',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Optimisation des produits avec l\'IA',
      description: 'Utilisez l\'IA pour optimiser vos fiches produits',
      duration: '20 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Automatisation avancée',
      description: 'Mettez en place des automatisations complexes',
      duration: '30 min',
      level: 'Avancé',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Gestion des commandes',
      description: 'Optimisez votre processus de traitement des commandes',
      duration: '25 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.pexels.com/photos/8386442/pexels-photo-8386442.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('Tous');

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Tutoriels</h1>
          <p className="text-accent-200">
            Apprenez à utiliser Shopopti+ avec nos tutoriels vidéo
          </p>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
              ${selectedCategory === category
                ? 'bg-primary-400 text-white'
                : 'bg-secondary-400 text-accent-200 hover:text-white'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {tutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-12 w-12 text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded-md flex items-center">
                <Clock className="h-4 w-4 text-white mr-1" />
                <span className="text-sm text-white">{tutorial.duration}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary-400">{tutorial.level}</span>
                <div className="flex items-center text-warning-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{tutorial.title}</h3>
              <p className="text-sm text-accent-200">{tutorial.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gradient-to-br from-primary-400/20 to-primary-500/20"
        >
          <h3 className="text-lg font-medium text-white mb-2">Parcours d'apprentissage</h3>
          <p className="text-accent-200 mb-4">
            Suivez nos parcours thématiques pour maîtriser Shopopti+
          </p>
          <button className="btn btn-primary">
            Découvrir les parcours
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-gradient-to-br from-secondary-400/20 to-secondary-500/20"
        >
          <h3 className="text-lg font-medium text-white mb-2">Certification</h3>
          <p className="text-accent-200 mb-4">
            Obtenez votre certification Shopopti+
          </p>
          <button className="btn btn-outline">
            Commencer la certification
          </button>
        </motion.div>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium text-white mb-6">Dernières nouveautés</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center justify-between p-4 rounded-lg bg-secondary-400 hover:bg-secondary-500 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Book className="h-5 w-5 text-primary-400" />
                <div>
                  <h3 className="font-medium text-white">Nouveau tutoriel : Optimisation SEO</h3>
                  <p className="text-sm text-accent-200">Publié il y a 2 jours</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-accent-200" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;