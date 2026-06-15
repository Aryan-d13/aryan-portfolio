import { createContext, useContext, useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { useBootSequence, type BootStep } from '../../hooks/useBootSequence';
import { useThemeEngine } from '../../hooks/useThemeEngine';
import { getThemeBootstrapSnapshot } from '../../utils/themeBootstrap';
import BootLoader from './BootLoader';
import type { ThemeDefinition } from '../../themes/themeTypes';

interface BootContextValue {
  isReady: boolean;
  step: BootStep;
  statusText: string;
  progress: number;
  activeTheme: ThemeDefinition | null;
  offline: boolean;
}

const BootContext = createContext<BootContextValue | null>(null);

export function BootProvider({ children }: { children: ReactNode }) {
  const { config } = useSiteConfig();
  const { activeTheme: currentTheme } = useThemeEngine();
  const [bootstrapSnapshot] = useState(() => getThemeBootstrapSnapshot());
  const loaderConfig = config.loader;
  const loaderEnabled = loaderConfig?.enabled ?? true;
  const portraitSrc = bootstrapSnapshot?.portraitSrc
    || config.portrait?.src
    || config.assets?.profileImage
    || undefined;

  const { isReady, step, statusText, progress, activeTheme, offline } = useBootSequence({
    enabled: loaderEnabled,
    minimumDuration: loaderConfig?.minimumDuration ?? 0,
    maxWaitTime: loaderConfig?.maxWaitTime ?? 1500,
    activeTheme: currentTheme,
    portraitSrc,
  });

  const [loaderMounted, setLoaderMounted] = useState(() => {
    return loaderEnabled;
  });

  const [transitionDone, setTransitionDone] = useState(!loaderEnabled);

  useEffect(() => {
    if (!loaderEnabled) {
      setLoaderMounted(false);
      setTransitionDone(true);
      return;
    }

    if (!isReady) {
      setLoaderMounted(true);
      setTransitionDone(false);
      return;
    }

    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 100 : 380;
    const timer = window.setTimeout(() => {
      setTransitionDone(true);
    }, duration + 100);
    return () => window.clearTimeout(timer);
  }, [isReady, loaderEnabled]);

  useEffect(() => {
    if (isReady) {
      setLoaderMounted(loaderEnabled);
    }
  }, [isReady, loaderEnabled]);

  useEffect(() => {
    document.documentElement.dataset.appBootReady = isReady ? 'true' : 'false';
  }, [isReady]);

  const handleExitComplete = () => {
    setLoaderMounted(false);
  };

  const contentClassName = [
    'app-boot-content-wrap',
    isReady ? 'is-ready' : 'is-booting',
    transitionDone ? 'is-settled' : '',
  ].filter(Boolean).join(' ');
  const contentStyle: CSSProperties = {
    opacity: 1,
    transform: 'none',
    pointerEvents: isReady ? 'auto' : 'none',
    transition: 'none',
  };

  return (
    <BootContext.Provider value={{ isReady, step, statusText, progress, activeTheme, offline }}>
      <div 
        className={contentClassName}
        style={contentStyle}
      >
        {children}
      </div>

      {loaderMounted && (
        <BootLoader
          step={step}
          statusText={statusText}
          progress={progress}
          activeTheme={activeTheme}
          offline={offline}
          onExitComplete={handleExitComplete}
        />
      )}
    </BootContext.Provider>
  );
}

export function useBoot(): BootContextValue {
  const ctx = useContext(BootContext);
  if (!ctx) {
    throw new Error('useBoot must be used within a BootProvider');
  }
  return ctx;
}
