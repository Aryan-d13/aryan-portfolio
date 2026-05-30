import { waitForFonts } from './fontReady';
import { preloadImage } from './preloadImage';

export interface PreloadOptions {
  portraitSrc?: string;
  onStepComplete?: (step: 'fonts' | 'portrait' | 'completed') => void;
}

export async function preloadCriticalAssets({ portraitSrc, onStepComplete }: PreloadOptions = {}): Promise<void> {
  const tasks: Promise<void>[] = [];

  // Wait for fonts
  const fontsPromise = waitForFonts().then(() => {
    onStepComplete?.('fonts');
  });
  tasks.push(fontsPromise);

  // Preload portrait
  if (portraitSrc) {
    const portraitPromise = preloadImage(portraitSrc).then(() => {
      onStepComplete?.('portrait');
    });
    tasks.push(portraitPromise);
  } else {
    // If no portrait is specified, resolve immediately
    onStepComplete?.('portrait');
  }

  await Promise.all(tasks);
  onStepComplete?.('completed');
}
