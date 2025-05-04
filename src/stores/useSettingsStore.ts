import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface Settings {
  theme: 'light' | 'dark';
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    orders: boolean;
    stock: boolean;
  };
  display: {
    compactMode: boolean;
    showThumbnails: boolean;
    tableRows: number;
  };
  import: {
    autoOptimize: boolean;
    defaultMargin: number;
    skipExisting: boolean;
  };
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  language: 'fr',
  currency: 'EUR',
  timezone: 'Europe/Paris',
  notifications: {
    email: true,
    push: true,
    orders: true,
    stock: true
  },
  display: {
    compactMode: false,
    showThumbnails: true,
    tableRows: 10
  },
  import: {
    autoOptimize: true,
    defaultMargin: 30,
    skipExisting: true
  }
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      resetSettings: () => {
        set({ settings: defaultSettings });
        // Réinitialiser aussi les cookies
        Object.keys(Cookies.get()).forEach(key => {
          if (key.startsWith('app_')) {
            Cookies.remove(key);
          }
        });
      }
    }),
    {
      name: 'app-settings',
      storage: {
        getItem: (name) => {
          const str = Cookies.get(name) || null;
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          Cookies.set(name, JSON.stringify(value), { expires: 365 });
        },
        removeItem: (name) => Cookies.remove(name)
      }
    }
  )
);