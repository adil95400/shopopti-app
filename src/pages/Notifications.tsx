import React from 'react';
import { Bell, Mail, Globe, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { useSettingsStore } from '../stores/useSettingsStore';

const Notifications: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const notificationTypes = [
    {
      id: 'orders',
      title: 'Commandes',
      description: 'Notifications pour les nouvelles commandes et mises à jour',
      icon: ShoppingBag
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Recevoir des notifications par email',
      icon: Mail
    },
    {
      id: 'push',
      title: 'Push',
      description: 'Notifications push dans le navigateur',
      icon: Globe
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Notifications</h1>
          <p className="text-accent-200">
            Gérez vos préférences de notifications
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-6"
      >
        {/* Types de notifications */}
        <div className="card">
          <h2 className="text-lg font-medium text-white mb-4">Types de notifications</h2>
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                    <type.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{type.title}</p>
                    <p className="text-sm text-accent-200">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications[type.id.toLowerCase()]}
                  onChange={(value) => 
                    updateSettings({ 
                      notifications: { 
                        ...settings.notifications, 
                        [type.id.toLowerCase()]: value 
                      } 
                    })
                  }
                  className={`${
                    settings.notifications[type.id.toLowerCase()] ? 'bg-primary-400' : 'bg-secondary-400'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Activer {type.title}</span>
                  <span
                    className={`${
                      settings.notifications[type.id.toLowerCase()] ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            ))}
          </div>
        </div>

        {/* Préférences de notifications */}
        <div className="card">
          <h2 className="text-lg font-medium text-white mb-4">Préférences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Son des notifications</p>
                <p className="text-sm text-accent-200">Jouer un son lors des notifications</p>
              </div>
              <Switch
                checked={settings.notifications.sound}
                onChange={(value) => 
                  updateSettings({ 
                    notifications: { 
                      ...settings.notifications, 
                      sound: value 
                    } 
                  })
                }
                className={`${
                  settings.notifications.sound ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Activer le son</span>
                <span
                  className={`${
                    settings.notifications.sound ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Ne pas déranger</p>
                <p className="text-sm text-accent-200">Désactiver toutes les notifications</p>
              </div>
              <Switch
                checked={settings.notifications.doNotDisturb}
                onChange={(value) => 
                  updateSettings({ 
                    notifications: { 
                      ...settings.notifications, 
                      doNotDisturb: value 
                    } 
                  })
                }
                className={`${
                  settings.notifications.doNotDisturb ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Activer ne pas déranger</span>
                <span
                  className={`${
                    settings.notifications.doNotDisturb ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="rounded-md bg-secondary-600 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-accent-200" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-white">À propos des notifications</h3>
              <div className="mt-2 text-sm text-accent-200">
                <p>
                  Les notifications vous permettent de rester informé des événements importants de votre boutique.
                  Vous pouvez personnaliser vos préférences à tout moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;