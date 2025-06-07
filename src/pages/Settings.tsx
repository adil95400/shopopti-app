import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { availableLanguages, useLanguage } from '../contexts/LanguageContext';
import { availableCurrencies, useCurrency } from '../contexts/CurrencyContext';

const Settings = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure your general application settings here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage your notification preferences.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentLanguage.code}
                  onChange={e => setLanguage(e.target.value)}
                >
                  {availableLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                >
                  {availableCurrencies.map(cur => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;