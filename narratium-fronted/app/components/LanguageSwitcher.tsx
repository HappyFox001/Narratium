'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/config';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const switchLanguage = (newLanguage: 'zh' | 'en') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-800/60 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-300 font-[family-name:var(--font-raleway)]"
        aria-label="切换语言"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span>{language === 'zh' ? '中文' : 'English'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-20 border border-gray-700 animate-fade-in">
          <div className="py-1">
            <button
              onClick={() => switchLanguage('zh')}
              className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${language === 'zh'
                ? 'bg-purple-600/90 text-white font-medium'
                : 'text-gray-300 hover:bg-gray-700/80'
                }`}
            >
              <span className="mr-2 text-xs">🇨🇳</span>
              <span className="font-[family-name:var(--font-raleway)]">中文</span>
            </button>
            <button
              onClick={() => switchLanguage('en')}
              className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${language === 'en'
                ? 'bg-purple-600/90 text-white font-medium'
                : 'text-gray-300 hover:bg-gray-700/80'
                }`}
            >
              <span className="mr-2 text-xs">🇺🇸</span>
              <span className="font-[family-name:var(--font-raleway)]">English</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
