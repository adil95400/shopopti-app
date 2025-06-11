import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { availableLanguages, useLanguage } from '../contexts/LanguageContext';

const MultilingualConfig: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>(
    availableLanguages.map(l => l.code)
  );
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translationQuality, setTranslationQuality] = useState('standard');
  const [humanReview, setHumanReview] = useState(false);

  const toggleLanguage = (code: string) => {
    setEnabledLanguages(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Language Configuration</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Default language</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enabled Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableLanguages.map(lang => (
                <div
                  key={lang.code}
                  className="flex justify-between items-center border rounded-lg p-3"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`toggle-${lang.code}`}
                      checked={enabledLanguages.includes(lang.code)}
                      onChange={() => toggleLanguage(lang.code)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`toggle-${lang.code}`}
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        enabledLanguages.includes(lang.code) ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white transform ${
                          enabledLanguages.includes(lang.code) ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translation Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-translate content</p>
                  <p className="text-sm text-gray-500">
                    Automatically translate content to enabled languages
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-auto-translate-settings"
                    checked={autoTranslate}
                    onChange={() => setAutoTranslate(!autoTranslate)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-auto-translate-settings"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      autoTranslate ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform ${
                        autoTranslate ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Translation quality</p>
                  <p className="text-sm text-gray-500">
                    Choose between faster or more accurate translations
                  </p>
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={translationQuality}
                  onChange={e => setTranslationQuality(e.target.value)}
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Human review</p>
                  <p className="text-sm text-gray-500">
                    Send translations for human review before publishing
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-human-review-settings"
                    checked={humanReview}
                    onChange={() => setHumanReview(!humanReview)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-human-review-settings"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      humanReview ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform ${
                        humanReview ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultilingualConfig;
