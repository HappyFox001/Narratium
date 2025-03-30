import { createContext, useContext } from 'react';

export type Language = 'zh' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => { },
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const getDefaultLanguage = (): Language => {
  if (typeof window === 'undefined') return 'zh';

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  return 'en';
};
