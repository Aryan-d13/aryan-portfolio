import type { ThemeDefinition, ThemeTypography } from '../themeTypes';

export const themeTimestamp = '2026-05-29T00:00:00.000Z';

export const defaultTypography: ThemeTypography = {
  displayFont: '"Space Grotesk", "Inter", "Segoe UI", sans-serif',
  bodyFont: '"Inter", "Geist", "Segoe UI", sans-serif',
  monoFont: '"JetBrains Mono", "IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
  baseFontSize: '16px',
  headingWeight: 700,
  bodyWeight: 400,
  letterSpacing: '0',
  lineHeight: 1.6,
  headingScale: 1,
  sectionLabelStyle: 'uppercase',
  typeXs: 'clamp(0.6875rem, 0.6rem + 0.35vw, 0.75rem)',
  typeSm: 'clamp(0.8125rem, 0.75rem + 0.25vw, 0.875rem)',
  typeBase: 'clamp(0.9375rem, 0.85rem + 0.35vw, 1rem)',
  typeMd: 'clamp(1.0625rem, 0.95rem + 0.45vw, 1.125rem)',
  typeLg: 'clamp(1.25rem, 1.1rem + 0.8vw, 1.5rem)',
  typeXl: 'clamp(1.75rem, 1.5rem + 1vw, 2rem)',
  type2xl: 'clamp(2.5rem, 5vw, 4.5rem)',
  typeDisplay: 'clamp(4rem, 10.5vw, 8.5rem)',
};

export function defineTheme(theme: ThemeDefinition): ThemeDefinition {
  return theme;
}

