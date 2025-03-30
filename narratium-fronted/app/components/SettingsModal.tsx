'use client';

import React, { useState } from 'react';
import { useLanguage } from '../i18n/config';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(localApiBaseUrl);
    setApiKey(localApiKey);
    saveSettings();
    onClose();
  };

  const handleReset = () => {
    resetSettings();
    setLocalApiBaseUrl(apiBaseUrl);
    setLocalApiKey(apiKey);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
  );
};

export default SettingsModal;
