import type { ThemeDefinition } from '../themeTypes';

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
  setVar(root, '--background-dot-reveal-opacity', theme.background.dotRevealOpacity);
  setVar(root, '--background-dot-field-opacity', theme.background.dotFieldOpacity);
  setVar(root, '--background-radial-glow-color', theme.background.radialGlowColor);
  setVar(root, '--background-radial-glow-opacity', theme.background.radialGlowOpacity);
  setVar(root, '--background-radial-glow-size', `${theme.background.radialGlowSize}%`);
  setVar(root, '--background-radial-glow-blur', `${theme.background.radialGlowBlur}px`);
  setVar(root, '--background-radial-glow-color-2', theme.background.radialGlowColor2);
  setVar(root, '--background-radial-glow-opacity-2', theme.background.radialGlowOpacity2);
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
  setVar(root, '--motion-reveal-duration', `${theme.motion.revealDuration}ms`);
  setVar(root, '--ease-enter', theme.motion.easingEnter);
  setVar(root, '--ease-exit', theme.motion.easingExit);
  setVar(root, '--ease-standard', theme.motion.easingState);
  setVar(root, '--motion-parallax-intensity', theme.motion.parallaxIntensity);
  setVar(root, '--motion-ambient-intensity', theme.motion.ambientMotionIntensity);

  setVar(root, '--component-card-bg', theme.components.cardBackground);
  setVar(root, '--component-card-border', theme.components.cardBorder);
  setVar(root, '--component-card-hover-bg', theme.components.cardHoverBackground);
  setVar(root, '--component-button-bg', theme.components.buttonBackground);
  setVar(root, '--component-button-border', theme.components.buttonBorder);
  setVar(root, '--component-nav-bg', theme.components.navBackground);

  setVar(root, '--container', theme.layout.maxContentWidth);
  setVar(root, '--layout-panel-blur', `${theme.layout.panelBlur}px`);
  setVar(root, '--header-height', theme.layout.headerHeight);
  setVar(root, '--layout-grid-gap', theme.layout.gridGap);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', theme.colors.bg);
}

export function startThemeTransition(duration = 420): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('theme-transitioning');
  window.setTimeout(() => root.classList.remove('theme-transitioning'), duration);
}

