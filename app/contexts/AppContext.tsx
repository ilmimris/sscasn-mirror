"use client"

import React, { createContext, useState, ReactNode } from 'react';

type AppContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'en' | 'id';
  setLanguage: (lang: 'en' | 'id') => void;
};

export const AppContext = createContext<AppContextType>({
  isDarkMode: false,
  toggleDarkMode: () => { },
  language: 'en',
  setLanguage: () => { },
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'id'>('en');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AppContext.Provider value={{
      isDarkMode, toggleDarkMode,
      language, setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};