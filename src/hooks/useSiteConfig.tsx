import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SiteConfig } from '../types/siteConfig';
import { loadConfig, applyConfigToCSS, normalizeSiteConfig } from '../config/configManager';
import { getThemeBootstrapSnapshot } from '../utils/themeBootstrap';

interface ConfigContextValue {
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [bootstrapSnapshot] = useState(() => getThemeBootstrapSnapshot());
  const [config, setConfigState] = useState<SiteConfig>(() => {
    const bootstrappedConfig = bootstrapSnapshot?.siteConfig ?? null;
    return bootstrappedConfig ? normalizeSiteConfig(bootstrappedConfig) : loadConfig();
  });

  const setConfig = useCallback((newConfig: SiteConfig) => {
    const normalized = normalizeSiteConfig(newConfig);
    setConfigState(normalized);
    applyConfigToCSS(normalized);
  }, []);

  useEffect(() => {
    if (bootstrapSnapshot) return;
    applyConfigToCSS(config);
  }, [bootstrapSnapshot]); // eslint-disable-line react-hooks/exhaustive-deps

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
