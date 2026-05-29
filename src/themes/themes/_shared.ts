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
  typeXs: '0.75rem',
  typeSm: '0.875rem',
  typeBase: '1rem',
  typeMd: '1.125rem',
  typeLg: '1.5rem',
  typeXl: '2rem',
  type2xl: 'clamp(2.5rem, 5vw, 4.5rem)',
  typeDisplay: 'clamp(4rem, 10.5vw, 8.5rem)',
};

export function defineTheme(theme: ThemeDefinition): ThemeDefinition {
  return theme;
}

