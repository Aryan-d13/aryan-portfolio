import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { useBootSequence, type BootStep } from '../../hooks/useBootSequence';
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
  const loaderConfig = config.loader;

  const { isReady, step, statusText, progress, activeTheme, offline } = useBootSequence({
    enabled: loaderConfig?.enabled ?? true,
    minimumDuration: loaderConfig?.minimumDuration ?? 600,
    maxWaitTime: loaderConfig?.maxWaitTime ?? 1500,
  });

  const [loaderMounted, setLoaderMounted] = useState(() => {
    return loaderConfig?.enabled ?? true;
  });

  const [transitionDone, setTransitionDone] = useState(false);

  useEffect(() => {
    if (isReady) {
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduceMotion ? 100 : 600;
      const timer = setTimeout(() => {
        setTransitionDone(true);
      }, duration + 100);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  const handleExitComplete = () => {
    setLoaderMounted(false);
  };

  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const contentStyle = transitionDone ? {} : {
    opacity: isReady ? 1 : 0,
    transform: isReady ? 'scale(1)' : 'scale(1.01)',
    transition: reduceMotion
      ? 'opacity 100ms linear'
      : 'opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <BootContext.Provider value={{ isReady, step, statusText, progress, activeTheme, offline }}>
      {/* Cinematic fade-in wrap */}
      <div 
        className="app-boot-content-wrap" 
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
