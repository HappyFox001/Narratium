'use client';

import React, { useState, useEffect } from 'react';
import { LanguageContext, Language, getDefaultLanguage } from './config';
import { getTranslation, TranslationKey } from './translations';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    const defaultLang = storedLanguage || getDefaultLanguage();
    setLanguageState(defaultLang);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string) => {
    return getTranslation(language, key as TranslationKey);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
