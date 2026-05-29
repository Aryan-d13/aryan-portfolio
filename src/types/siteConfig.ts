// ─── SITE CONFIG TYPES ──────────────────────────────────────────
import type { TypographySystemConfig } from './typographyConfig';

export interface CtaLink {
  text: string;
  href: string;
}

export interface PortraitCaption {
  label: string;
  value: string;
}

export interface IdentityConfig {
  name: string;
  handle: string;
  roleLines: string[];
  location: string;
  email: string;
  shortBio: string;
  heroStatement: string;
  heroStatementDirect: string;
  heroKicker: string;
  brandSubtitle: string;
  brandGlyph: string;
  ctaPrimary: CtaLink;
  ctaSecondary: CtaLink;
  metadata: Record<string, string>;
  portraitCaption: PortraitCaption;
  portraitAlt: string;
}

export interface SectionConfig {
  id: string;
  sectionId: string;
  signal: string;
  proofLevel: string;
  systemStatus: string;
  type: 'hero' | 'statement' | 'projects' | 'proof' | 'stack' | 'philosophy' | 'human' | 'timeline' | 'contact';
  title: string;
  kicker: string;
  railLabel?: string;
  heading?: string;
  descriptionAtmospheric?: string;
  descriptionDirect?: string;
  bodyAtmospheric?: string;
  bodyDirect?: string;
  visible: boolean;
  order: number;
  animationStyle: string;
  backgroundIntensity: number;
}

export interface ProjectConfig {
  id: string;
  name: string;
  caseNumber: string;
  type: string;
  featured: boolean;
  status: string;
  confidenceLabel: string;
  storyDescription: string[];
  systemDescription: string;
  systemFlow: string[];
  problem: string;
  system: string;
  stack: string;
  proofThemes: string;
  shows: string;
  links: Record<string, string>;
}

export interface ProofCard {
  id: string;
  index: string;
  title: string;
  description: string;
  accentColor: string | null;
  visible: boolean;
  order: number;
}

export interface SkillGroup {
  id: string;
  name: string;
  description: string;
  skills: string[];
  displayStyle: 'matrix' | 'chips' | 'compact' | 'terminal';
  order: number;
}

export interface PhilosophyLine {
  id: string;
  text: string;
  intensity: 'quiet' | 'sharp' | 'loud';
  largeType: boolean;
  order: number;
}

export interface Motif {
  id: string;
  text: string;
  symbol: string;
  visible: boolean;
  order: number;
}

export interface HumanLayerConfig {
  motifs: Motif[];
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  visible: boolean;
  order: number;
}

export interface CustomLink {
  label: string;
  href: string;
}

export interface ContactConfig {
  email: string;
  handle: string;
  location: string;
  ctaText: string;
  ctaLink: string;
  resumeLink: string;
  resumeLabel: string;
  githubLink: string;
  linkedinLink: string;
  socialLinks: string[];
  customLinks: CustomLink[];
}

export interface TypographyConfig {
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  baseFontSize: string;
  headingScale: number;
  lineHeight: number;
  letterSpacing: string;
  headingWeight: number;
  bodyWeight: number;
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

export interface ColorsConfig {
  bg: string;
  bgSecondary: string;
  panel: string;
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
  selection: string;
}

export interface BackgroundConfig {
  enabled: boolean;
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
  animationSpeed: number;
  animationIntensity: number;
  vignetteOpacity: number;
  noiseOpacity: number;
}

export interface MotionConfig {
  enabled: boolean;
  reducedMotion: boolean;
  revealType: 'translateY' | 'fadeIn' | 'scale' | 'none';
  revealDuration: number;
  revealDelay: number;
  hoverGlowIntensity: number;
  projectExpansionSpeed: number;
  commandPaletteEnabled: boolean;
  scrollParallaxIntensity: number;
  cursorBlinkEnabled: boolean;
  rainNoiseEnabled: boolean;
  durationFast: number;
  durationStandard: number;
  durationSlow: number;
}

export interface LayoutConfig {
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
  densityMode: 'compact' | 'balanced' | 'cinematic';
  headerHeight: string;
}

export interface SeoConfig {
  pageTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
  themeColor: string;
}

export interface AssetsConfig {
  profileImage: string;
  resumeFile: string;
  ogImage: string;
  customLogo: string;
  projectImages: Record<string, string>;
  backgroundTextures: Record<string, string>;
}

export interface CommandEntry {
  label: string;
  target: string;
  openProject: string | null;
  kbd: string;
}

export interface CommandPaletteConfig {
  title: string;
  description: string;
  commands: CommandEntry[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ThemeEngineConfig {
  publicSelectorEnabled: boolean;
}

export interface PortraitMetadata {
  label: string;
  value: string;
}

export interface PortraitEffects {
  vignette: number;
  glow: number;
  grain: number;
  hoverLift: boolean;
  scrollReveal: boolean;
}

export interface PortraitConfig {
  enabled: boolean;
  src: string;
  alt: string;
  placement: 'hero' | 'human-layer' | 'floating-card' | 'cinematic-panel' | 'hidden';
  variant: 'editorial' | 'identity-card' | 'bento' | 'archive' | 'cinematic-panel';
  aspectRatio: string;
  objectPosition: string;
  showMetadata: boolean;
  metadata: PortraitMetadata[];
  effects: PortraitEffects;
}

export interface SiteConfig {
  _version: number;
  _lastModified: string | null;
  identity: IdentityConfig;
  sections: SectionConfig[];
  projects: ProjectConfig[];
  proofCards: ProofCard[];
  skillGroups: SkillGroup[];
  philosophy: PhilosophyLine[];
  humanLayer: HumanLayerConfig;
  timeline: TimelineEntry[];
  contact: ContactConfig;
  typography: TypographyConfig;
  typographySystem: TypographySystemConfig;
  colors: ColorsConfig;
  background: BackgroundConfig;
  motion: MotionConfig;
  layout: LayoutConfig;
  seo: SeoConfig;
  assets: AssetsConfig;
  commandPalette: CommandPaletteConfig;
  navigation: NavItem[];
  themeEngine: ThemeEngineConfig;
  portrait: PortraitConfig;
}

// ─── EDITOR TYPES ───────────────────────────────────────────────

export interface NavGroupItem {
  id: string;
  label: string;
  index: string;
}

export interface NavGroup {
  label: string;
  items: NavGroupItem[];
}

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
