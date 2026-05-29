import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SiteConfig } from '../types/siteConfig';
import { loadConfig, applyConfigToCSS } from '../config/configManager';

interface ConfigContextValue {
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<SiteConfig>(() => loadConfig());

  const setConfig = useCallback((newConfig: SiteConfig) => {
    setConfigState(newConfig);
    applyConfigToCSS(newConfig);
  }, []);

  useEffect(() => {
    applyConfigToCSS(config);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useSiteConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within ConfigProvider');
  return ctx;
}
