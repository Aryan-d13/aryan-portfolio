export const fallbackPortrait = '/assets/filterimages/nocturnal-signal.webp';

export const themePortraitMap: Record<string, string> = {
  'nocturnal-signal': '/assets/filterimages/nocturnal-signal.webp',
  'soft-trace-luxury': '/assets/filterimages/soft-trace-luxury.webp',
  'quantum-rain': '/assets/filterimages/quantum-rain.webp',
  'noir-operating-system': '/assets/filterimages/noir-operating-system.webp',
  'skyline-terminal': '/assets/filterimages/skyline-terminal.webp',
  'editorial-cybernetic': '/assets/filterimages/editorial-cybernetic.webp',
  'obsidian-lab': '/assets/filterimages/obsidian-lab.webp',
  'blue-hour-cinema': '/assets/filterimages/blue-hour-cinema.webp',
  'proof-archive': '/assets/filterimages/proof-archive.webp',
  'cosmic-debug': '/assets/filterimages/cosmic-debug.webp',
};

export function getPortraitForTheme(themeId?: string): string {
  if (!themeId) return fallbackPortrait;
  return themePortraitMap[themeId] ?? fallbackPortrait;
}
