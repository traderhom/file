import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  language: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  customCSS: string;
  headerBackgroundImage: string;
  footerBackgroundImage: string;
  loginBackgroundImage: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'École Supérieure des Sciences et Technologies',
    siteDescription: 'Formation d\'excellence en sciences et technologies',
    siteUrl: 'https://esst.edu',
    adminEmail: 'admin@esst.edu',
    timezone: 'Europe/Paris',
    language: 'fr',
    primaryColor: '#1A4B8C',
    secondaryColor: '#FFD700',
    logoUrl: '',
    faviconUrl: '',
    customCSS: '',
    headerBackgroundImage: '',
    footerBackgroundImage: '',
    loginBackgroundImage: ''
  });

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};