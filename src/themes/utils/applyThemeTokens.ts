import type { ThemeDefinition } from '../themeTypes';
import { applyTypographyVars } from '../../utils/textEffects';
import { validateTheme } from './themeValidation';

function setVar(root: HTMLElement, name: string, value: string | number): void {
  root.style.setProperty(name, String(value));
}

export function applyThemeTokens(theme: ThemeDefinition): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.themeId = theme.id;
  root.dataset.themeBackground = theme.background.type;
  root.dataset.themeDensity = theme.layout.density;
  root.dataset.themeCard = theme.components.cardStyle;
  root.dataset.themeMotion = theme.motion.personality;

  setVar(root, '--color-bg', theme.colors.bg);
  setVar(root, '--color-bg-secondary', theme.colors.bgSecondary);
  setVar(root, '--color-surface', theme.colors.surface);
  setVar(root, '--color-surface-elevated', theme.colors.surfaceElevated);
  setVar(root, '--color-text', theme.colors.text);
  setVar(root, '--color-text-secondary', theme.colors.textSecondary);
  setVar(root, '--color-text-muted', theme.colors.textMuted);
  setVar(root, '--color-accent', theme.colors.accent);
  setVar(root, '--color-accent-secondary', theme.colors.accentSecondary);
  setVar(root, '--color-accent-emotional', theme.colors.accentEmotional);
  setVar(root, '--color-accent-proof', theme.colors.accentProof);
  setVar(root, '--color-border', theme.colors.border);
  setVar(root, '--color-border-subtle', theme.colors.borderSubtle);
  setVar(root, '--color-border-strong', theme.colors.borderStrong);
  setVar(root, '--color-glow', theme.colors.glow);
  setVar(root, '--color-warning', theme.colors.warning);
  setVar(root, '--color-success', theme.colors.success);

  setVar(root, '--surface-base', theme.colors.bg);
  setVar(root, '--surface-card', theme.colors.surface);
  setVar(root, '--surface-raised', theme.colors.surfaceElevated);
  setVar(root, '--text-primary', theme.colors.text);
  setVar(root, '--text-secondary', theme.colors.textSecondary);
  setVar(root, '--text-muted', theme.colors.textMuted);
  setVar(root, '--accent-primary', theme.colors.accent);
  setVar(root, '--accent-secondary', theme.colors.accentSecondary);
  setVar(root, '--accent-emotional', theme.colors.accentEmotional);
  setVar(root, '--accent-proof', theme.colors.accentProof);
  setVar(root, '--line-default', theme.colors.border);
  setVar(root, '--line-subtle', theme.colors.borderSubtle);
  setVar(root, '--line-strong', theme.colors.borderStrong);

  setVar(root, '--font-display', theme.typography.displayFont);
  setVar(root, '--font-body', theme.typography.bodyFont);
  setVar(root, '--font-mono', theme.typography.monoFont);
  setVar(root, '--body-line-height', theme.typography.lineHeight);
  setVar(root, '--heading-weight', theme.typography.headingWeight);
  setVar(root, '--body-weight', theme.typography.bodyWeight);
  setVar(root, '--letter-spacing', theme.typography.letterSpacing);
  setVar(root, '--heading-scale', theme.typography.headingScale);
  setVar(root, '--type-xs', theme.typography.typeXs);
  setVar(root, '--type-sm', theme.typography.typeSm);
  setVar(root, '--type-base', theme.typography.typeBase);
  setVar(root, '--type-md', theme.typography.typeMd);
  setVar(root, '--type-lg', theme.typography.typeLg);
  setVar(root, '--type-xl', theme.typography.typeXl);
  setVar(root, '--type-2xl', theme.typography.type2xl);
  setVar(root, '--type-display', theme.typography.typeDisplay);
  applyTypographyVars(root, theme.typographySystem, theme);

  setVar(root, '--space-section-y', theme.spacing.sectionY);
  setVar(root, '--space-container-x', theme.spacing.containerX);
  setVar(root, '--space-card-padding', theme.spacing.cardPadding);
  setVar(root, '--space-grid-gap', theme.spacing.gridGap);
  setVar(root, '--space-base-unit', `${theme.spacing.baseUnit}px`);

  setVar(root, '--radius-1', theme.radius.sm);
  setVar(root, '--radius-2', theme.radius.md);
  setVar(root, '--radius-card', theme.radius.card);
  setVar(root, '--radius-button', theme.radius.button);
  setVar(root, '--radius-pill', theme.radius.pill);

  setVar(root, '--border-hairline', theme.borders.hairline);
  setVar(root, '--border-default', theme.borders.default);
  setVar(root, '--border-strong', theme.borders.strong);
  setVar(root, '--border-divider-opacity', theme.borders.dividerOpacity);

  setVar(root, '--shadow-ambient', theme.elevation.ambient);
  setVar(root, '--shadow-raised', theme.elevation.raised);
  setVar(root, '--shadow-glow', theme.elevation.glow);
  setVar(root, '--shadow-inset', theme.elevation.inset);
  setVar(root, '--shadow-card', theme.elevation.card);

  setVar(root, '--background-dot-size', `${theme.background.dotSize}px`);
  setVar(root, '--background-dot-spacing', `${theme.background.dotSpacing}px`);
  setVar(root, '--background-dot-opacity', theme.background.dotOpacity);
  setVar(root, '--background-dot-opacity-pct', `${Math.round(theme.background.dotOpacity * 100)}%`);
  setVar(root, '--background-dot-reveal-opacity', theme.background.dotRevealOpacity);
  setVar(root, '--background-dot-field-opacity', theme.background.dotFieldOpacity);
  setVar(root, '--background-radial-glow-color', theme.background.radialGlowColor);
  setVar(root, '--background-radial-glow-opacity', theme.background.radialGlowOpacity);
  setVar(root, '--background-radial-glow-opacity-pct', `${Math.round(theme.background.radialGlowOpacity * 100)}%`);
  setVar(root, '--background-radial-glow-size', `${theme.background.radialGlowSize}%`);
  setVar(root, '--background-radial-glow-blur', `${theme.background.radialGlowBlur}px`);
  setVar(root, '--background-radial-glow-color-2', theme.background.radialGlowColor2);
  setVar(root, '--background-radial-glow-opacity-2', theme.background.radialGlowOpacity2);
  setVar(root, '--background-radial-glow-opacity-2-pct', `${Math.round(theme.background.radialGlowOpacity2 * 100)}%`);
  setVar(root, '--background-noise-opacity', theme.background.noiseOpacity);
  setVar(root, '--background-vignette-opacity', theme.background.vignetteOpacity);
  setVar(root, '--background-animation-speed', `${theme.background.animationSpeed}s`);
  setVar(root, '--background-animation-intensity', theme.background.animationIntensity);
  setVar(root, '--background-scanline-opacity', theme.background.scanlineOpacity);
  setVar(root, '--background-skyline-opacity', theme.background.skylineOpacity);
  setVar(root, '--background-texture-opacity', theme.background.textureOpacity);

  setVar(root, '--glow-primary', theme.glow.primary);
  setVar(root, '--glow-secondary', theme.glow.secondary);
  setVar(root, '--glow-intensity', theme.glow.intensity);
  setVar(root, '--glow-blur', theme.glow.blur);
  setVar(root, '--glow-spread', theme.glow.spread);

  setVar(root, '--duration-fast', `${theme.motion.hoverDuration}ms`);
  setVar(root, '--duration-standard', `${theme.motion.transitionDuration}ms`);
  setVar(root, '--duration-slow', `${theme.motion.complexDuration}ms`);
  setVar(root, '--duration-ui', `${Math.min(Math.max(theme.motion.hoverDuration, 100), 160)}ms`);
  setVar(root, '--duration-panel', `${Math.min(Math.max(theme.motion.transitionDuration + 80, 220), 320)}ms`);
  setVar(root, '--duration-cinematic', `${Math.min(Math.max(theme.motion.complexDuration, 360), 520)}ms`);
  setVar(root, '--motion-reveal-duration', `${theme.motion.revealDuration}ms`);
  setVar(root, '--ease-enter', theme.motion.easingEnter);
  setVar(root, '--ease-exit', theme.motion.easingExit);
  setVar(root, '--ease-standard', theme.motion.easingState);
  setVar(root, '--ease-productive', theme.motion.easingState);
  setVar(root, '--ease-expressive', theme.motion.easingEnter);
  setVar(root, '--motion-parallax-intensity', theme.motion.parallaxIntensity);
  setVar(root, '--motion-ambient-intensity', theme.motion.ambientMotionIntensity);

  setVar(root, '--component-card-bg', theme.components.cardBackground);
  setVar(root, '--component-card-border', theme.components.cardBorder);
  setVar(root, '--component-card-hover-bg', theme.components.cardHoverBackground);
  setVar(root, '--component-button-bg', theme.components.buttonBackground);
  setVar(root, '--component-button-border', theme.components.buttonBorder);
  setVar(root, '--component-nav-bg', theme.components.navBackground);
  setVar(root, '--surface-flat', colorMix(theme.colors.surface, theme.colors.bg, 0.5));
  setVar(root, '--surface-floating', colorMix(theme.colors.surfaceElevated, theme.colors.bg, 0.78));
  setVar(root, '--panel-border', colorMix(theme.colors.borderStrong, theme.colors.bg, 0.62));
  setVar(root, '--focus-ring', `0 0 0 1px ${theme.colors.bg}, 0 0 0 3px color-mix(in srgb, ${theme.colors.accentSecondary} 70%, transparent)`);
  setVar(root, '--hover-glow', `0 0 24px color-mix(in srgb, ${theme.colors.glow} 18%, transparent)`);
  setVar(root, '--press-scale', 0.985);
  setVar(root, '--status-success', theme.colors.success);
  setVar(root, '--status-warning', theme.colors.warning);
  setVar(root, '--status-error', theme.colors.accentProof);
  setVar(root, '--icon-color', theme.icons?.color ?? theme.colors.textSecondary);
  setVar(root, '--icon-muted', theme.icons?.muted ?? theme.colors.textMuted);
  setVar(root, '--icon-accent', theme.icons?.accent ?? theme.colors.accentSecondary);
  setVar(root, '--icon-success', theme.colors.success);
  setVar(root, '--icon-warning', theme.colors.warning);
  setVar(root, '--icon-error', theme.colors.accentProof);
  setVar(root, '--icon-stroke', theme.icons?.strokeWidth ?? 1.8);
  setVar(root, '--icon-hover-glow', `0 0 16px color-mix(in srgb, ${theme.icons?.accent ?? theme.colors.accentSecondary} 24%, transparent)`);
  setVar(root, '--icon-transition', `color var(--duration-ui) var(--ease-productive), opacity var(--duration-ui) var(--ease-productive), transform var(--duration-ui) var(--ease-productive), filter var(--duration-ui) var(--ease-productive)`);
  setVar(root, '--section-icon-optical-offset', resolveSectionIconOffset(theme));

  setVar(root, '--container', theme.layout.maxContentWidth);
  setVar(root, '--layout-panel-blur', `${theme.layout.panelBlur}px`);
  setVar(root, '--header-height', theme.layout.headerHeight);
  setVar(root, '--layout-grid-gap', theme.layout.gridGap);

  setVar(root, '--admin-bg', colorMix(theme.colors.bg, theme.colors.bgSecondary, 0.84));
  setVar(root, '--admin-panel', colorMix(theme.colors.surface, theme.colors.bg, 0.72));
  setVar(root, '--admin-panel-strong', colorMix(theme.colors.surfaceElevated, theme.colors.bg, 0.76));
  setVar(root, '--admin-border', colorMix(theme.colors.borderStrong, theme.colors.bg, 0.55));
  setVar(root, '--admin-border-soft', colorMix(theme.colors.border, theme.colors.bg, 0.48));
  setVar(root, '--admin-text', theme.colors.text);
  setVar(root, '--admin-muted', colorMix(theme.colors.textMuted, theme.colors.textSecondary, 0.62));
  setVar(root, '--admin-accent', theme.colors.accentSecondary);
  setVar(root, '--admin-accent-2', theme.colors.accent);
  setVar(root, '--admin-proof', theme.colors.accentProof);
  setVar(root, '--admin-glow', `color-mix(in srgb, ${theme.colors.glow} 18%, transparent)`);
  setVar(root, '--cr-bg', 'var(--admin-bg)');
  setVar(root, '--cr-bg-2', 'var(--admin-panel)');
  setVar(root, '--cr-bg-3', 'var(--admin-panel-strong)');
  setVar(root, '--cr-bg-4', colorMix(theme.colors.surfaceElevated, theme.colors.accent, 0.82));
  setVar(root, '--cr-text', 'var(--admin-text)');
  setVar(root, '--cr-text-2', theme.colors.textSecondary);
  setVar(root, '--cr-text-3', 'var(--admin-muted)');
  setVar(root, '--cr-accent', theme.colors.accent);
  setVar(root, '--cr-accent-cyan', theme.colors.accentSecondary);
  setVar(root, '--cr-accent-glow', `color-mix(in srgb, ${theme.colors.accentSecondary} 10%, transparent)`);
  setVar(root, '--cr-border', 'var(--admin-border-soft)');
  setVar(root, '--cr-border-2', 'var(--admin-border)');
  setVar(root, '--cr-border-focus', theme.colors.accentSecondary);
  setVar(root, '--cr-success', theme.colors.success);
  setVar(root, '--cr-warning', theme.colors.warning);
  setVar(root, '--cr-danger', theme.colors.accentProof);
  setVar(root, '--cr-danger-bg', `color-mix(in srgb, ${theme.colors.accentProof} 10%, transparent)`);
  setVar(root, '--cr-status-success', theme.colors.success);
  setVar(root, '--cr-status-warning', theme.colors.warning);
  setVar(root, '--cr-status-error', theme.colors.accentProof);
  setVar(root, '--cr-focus-ring', `0 0 0 1px ${theme.colors.bg}, 0 0 0 3px color-mix(in srgb, ${theme.colors.accentSecondary} 58%, transparent)`);
  setVar(root, '--cr-font-body', theme.typography.bodyFont);
  setVar(root, '--cr-font-mono', theme.typography.monoFont);
  setVar(root, '--cr-font-display', theme.typography.displayFont);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', theme.colors.bg);
}

function colorMix(a: string, b: string, aPercent: number): string {
  return `color-mix(in srgb, ${a} ${Math.round(aPercent * 100)}%, ${b})`;
}

function resolveSectionIconOffset(theme: ThemeDefinition): string {
  if (theme.layout.density === 'compact' || theme.layout.density === 'dense') return 'clamp(5px, 0.78vw, 9px)';
  if (theme.layout.density === 'editorial') return 'clamp(6px, 0.9vw, 11px)';
  return 'clamp(6px, 0.85vw, 10px)';
}

function resolveTransitionStyle(theme: ThemeDefinition): string {
  if (theme.motion.transitionStyle) return theme.motion.transitionStyle;
  if (theme.motion.personality === 'scanline' || theme.motion.personality === 'restrained') return 'trace-sweep';
  if (theme.motion.personality === 'cosmic' || theme.motion.personality === 'atmospheric') return 'glow-shift';
  if (theme.motion.personality === 'sharp' || theme.motion.personality === 'archival') return 'soft-wipe';
  return 'scale-fade';
}

export function startThemeTransition(duration = 420, style = 'trace-sweep'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.dataset.themeTransitionStyle = style;
  root.classList.add('theme-transitioning');
  window.setTimeout(() => root.classList.remove('theme-transitioning'), duration);
}

interface ApplyThemeOptions {
  transition?: boolean;
}

export function applyTheme(theme: ThemeDefinition, options: ApplyThemeOptions = {}): boolean {
  if (typeof document === 'undefined') return false;
  const validation = validateTheme(theme);
  if (!validation.valid) {
    console.warn('[ThemeEngine] Refused invalid theme:', validation.errors);
    return false;
  }

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bootReady = root.dataset.appBootReady === 'true';
  const style = reduceMotion ? 'crossfade' : resolveTransitionStyle(theme);
  const duration = reduceMotion ? 140 : Math.min(Math.max(theme.motion.transitionDuration + 180, 300), 520);
  const apply = () => {
    root.dataset.themeTransitionStyle = style;
    root.style.setProperty('--theme-transition-duration', `${duration}ms`);
    applyThemeTokens(theme);
  };

  if (options.transition === false || reduceMotion || !bootReady) {
    apply();
    return true;
  }

  startThemeTransition(duration, style);
  const inIframe = typeof window !== 'undefined' && window.self !== window.top;
  if (!inIframe && typeof document.startViewTransition === 'function') {
    document.startViewTransition(apply).finished.catch(() => undefined);
    return true;
  }

  apply();
  return true;
}
