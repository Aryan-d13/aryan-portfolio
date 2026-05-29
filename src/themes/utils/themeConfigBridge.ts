import type { SiteConfig } from '../../types/siteConfig';
import type { ThemeDefinition } from '../themeTypes';
import { cloneTheme } from '../themeRegistry';

export function mergeThemeIntoConfig(config: SiteConfig, theme: ThemeDefinition): SiteConfig {
  const next = JSON.parse(JSON.stringify(config)) as SiteConfig;

  next.colors = {
    bg: theme.colors.bg,
    bgSecondary: theme.colors.bgSecondary,
    panel: theme.colors.surfaceElevated,
    text: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
    textMuted: theme.colors.textMuted,
    accent: theme.colors.accent,
    accentSecondary: theme.colors.accentSecondary,
    accentEmotional: theme.colors.accentEmotional,
    accentProof: theme.colors.accentProof,
    border: theme.colors.border,
    borderSubtle: theme.colors.borderSubtle,
    borderStrong: theme.colors.borderStrong,
    glow: theme.colors.glow,
    selection: theme.colors.selection,
  };

  next.typography = {
    displayFont: theme.typography.displayFont,
    bodyFont: theme.typography.bodyFont,
    monoFont: theme.typography.monoFont,
    baseFontSize: theme.typography.baseFontSize,
    headingScale: theme.typography.headingScale,
    lineHeight: theme.typography.lineHeight,
    letterSpacing: theme.typography.letterSpacing,
    headingWeight: theme.typography.headingWeight,
    bodyWeight: theme.typography.bodyWeight,
    sectionLabelStyle: theme.typography.sectionLabelStyle,
    typeXs: theme.typography.typeXs,
    typeSm: theme.typography.typeSm,
    typeBase: theme.typography.typeBase,
    typeMd: theme.typography.typeMd,
    typeLg: theme.typography.typeLg,
    typeXl: theme.typography.typeXl,
    type2xl: theme.typography.type2xl,
    typeDisplay: theme.typography.typeDisplay,
  };

  next.background = {
    enabled: true,
    dotSize: theme.background.dotSize,
    dotSpacing: theme.background.dotSpacing,
    dotOpacity: theme.background.dotOpacity,
    dotRevealOpacity: theme.background.dotRevealOpacity,
    dotFieldOpacity: theme.background.dotFieldOpacity,
    radialGlowColor: theme.background.radialGlowColor,
    radialGlowOpacity: theme.background.radialGlowOpacity,
    radialGlowSize: theme.background.radialGlowSize,
    radialGlowBlur: theme.background.radialGlowBlur,
    radialGlowColor2: theme.background.radialGlowColor2,
    radialGlowOpacity2: theme.background.radialGlowOpacity2,
    animationSpeed: theme.background.animationSpeed,
    animationIntensity: theme.background.animationIntensity,
    vignetteOpacity: theme.background.vignetteOpacity,
    noiseOpacity: theme.background.noiseOpacity,
  };

  next.motion = {
    enabled: true,
    reducedMotion: false,
    revealType: theme.motion.revealType,
    revealDuration: theme.motion.revealDuration,
    revealDelay: 80,
    hoverGlowIntensity: theme.glow.intensity,
    projectExpansionSpeed: theme.motion.complexDuration,
    commandPaletteEnabled: true,
    scrollParallaxIntensity: theme.motion.parallaxIntensity,
    cursorBlinkEnabled: theme.motion.personality !== 'minimal',
    rainNoiseEnabled: theme.background.noiseOpacity > 0.025,
    durationFast: theme.motion.hoverDuration,
    durationStandard: theme.motion.transitionDuration,
    durationSlow: theme.motion.complexDuration,
  };

  next.layout = {
    maxContentWidth: theme.layout.maxContentWidth,
    sectionPaddingTop: theme.layout.sectionPaddingTop,
    sectionPaddingBottom: theme.layout.sectionPaddingBottom,
    cardPadding: theme.layout.cardPadding,
    gridGap: theme.layout.gridGap,
    borderRadius: theme.layout.borderRadius,
    panelBlur: theme.layout.panelBlur,
    navPosition: theme.layout.navPosition,
    heroHeight: theme.layout.heroHeight,
    sectionAlignment: theme.layout.sectionAlignment,
    densityMode: theme.layout.density === 'dense' ? 'compact' : theme.layout.density === 'editorial' ? 'cinematic' : theme.layout.density,
    headerHeight: theme.layout.headerHeight,
  };

  next.seo = {
    ...next.seo,
    themeColor: theme.colors.bg,
  };

  return next;
}

export function deriveThemeFromConfig(baseTheme: ThemeDefinition, config: SiteConfig): ThemeDefinition {
  const next = cloneTheme(baseTheme);
  const now = new Date().toISOString();

  next.colors = {
    ...next.colors,
    bg: config.colors.bg,
    bgSecondary: config.colors.bgSecondary,
    surface: config.colors.bgSecondary,
    surfaceElevated: config.colors.panel,
    text: config.colors.text,
    textSecondary: config.colors.textSecondary,
    textMuted: config.colors.textMuted,
    accent: config.colors.accent,
    accentSecondary: config.colors.accentSecondary,
    accentEmotional: config.colors.accentEmotional,
    accentProof: config.colors.accentProof,
    border: config.colors.border,
    borderSubtle: config.colors.borderSubtle,
    borderStrong: config.colors.borderStrong,
    glow: config.colors.glow,
    selection: config.colors.selection,
  };

  next.typography = {
    ...next.typography,
    displayFont: config.typography.displayFont,
    bodyFont: config.typography.bodyFont,
    monoFont: config.typography.monoFont,
    baseFontSize: config.typography.baseFontSize,
    headingScale: config.typography.headingScale,
    lineHeight: config.typography.lineHeight,
    letterSpacing: config.typography.letterSpacing,
    headingWeight: config.typography.headingWeight,
    bodyWeight: config.typography.bodyWeight,
    sectionLabelStyle: config.typography.sectionLabelStyle,
    typeXs: config.typography.typeXs,
    typeSm: config.typography.typeSm,
    typeBase: config.typography.typeBase,
    typeMd: config.typography.typeMd,
    typeLg: config.typography.typeLg,
    typeXl: config.typography.typeXl,
    type2xl: config.typography.type2xl,
    typeDisplay: config.typography.typeDisplay,
  };

  next.background = {
    ...next.background,
    dotSize: config.background.dotSize,
    dotSpacing: config.background.dotSpacing,
    dotOpacity: config.background.dotOpacity,
    dotRevealOpacity: config.background.dotRevealOpacity,
    dotFieldOpacity: config.background.dotFieldOpacity,
    radialGlowColor: config.background.radialGlowColor,
    radialGlowOpacity: config.background.radialGlowOpacity,
    radialGlowSize: config.background.radialGlowSize,
    radialGlowBlur: config.background.radialGlowBlur,
    radialGlowColor2: config.background.radialGlowColor2,
    radialGlowOpacity2: config.background.radialGlowOpacity2,
    animationSpeed: config.background.animationSpeed,
    animationIntensity: config.background.animationIntensity,
    vignetteOpacity: config.background.vignetteOpacity,
    noiseOpacity: config.background.noiseOpacity,
  };

  next.motion = {
    ...next.motion,
    revealType: config.motion.revealType,
    revealDuration: config.motion.revealDuration,
    hoverDuration: config.motion.durationFast,
    transitionDuration: config.motion.durationStandard,
    complexDuration: config.motion.durationSlow,
    parallaxIntensity: config.motion.scrollParallaxIntensity,
  };

  next.glow = {
    ...next.glow,
    intensity: config.motion.hoverGlowIntensity,
    primary: config.colors.accent,
    secondary: config.colors.glow,
  };

  next.spacing = {
    ...next.spacing,
    sectionY: config.layout.sectionPaddingTop,
    cardPadding: config.layout.cardPadding,
    gridGap: config.layout.gridGap,
    density: config.layout.densityMode,
  };

  next.layout = {
    ...next.layout,
    maxContentWidth: config.layout.maxContentWidth,
    sectionPaddingTop: config.layout.sectionPaddingTop,
    sectionPaddingBottom: config.layout.sectionPaddingBottom,
    cardPadding: config.layout.cardPadding,
    gridGap: config.layout.gridGap,
    borderRadius: config.layout.borderRadius,
    panelBlur: config.layout.panelBlur,
    navPosition: config.layout.navPosition,
    heroHeight: config.layout.heroHeight,
    sectionAlignment: config.layout.sectionAlignment,
    headerHeight: config.layout.headerHeight,
    density: config.layout.densityMode,
  };

  next.radius = {
    ...next.radius,
    card: config.layout.borderRadius,
    button: config.layout.borderRadius,
  };

  next.updatedAt = now;
  return next;
}

