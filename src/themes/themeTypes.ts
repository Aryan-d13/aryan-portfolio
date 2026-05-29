import type { TypographySystemConfig } from '../types/typographyConfig';

export type ThemeSource = 'built-in' | 'custom';

export type ThemeDensity = 'compact' | 'balanced' | 'cinematic' | 'editorial' | 'dense';

export type ThemeBackgroundType =
  | 'trace-grid'
  | 'soft-luxury'
  | 'starfield'
  | 'noir-document'
  | 'skyline'
  | 'diagram'
  | 'lab-grid'
  | 'blue-hour'
  | 'archive'
  | 'cosmic-debug';

export type ThemeCardStyle = 'glass' | 'quiet-luxury' | 'case-file' | 'terminal' | 'editorial' | 'lab' | 'archive' | 'cosmic';
export type ThemeButtonStyle = 'signal' | 'luxury' | 'console' | 'evidence' | 'editorial' | 'lab' | 'archive' | 'cosmic';
export type ThemeNavStyle = 'sticky-glass' | 'quiet-strip' | 'terminal-rail' | 'case-index' | 'editorial-band' | 'lab-bar';
export type ThemeMotionPersonality = 'restrained' | 'minimal' | 'atmospheric' | 'sharp' | 'scanline' | 'editorial' | 'dense' | 'cinematic' | 'archival' | 'cosmic';
export type ThemeTransitionStyle = 'crossfade' | 'scale-fade' | 'soft-wipe' | 'cover-reveal' | 'trace-sweep' | 'glow-shift';

export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  accentEmotional: string;
  accentProof: string;
  border: string;
  borderSubtle: string;
  borderStrong: string;
  glow: string;
  warning: string;
  success: string;
  selection: string;
}

export interface ThemeTypography {
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  baseFontSize: string;
  headingWeight: number;
  bodyWeight: number;
  letterSpacing: string;
  lineHeight: number;
  headingScale: number;
  sectionLabelStyle: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  typeXs: string;
  typeSm: string;
  typeBase: string;
  typeMd: string;
  typeLg: string;
  typeXl: string;
  type2xl: string;
  typeDisplay: string;
}

export interface ThemeSpacing {
  baseUnit: number;
  sectionY: string;
  containerX: string;
  cardPadding: string;
  gridGap: string;
  density: ThemeDensity;
}

export interface ThemeRadius {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  card: string;
  button: string;
  pill: string;
}

export interface ThemeBorders {
  hairline: string;
  default: string;
  strong: string;
  focus: string;
  dividerOpacity: number;
}

export interface ThemeElevation {
  ambient: string;
  raised: string;
  glow: string;
  inset: string;
  card: string;
}

export interface ThemeBackground {
  type: ThemeBackgroundType;
  dotSize: number;
  dotSpacing: number;
  dotOpacity: number;
  dotRevealOpacity: number;
  dotFieldOpacity: number;
  radialGlowColor: string;
  radialGlowOpacity: number;
  radialGlowSize: number;
  radialGlowBlur: number;
  radialGlowColor2: string;
  radialGlowOpacity2: number;
  noiseOpacity: number;
  vignetteOpacity: number;
  animationSpeed: number;
  animationIntensity: number;
  scanlineOpacity: number;
  skylineOpacity: number;
  textureOpacity: number;
}

export interface ThemeGlow {
  primary: string;
  secondary: string;
  intensity: number;
  blur: string;
  spread: string;
}

export interface ThemeMotion {
  personality: ThemeMotionPersonality;
  transitionStyle?: ThemeTransitionStyle;
  revealType: 'translateY' | 'fadeIn' | 'scale' | 'none';
  revealDuration: number;
  hoverDuration: number;
  transitionDuration: number;
  complexDuration: number;
  easingEnter: string;
  easingExit: string;
  easingState: string;
  parallaxIntensity: number;
  ambientMotionIntensity: number;
}

export interface ThemeComponents {
  cardStyle: ThemeCardStyle;
  buttonStyle: ThemeButtonStyle;
  navStyle: ThemeNavStyle;
  caseFileStyle: ThemeCardStyle;
  badgeStyle: string;
  inputStyle: string;
  cardBackground: string;
  cardBorder: string;
  cardHoverBackground: string;
  buttonBackground: string;
  buttonBorder: string;
  navBackground: string;
}

export interface ThemeLayout {
  density: ThemeDensity;
  maxContentWidth: string;
  sectionPaddingTop: string;
  sectionPaddingBottom: string;
  cardPadding: string;
  gridGap: string;
  borderRadius: string;
  panelBlur: number;
  navPosition: 'sticky' | 'fixed' | 'static';
  heroHeight: string;
  sectionAlignment: 'left' | 'center';
  headerHeight: string;
  twelveColumnGap: string;
}

export interface ThemeSectionMood {
  mood: string;
  intensity: number;
  backgroundIntensity: number;
  accent?: string;
}

export interface ThemePreview {
  vibeLabel: string;
  bestFor: string;
  densityLabel: string;
  motionLabel: string;
  swatches: string[];
  gradient: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  shortDescription: string;
  emotionalTone: string;
  designKeywords: string[];
  source: ThemeSource;
  sourceThemeId?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  typographySystem: TypographySystemConfig;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  borders: ThemeBorders;
  elevation: ThemeElevation;
  background: ThemeBackground;
  glow: ThemeGlow;
  motion: ThemeMotion;
  components: ThemeComponents;
  layout: ThemeLayout;
  sectionMoodOverrides: Record<string, ThemeSectionMood>;
  preview: ThemePreview;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ThemeExportPayload {
  _version: 1;
  exportedAt: string;
  activeThemeId: string;
  builtInThemes: ThemeDefinition[];
  customThemes: ThemeDefinition[];
}
