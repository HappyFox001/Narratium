'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL as DEFAULT_API_BASE_URL } from '../services/config';

interface SettingsContextType {
  apiBaseUrl: string;
  apiKey: string;
  setApiBaseUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  saveSettings: () => void;
  resetSettings: () => void;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  apiBaseUrl: '',
  apiKey: '',
  setApiBaseUrl: () => {},
  setApiKey: () => {},
  saveSettings: () => {},
  resetSettings: () => {},
  isSaving: false,
  saveError: null,
  saveSuccess: false,
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(DEFAULT_API_BASE_URL);
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiBaseUrl = localStorage.getItem('apiBaseUrl');
      const savedApiKey = localStorage.getItem('apiKey');
      
      if (savedApiBaseUrl) {
        setApiBaseUrl(savedApiBaseUrl);
      }
      
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    }
  }, []);

  const saveSettings = () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      localStorage.setItem('apiBaseUrl', apiBaseUrl);
      localStorage.setItem('apiKey', apiKey);
      
      // Simulate a slight delay to show the saving state
      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }, 500);
    } catch (error) {
      setIsSaving(false);
      setSaveError('Failed to save settings');
      console.error('Error saving settings:', error);
    }
  };

  const resetSettings = () => {
    setApiBaseUrl(DEFAULT_API_BASE_URL);
    setApiKey('');
    
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('apiBaseUrl');
      localStorage.removeItem('apiKey');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        apiBaseUrl,
        apiKey,
        setApiBaseUrl,
        setApiKey,
        saveSettings,
        resetSettings,
        isSaving,
        saveError,
        saveSuccess,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
