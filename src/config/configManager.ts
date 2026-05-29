import type { SiteConfig } from '../types/siteConfig';
import { getDefaultConfig } from './siteConfig';
import { validateConfig, validateJsonConfig, mergeConfig } from './configSchema';

const STORAGE_KEY = 'aryan_identity_site_config';
const DRAFT_KEY = 'aryan_identity_site_config_draft';

export function loadConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return mergeConfig(getDefaultConfig() as unknown as Record<string, unknown>, parsed) as unknown as SiteConfig;
    }
  } catch (e) { console.warn('[configManager] Failed to load config:', e); }
  return getDefaultConfig();
}

export function saveConfig(config: SiteConfig): { success: boolean; errors: string[] } {
  const { valid, errors } = validateConfig(config);
  if (!valid) return { success: false, errors };
  try {
    config._lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return { success: true, errors: [] };
  } catch (e) { return { success: false, errors: [`Failed to save: ${(e as Error).message}`] }; }
}

export function saveDraft(config: SiteConfig): void {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(config)); } catch (e) { console.warn('[configManager] Failed to save draft:', e); }
}

export function loadDraft(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn('[configManager] Failed to load draft:', e); }
  return null;
}

export function clearDraft(): void { localStorage.removeItem(DRAFT_KEY); }

export function exportConfig(config: SiteConfig): string { return JSON.stringify(config, null, 2); }

export function importConfig(jsonString: string): { success: boolean; config: SiteConfig | null; errors: string[] } {
  const { valid, errors, parsed } = validateJsonConfig(jsonString);
  if (!valid || !parsed) return { success: false, config: null, errors };
  const merged = mergeConfig(getDefaultConfig() as unknown as Record<string, unknown>, parsed as unknown as Record<string, unknown>) as unknown as SiteConfig;
  return { success: true, config: merged, errors: [] };
}

export function resetToDefaults(): SiteConfig {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DRAFT_KEY);
  return getDefaultConfig();
}

export function applyConfigToCSS(config: SiteConfig): void {
  const root = document.documentElement;
  const colorMap: Record<string, string> = {
    bg: '--surface-base', bgSecondary: '--surface-card', panel: '--surface-raised',
    text: '--text-primary', textSecondary: '--text-secondary', textMuted: '--text-muted',
    accent: '--accent-primary', accentSecondary: '--accent-secondary',
    accentEmotional: '--accent-emotional', accentProof: '--accent-proof',
    border: '--line-default', borderSubtle: '--line-subtle', borderStrong: '--line-strong',
  };
  if (config.colors) {
    for (const [key, cssVar] of Object.entries(colorMap)) {
      const val = config.colors[key as keyof typeof config.colors];
      if (val) root.style.setProperty(cssVar, val);
    }
    root.style.setProperty('--color-bg', config.colors.bg);
    root.style.setProperty('--color-bg-secondary', config.colors.bgSecondary);
    root.style.setProperty('--color-surface', config.colors.bgSecondary);
    root.style.setProperty('--color-surface-elevated', config.colors.panel);
    root.style.setProperty('--color-text', config.colors.text);
    root.style.setProperty('--color-text-secondary', config.colors.textSecondary);
    root.style.setProperty('--color-text-muted', config.colors.textMuted);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-accent-secondary', config.colors.accentSecondary);
    root.style.setProperty('--color-accent-emotional', config.colors.accentEmotional);
    root.style.setProperty('--color-accent-proof', config.colors.accentProof);
    root.style.setProperty('--color-border', config.colors.border);
    root.style.setProperty('--color-border-subtle', config.colors.borderSubtle);
    root.style.setProperty('--color-border-strong', config.colors.borderStrong);
    root.style.setProperty('--color-glow', config.colors.glow);
  }
  if (config.typography) {
    const t = config.typography;
    if (t.displayFont) root.style.setProperty('--font-display', t.displayFont);
    if (t.bodyFont) root.style.setProperty('--font-body', t.bodyFont);
    if (t.monoFont) root.style.setProperty('--font-mono', t.monoFont);
    if (t.typeXs) root.style.setProperty('--type-xs', t.typeXs);
    if (t.typeSm) root.style.setProperty('--type-sm', t.typeSm);
    if (t.typeBase) root.style.setProperty('--type-base', t.typeBase);
    if (t.typeMd) root.style.setProperty('--type-md', t.typeMd);
    if (t.typeLg) root.style.setProperty('--type-lg', t.typeLg);
    if (t.typeXl) root.style.setProperty('--type-xl', t.typeXl);
    if (t.type2xl) root.style.setProperty('--type-2xl', t.type2xl);
    if (t.typeDisplay) root.style.setProperty('--type-display', t.typeDisplay);
    if (t.lineHeight) root.style.setProperty('--body-line-height', String(t.lineHeight));
    if (t.headingWeight) root.style.setProperty('--heading-weight', String(t.headingWeight));
    if (t.bodyWeight) root.style.setProperty('--body-weight', String(t.bodyWeight));
    if (t.letterSpacing) root.style.setProperty('--letter-spacing', t.letterSpacing);
    if (t.headingScale) root.style.setProperty('--heading-scale', String(t.headingScale));
  }
  if (config.background) {
    const b = config.background;
    root.style.setProperty('--background-dot-size', `${b.dotSize}px`);
    root.style.setProperty('--background-dot-spacing', `${b.dotSpacing}px`);
    root.style.setProperty('--background-dot-opacity', String(b.dotOpacity));
    root.style.setProperty('--background-dot-reveal-opacity', String(b.dotRevealOpacity));
    root.style.setProperty('--background-dot-field-opacity', String(b.dotFieldOpacity));
    root.style.setProperty('--background-radial-glow-color', b.radialGlowColor);
    root.style.setProperty('--background-radial-glow-opacity', String(b.radialGlowOpacity));
    root.style.setProperty('--background-radial-glow-color-2', b.radialGlowColor2);
    root.style.setProperty('--background-radial-glow-opacity-2', String(b.radialGlowOpacity2));
    root.style.setProperty('--background-radial-glow-blur', `${b.radialGlowBlur}px`);
    root.style.setProperty('--background-vignette-opacity', String(b.vignetteOpacity));
    root.style.setProperty('--background-animation-speed', `${b.animationSpeed}s`);
  }
  if (config.layout) {
    if (config.layout.maxContentWidth) root.style.setProperty('--container', config.layout.maxContentWidth);
    if (config.layout.headerHeight) root.style.setProperty('--header-height', config.layout.headerHeight);
    if (config.layout.borderRadius) root.style.setProperty('--radius-1', config.layout.borderRadius);
    if (config.layout.borderRadius) root.style.setProperty('--radius-card', config.layout.borderRadius);
    if (config.layout.borderRadius) root.style.setProperty('--radius-button', config.layout.borderRadius);
    if (config.layout.sectionPaddingTop) root.style.setProperty('--space-section-y', config.layout.sectionPaddingTop);
    if (config.layout.cardPadding) root.style.setProperty('--space-card-padding', config.layout.cardPadding);
    if (config.layout.gridGap) root.style.setProperty('--space-grid-gap', config.layout.gridGap);
    if (config.layout.panelBlur) root.style.setProperty('--layout-panel-blur', `${config.layout.panelBlur}px`);
  }
  if (config.motion) {
    if (config.motion.durationFast) root.style.setProperty('--duration-fast', config.motion.durationFast + 'ms');
    if (config.motion.durationStandard) root.style.setProperty('--duration-standard', config.motion.durationStandard + 'ms');
    if (config.motion.durationSlow) root.style.setProperty('--duration-slow', config.motion.durationSlow + 'ms');
    if (config.motion.revealDuration) root.style.setProperty('--motion-reveal-duration', config.motion.revealDuration + 'ms');
  }
  if (config.seo) {
    if (config.seo.pageTitle) document.title = config.seo.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && config.seo.metaDescription) metaDesc.setAttribute('content', config.seo.metaDescription);
  }
}

export function downloadConfig(config: SiteConfig, filename = 'aryan-identity-config.json'): void {
  const json = exportConfig(config);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readConfigFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
