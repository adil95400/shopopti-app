import React from 'react';
import { Palette, Moon, Sun, Layout, Grid, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { useSettingsStore } from '../stores/useSettingsStore';

const Appearance: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Apparence</h1>
          <p className="text-accent-200">
            Personnalisez l'apparence de votre interface
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-6"
      >
        {/* Thème */}
        <div className="card">
          <h2 className="text-lg font-medium text-white mb-4">Thème</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updateSettings({ theme: 'light' })}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors
                ${settings.theme === 'light' 
                  ? 'border-primary-400 bg-primary-400/10' 
                  : 'border-accent-200/10 hover:border-accent-200/20'}`}
            >
              <Sun className="h-8 w-8 mb-2 text-primary-400" />
              <span className="font-medium text-white">Clair</span>
            </button>
            <button
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors
                ${settings.theme === 'dark' 
                  ? 'border-primary-400 bg-primary-400/10' 
                  : 'border-accent-200/10 hover:border-accent-200/20'}`}
            >
              <Moon className="h-8 w-8 mb-2 text-primary-400" />
              <span className="font-medium text-white">Sombre</span>
            </button>
          </div>
        </div>

        {/* Affichage */}
        <div className="card">
          <h2 className="text-lg font-medium text-white mb-4">Affichage</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                  <Layout className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Mode compact</p>
                  <p className="text-sm text-accent-200">Réduire l'espacement des éléments</p>
                </div>
              </div>
              <Switch
                checked={settings.display.compactMode}
                onChange={(value) => 
                  updateSettings({ 
                    display: { 
                      ...settings.display, 
                      compactMode: value 
                    } 
                  })
                }
                className={`${
                  settings.display.compactMode ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Activer le mode compact</span>
                <span
                  className={`${
                    settings.display.compactMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                  <Grid className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Grille dense</p>
                  <p className="text-sm text-accent-200">Afficher plus d'éléments par ligne</p>
                </div>
              </div>
              <Switch
                checked={settings.display.denseGrid}
                onChange={(value) => 
                  updateSettings({ 
                    display: { 
                      ...settings.display, 
                      denseGrid: value 
                    } 
                  })
                }
                className={`${
                  settings.display.denseGrid ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Activer la grille dense</span>
                <span
                  className={`${
                    settings.display.denseGrid ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
                  <Eye className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Miniatures</p>
                  <p className="text-sm text-accent-200">Afficher les images en miniature</p>
                </div>
              </div>
              <Switch
                checked={settings.display.showThumbnails}
                onChange={(value) => 
                  updateSettings({ 
                    display: { 
                      ...settings.display, 
                      showThumbnails: value 
                    } 
                  })
                }
                className={`${
                  settings.display.showThumbnails ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Activer les miniatures</span>
                <span
                  className={`${
                    settings.display.showThumbnails ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Animations */}
        <div className="card">
          <h2 className="text-lg font-medium text-white mb-4">Animations</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Animations d'interface</p>
                <p className="text-sm text-accent-200">Activer les animations de transition</p>
              </div>
              <Switch
                checked={settings.display.animations}
                onChange={(value) => 
                  updateSettings({ 
                    display: { 
                      ...settings.display, 
                      animations: value 
                    } 
                  })
                }
                className={`${
                  settings.display.animations ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Activer les animations</span>
                <span
                  className={`${
                    settings.display.animations ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Réduire les animations</p>
                <p className="text-sm text-accent-200">Pour de meilleures performances</p>
              </div>
              <Switch
                checked={settings.display.reducedMotion}
                onChange={(value) => 
                  updateSettings({ 
                    display: { 
                      ...settings.display, 
                      reducedMotion: value 
                    } 
                  })
                }
                className={`${
                  settings.display.reducedMotion ? 'bg-primary-400' : 'bg-secondary-400'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Réduire les animations</span>
                <span
                  className={`${
                    settings.display.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Appearance;