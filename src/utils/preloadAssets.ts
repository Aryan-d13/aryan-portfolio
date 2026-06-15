import { waitForFonts } from './fontReady';
import { preloadImage } from './preloadImage';

export interface PreloadOptions {
  portraitSrc?: string;
  timeoutMs?: number;
  onStepComplete?: (step: 'fonts' | 'portrait' | 'completed') => void;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return Promise.resolve(fallback);
  }

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => resolve(fallback), timeoutMs);
    promise
      .then(resolve)
      .catch(() => resolve(fallback))
      .finally(() => window.clearTimeout(timeoutId));
  });
}

export async function preloadCriticalAssets({
  portraitSrc,
  timeoutMs = 800,
  onStepComplete,
}: PreloadOptions = {}): Promise<void> {
  const safeTimeout = Math.max(0, timeoutMs);
  const tasks: Promise<void>[] = [];

  const fontsPromise = withTimeout(waitForFonts(), safeTimeout, undefined).then(() => {
    onStepComplete?.('fonts');
  });
  tasks.push(fontsPromise);

  if (portraitSrc) {
    const portraitPromise = withTimeout(preloadImage(portraitSrc), safeTimeout, undefined).then(() => {
      onStepComplete?.('portrait');
    });
    tasks.push(portraitPromise);
  } else {
    onStepComplete?.('portrait');
  }

  await Promise.all(tasks);
  onStepComplete?.('completed');
}
