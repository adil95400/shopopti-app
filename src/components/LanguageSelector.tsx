import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, availableLanguages } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-neutral-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe size={16} />
        <span>{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                language.code === currentLanguage.code
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
              onClick={() => {
                setLanguage(language.code);
                setIsOpen(false);
              }}
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;