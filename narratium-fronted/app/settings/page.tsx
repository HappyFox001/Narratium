'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../i18n/config';
import { useSettings } from '../contexts/SettingsContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function SettingsPage() {
  const { t } = useLanguage();
  const {
    apiBaseUrl,
    apiKey,
    setApiBaseUrl,
    setApiKey,
    saveSettings,
    resetSettings,
    isSaving,
    saveError,
    saveSuccess,
  } = useSettings();

  const [localApiBaseUrl, setLocalApiBaseUrl] = useState(apiBaseUrl);
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(localApiBaseUrl);
    setApiKey(localApiKey);
    saveSettings();
  };

  const handleReset = () => {
    resetSettings();
    setLocalApiBaseUrl(apiBaseUrl);
    setLocalApiKey(apiKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {t('app.name')}
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/stories" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.stories')}
            </Link>
            <Link href="/play" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.play')}
            </Link>
            <Link href="/settings" className="text-white font-medium">
              {t('nav.settings')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('settings.title')}</h1>
          <p className="text-gray-400 mb-8">{t('settings.subtitle')}</p>

          <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">{t('settings.apiConfig')}</h2>
            
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="apiBaseUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  {t('settings.baseUrl')}
                </label>
                <input
                  type="text"
                  id="apiBaseUrl"
                  value={localApiBaseUrl}
                  onChange={(e) => setLocalApiBaseUrl(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="http://localhost:8000"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
                  {t('settings.apiKey')}
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="sk-..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {isSaving ? '...' : t('settings.save')}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-700 rounded-md font-medium hover:bg-gray-600 transition-colors"
                >
                  {t('settings.reset')}
                </button>
              </div>
              
              {saveSuccess && (
                <div className="mt-4 p-2 bg-green-800/50 border border-green-700 rounded text-green-300">
                  {t('settings.saveSuccess')}
                </div>
              )}
              
              {saveError && (
                <div className="mt-4 p-2 bg-red-800/50 border border-red-700 rounded text-red-300">
                  {saveError}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800/30 border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">©{t('footer.copyright')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.about')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
