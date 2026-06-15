import { useEffect, useRef, useState } from 'react';
import type { ThemeDefinition } from '../themes/themeTypes';
import { preloadCriticalAssets } from '../utils/preloadAssets';

export type BootStep =
  | 'booting'
  | 'loading-cache'
  | 'preloading-portrait'
  | 'preloading-fonts'
  | 'ready';

export interface UseBootSequenceOptions {
  enabled?: boolean;
  minimumDuration?: number;
  maxWaitTime?: number;
  activeTheme?: ThemeDefinition | null;
  portraitSrc?: string;
}

export interface UseBootSequenceResult {
  isReady: boolean;
  step: BootStep;
  statusText: string;
  progress: number;
  activeTheme: ThemeDefinition | null;
  offline: boolean;
}

const STEP_STATUS_MAP: Record<BootStep, string> = {
  'booting': 'initializing trace',
  'loading-cache': 'theme bootstrap ready',
  'preloading-portrait': 'preloading portrait',
  'preloading-fonts': 'preloading fonts',
  'ready': 'opening signal',
};

const STEP_PROGRESS_MAP: Record<BootStep, number> = {
  'booting': 0,
  'loading-cache': 1,
  'preloading-portrait': 2,
  'preloading-fonts': 3,
  'ready': 5,
};

const STEP_STATUS_HOLD = 160;
const READY_STATUS_PAUSE = 180;

function wait(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

export function useBootSequence({
  enabled = true,
  minimumDuration = 0,
  maxWaitTime = 1500,
  activeTheme = null,
  portraitSrc,
}: UseBootSequenceOptions = {}): UseBootSequenceResult {
  const [step, setStep] = useState<BootStep>('booting');
  const [statusText, setStatusText] = useState<string>(STEP_STATUS_MAP.booting);
  const [isReady, setIsReady] = useState(!enabled);
  const [offline, setOffline] = useState(false);
  const activeThemeRef = useRef(activeTheme);
  const portraitSrcRef = useRef(portraitSrc);
  const runIdRef = useRef(0);
  const hasCompletedRef = useRef(!enabled);

  useEffect(() => {
    activeThemeRef.current = activeTheme;
  }, [activeTheme]);

  useEffect(() => {
    if (portraitSrc) portraitSrcRef.current = portraitSrc;
  }, [portraitSrc]);

  useEffect(() => {
    if (!enabled) {
      hasCompletedRef.current = true;
      setIsReady(true);
      setStep('ready');
      setStatusText(STEP_STATUS_MAP.ready);
      return;
    }
    if (hasCompletedRef.current) return;

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    let cancelled = false;
    const startedAt = Date.now();
    const hardCap = Math.max(0, maxWaitTime);

    const isCurrentRun = () => !cancelled && runIdRef.current === runId;
    const remainingTime = () => Math.max(0, hardCap - (Date.now() - startedAt));

    const setBootStep = (nextStep: BootStep, nextStatus = STEP_STATUS_MAP[nextStep]) => {
      if (!isCurrentRun()) return;
      setStep(nextStep);
      setStatusText(nextStatus);
    };

    const holdStep = () => wait(Math.min(STEP_STATUS_HOLD, remainingTime()));

    const runBootPipeline = async () => {
      try {
        const source = document.documentElement.dataset.themeSource;
        if (source === 'cache') setOffline(true);

        setBootStep('loading-cache');
        await holdStep();

        setBootStep('preloading-portrait');
        await preloadCriticalAssets({
          portraitSrc: portraitSrcRef.current,
          timeoutMs: remainingTime(),
          onStepComplete: (stage) => {
            if (!isCurrentRun()) return;
            if (stage === 'portrait') {
              setBootStep('preloading-fonts');
            } else if (stage === 'fonts') {
              setStatusText('fonts loaded');
            }
          },
        });
        await holdStep();

        const elapsed = Date.now() - startedAt;
        const minimumWait = Math.max(0, minimumDuration - elapsed);
        await wait(Math.min(minimumWait, remainingTime()));
      } catch {
        if (isCurrentRun()) setOffline(true);
      } finally {
        if (!isCurrentRun()) return;
        setStep('ready');
        setStatusText(STEP_STATUS_MAP.ready);
        hasCompletedRef.current = true;
        await wait(Math.min(READY_STATUS_PAUSE, remainingTime()));
        if (isCurrentRun()) setIsReady(true);
      }
    };

    void runBootPipeline();

    return () => {
      cancelled = true;
    };
  }, [enabled, maxWaitTime, minimumDuration]);

  return {
    isReady,
    step,
    statusText,
    progress: STEP_PROGRESS_MAP[step] ?? 0,
    activeTheme: activeThemeRef.current,
    offline,
  };
}
