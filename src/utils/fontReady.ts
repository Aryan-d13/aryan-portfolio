export function waitForFonts(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    return document.fonts.ready.then(() => {}).catch(() => {});
  }
  return Promise.resolve();
}
