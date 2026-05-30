import { useEffect, useState, useRef } from 'react';
import type { ThemeDefinition } from '../themes/themeTypes';
import { getFirebaseRuntime, firebaseConfigured } from '../lib/firebase';
import { fetchRemoteThemeState, loadCachedRemoteTheme } from '../services/themeService';
import { loadActiveThemeId, loadCustomThemes, resolveActiveTheme } from '../themes/utils/themePersistence';
import { applyTheme } from '../themes/utils/applyThemeTokens';
import { preloadCriticalAssets } from '../utils/preloadAssets';
import { useLocation } from 'react-router-dom';
import { useSiteConfig } from './useSiteConfig';

export type BootStep =
  | 'booting'
  | 'loading-cache'
  | 'loading-firebase'
  | 'resolving-theme'
  | 'preloading-portrait'
  | 'ready'
  | 'offline-fallback';

export interface UseBootSequenceOptions {
  enabled?: boolean;
  minimumDuration?: number;
  maxWaitTime?: number;
}

export interface UseBootSequenceResult {
  isReady: boolean;
  step: BootStep;
  statusText: string;
  progress: number; // 0 to 5
  activeTheme: ThemeDefinition | null;
  offline: boolean;
}

const STEP_STATUS_MAP: Record<BootStep, string> = {
  'booting': 'initializing trace',
  'loading-cache': 'loading theme memory',
  'loading-firebase': 'syncing control room',
  'resolving-theme': 'applying atmosphere',
  'preloading-portrait': 'preloading portrait',
  'ready': 'opening signal',
  'offline-fallback': 'cache mode · continuing',
};

const STEP_PROGRESS_MAP: Record<BootStep, number> = {
  'booting': 0,
  'loading-cache': 1,
  'loading-firebase': 2,
  'resolving-theme': 3,
  'preloading-portrait': 4,
  'offline-fallback': 4,
  'ready': 5,
};

export function useBootSequence({
  enabled = true,
  minimumDuration = 600,
  maxWaitTime = 1500,
}: UseBootSequenceOptions = {}): UseBootSequenceResult {
  const [step, setStep] = useState<BootStep>('booting');
  const [statusText, setStatusText] = useState<string>(STEP_STATUS_MAP.booting);
  const [isReady, setIsReady] = useState(!enabled);
  const [activeTheme, setActiveTheme] = useState<ThemeDefinition | null>(null);
  const [offline, setOffline] = useState(false);
  const location = useLocation();
  const { setConfig } = useSiteConfig();

  const bootStartTimeRef = useRef<number>(Date.now());
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasStartedRef.current) return;
    hasStartedRef.current = true;
    bootStartTimeRef.current = Date.now();

    const isAdminRoute = location.pathname.startsWith('/control-room') || location.pathname.startsWith('/admin');

    const runBootPipeline = async () => {
      // 1. Loading Cache
      setStep('loading-cache');
      setStatusText(STEP_STATUS_MAP['loading-cache']);

      let resolvedTheme: ThemeDefinition;
      const cached = loadCachedRemoteTheme();
      if (cached) {
        resolvedTheme = cached.activeTheme;
      } else {
        const localActiveId = loadActiveThemeId();
        const localCustoms = loadCustomThemes();
        resolvedTheme = resolveActiveTheme(localActiveId, localCustoms);
      }
      setActiveTheme(resolvedTheme);
      // Apply theme to DOM immediately so there is no unstyled flash
      applyTheme(resolvedTheme, { transition: false });

      // 2. Loading Firebase / remote theme sync
      setStep('loading-firebase');
      setStatusText(isAdminRoute ? 'syncing control room' : STEP_STATUS_MAP['loading-firebase']);

      let remoteFetched = false;
      let firebaseTimeoutId: any = null;

      const firebasePromise = (async () => {
        if (!firebaseConfigured) {
          setOffline(true);
          return null;
        }
        try {
          const runtime = await getFirebaseRuntime();
          if (!runtime) {
            setOffline(true);
            return null;
          }
          // Fetch remote theme state
          const remoteState = await fetchRemoteThemeState();
          return remoteState;
        } catch (e) {
          setOffline(true);
          return null;
        }
      })();

      const timeoutPromise = new Promise<null>((resolve) => {
        firebaseTimeoutId = setTimeout(() => {
          setOffline(true);
          resolve(null);
        }, maxWaitTime);
      });

      const remoteThemeState = await Promise.race([firebasePromise, timeoutPromise]);
      if (firebaseTimeoutId) clearTimeout(firebaseTimeoutId);

      // 3. Resolving active theme
      setStep('resolving-theme');
      setStatusText(offline ? 'cache mode · continuing' : STEP_STATUS_MAP['resolving-theme']);

      if (remoteThemeState) {
        const nextCustomThemes = remoteThemeState.customThemes;
        const nextActiveId = remoteThemeState.activeThemeId;
        const nextTheme = nextCustomThemes.find(t => t.id === nextActiveId) || resolvedTheme;
        resolvedTheme = nextTheme;
        setActiveTheme(nextTheme);
        applyTheme(nextTheme, { transition: false });

        if (remoteThemeState.siteConfig) {
          localStorage.setItem('aryan_identity_site_config', JSON.stringify(remoteThemeState.siteConfig));
          setConfig(remoteThemeState.siteConfig);
        }

        remoteFetched = true;
      }

      // If we timed out or failed, show offline fallback message for a tiny bit
      if (!remoteFetched && firebaseConfigured) {
        setStep('offline-fallback');
        setStatusText('cache mode · continuing');
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // 4. Preloading active theme portrait & fonts
      setStep('preloading-portrait');
      setStatusText(STEP_STATUS_MAP['preloading-portrait']);

      const portraitSrc = resolvedTheme.colors?.bg ? resolvedTheme.colors.bg : undefined; // fallback check
      // Find the portrait image path from the resolved theme config or assets
      // In SiteConfig, it is siteConfig.portrait.src, which defaults to 'assets/aryan-profile.png'
      const imageSrc = 'assets/aryan-profile.png'; // default fallback for preload

      await preloadCriticalAssets({
        portraitSrc: imageSrc,
        onStepComplete: (stage) => {
          if (stage === 'fonts') {
            setStatusText('fonts loaded');
          } else if (stage === 'portrait') {
            setStatusText('portrait preloaded');
          }
        },
      });

      // 5. Check minimum duration constraint
      const elapsedTime = Date.now() - bootStartTimeRef.current;
      const remainingTime = Math.max(0, minimumDuration - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      // 6. Ready
      setStep('ready');
      setStatusText(STEP_STATUS_MAP.ready);

      // Wait a tiny bit for the opening signal message to render
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsReady(true);
    };

    runBootPipeline();
  }, [enabled, maxWaitTime, minimumDuration, location.pathname]);

  useEffect(() => {
    if (step) {
      const text = STEP_STATUS_MAP[step] || 'initializing trace';
      // Only overwrite status text if we aren't displaying a custom sub-stage string
      if (text !== statusText && !statusText.includes('loaded') && !statusText.includes('preloaded')) {
        setStatusText(text);
      }
    }
  }, [step]);

  return {
    isReady,
    step,
    statusText,
    progress: STEP_PROGRESS_MAP[step] ?? 0,
    activeTheme,
    offline,
  };
}
