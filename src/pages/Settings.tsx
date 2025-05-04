import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe, DollarSign, Clock, Layout, Import } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { Switch } from '@headlessui/react';

const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Paramètres</h1>
          <p className="text-accent-200">
            Personnalisez votre expérience Shopopti+
          </p>
        </div>
        <button 
          onClick={resetSettings}
          className="btn btn-outline"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Apparence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Layout className="h-5 w-5 text-primary-400" />
            <h2 className="text-lg font-medium text-white">Apparence</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Thème</label>
                <p className="text-sm text-accent-200">Choisissez le mode d'affichage</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className={`p-2 rounded-md ${settings.theme === 'light' ? 'bg-primary-400' : 'bg-secondary-400'}`}
                  onClick={() => updateSettings({ theme: 'light' })}
                >
                  <Sun size={16} className="text-white" />
                </button>
                <button 
                  className={`p-2 rounded-md ${settings.theme === 'dark' ? 'bg-primary-400' : 'bg-secondary-400'}`}
                  onClick={() => updateSettings({ theme: 'dark' })}
                >
                  <Moon size={16} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Mode compact</label>
                <p className="text-sm text-accent-200">Réduire l'espacement des éléments</p>
              </div>
              <Switch
                checked={settings.display.compactMode}
                onChange={(value) => updateSettings({ display: { ...settings.display, compactMode: value } })}
                className={`${
                  settings.display.compactMode ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Mode compact</span>
                <span
                  className={`${
                    settings.display.compactMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Miniatures</label>
                <p className="text-sm text-accent-200">Afficher les images en miniature</p>
              </div>
              <Switch
                checked={settings.display.showThumbnails}
                onChange={(value) => updateSettings({ display: { ...settings.display, showThumbnails: value } })}
                className={`${
                  settings.display.showThumbnails ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Miniatures</span>
                <span
                  className={`${
                    settings.display.showThumbnails ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-primary-400" />
            <h2 className="text-lg font-medium text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Notifications email</label>
                <p className="text-sm text-accent-200">Recevoir des emails de notification</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onChange={(value) => updateSettings({ notifications: { ...settings.notifications, email: value } })}
                className={`${
                  settings.notifications.email ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Notifications email</span>
                <span
                  className={`${
                    settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Notifications push</label>
                <p className="text-sm text-accent-200">Recevoir des notifications push</p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onChange={(value) => updateSettings({ notifications: { ...settings.notifications, push: value } })}
                className={`${
                  settings.notifications.push ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Notifications push</span>
                <span
                  className={`${
                    settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </motion.div>

        {/* Localisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-primary-400" />
            <h2 className="text-lg font-medium text-white">Localisation</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white">Langue</label>
              <select 
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="mt-1 input w-full"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="text-white">Devise</label>
              <select 
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
                className="mt-1 input w-full"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="text-white">Fuseau horaire</label>
              <select 
                value={settings.timezone}
                onChange={(e) => updateSettings({ timezone: e.target.value })}
                className="mt-1 input w-full"
              >
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Importation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Import className="h-5 w-5 text-primary-400" />
            <h2 className="text-lg font-medium text-white">Importation</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Optimisation automatique</label>
                <p className="text-sm text-accent-200">Optimiser les produits à l'import</p>
              </div>
              <Switch
                checked={settings.import.autoOptimize}
                onChange={(value) => updateSettings({ import: { ...settings.import, autoOptimize: value } })}
                className={`${
                  settings.import.autoOptimize ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Optimisation automatique</span>
                <span
                  className={`${
                    settings.import.autoOptimize ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div>
              <label className="text-white">Marge par défaut (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.import.defaultMargin}
                onChange={(e) => updateSettings({ import: { ...settings.import, defaultMargin: parseInt(e.target.value) } })}
                className="mt-1 input w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Ignorer les doublons</label>
                <p className="text-sm text-accent-200">Ne pas importer les produits existants</p>
              </div>
              <Switch
                checked={settings.import.skipExisting}
                onChange={(value) => updateSettings({ import: { ...settings.import, skipExisting: value } })}
                className={`${
                  settings.import.skipExisting ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Ignorer les doublons</span>
                <span
                  className={`${
                    settings.import.skipExisting ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;