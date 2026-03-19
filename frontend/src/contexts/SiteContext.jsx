import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../services/api';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSiteData = async () => {
    setLoading(true);
    const [settingsResponse, categoriesResponse] = await Promise.all([
      publicApi.getSettings(),
      publicApi.getCategories()
    ]);
    setSettings(settingsResponse.settings);
    setCategories(categoriesResponse.items);
    setLoading(false);
  };

  useEffect(() => {
    refreshSiteData().catch(() => {
      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      categories,
      loading,
      refreshSiteData
    }),
    [settings, categories, loading]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error('useSite must be used within SiteProvider');
  }

  return context;
};
