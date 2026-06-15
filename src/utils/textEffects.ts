import type { SiteConfig } from '../types/siteConfig';
import type {
  TextEffect,
  TextMotion,
  TextTexture,
  TextTreatmentConfig,
  TextTreatmentSlot,
  TypographyPresetName,
  TypographySystemConfig,
  TypographyValidationWarning,
} from '../types/typographyConfig';
import type { ThemeDefinition } from '../themes/themeTypes';
import { clampNumber, toMs } from './motionSafety';

export const TEXT_EFFECT_OPTIONS: { value: TextEffect; label: string }[] = [
  { value: 'clean-readable', label: 'Clean Readable' },
  { value: 'mono-signal', label: 'Mono Signal' },
  { value: 'kinetic-masked-gradient', label: 'Kinetic Masked Gradient' },
  { value: 'outline-layered', label: 'Outline Layered' },
  { value: 'soft-luxury', label: 'Soft Luxury' },
  { value: 'masked-cosmic', label: 'Masked Cosmic' },
  { value: 'noir-sliced', label: 'Noir Sliced' },
  { value: 'terminal-scan', label: 'Terminal Scan' },
  { value: 'editorial-ghost', label: 'Editorial Ghost' },
  { value: 'casefile-solid-with-metadata', label: 'Case File Solid' },
  { value: 'lab-status', label: 'Lab Status' },
  { value: 'archive-grain', label: 'Archive Grain' },
  { value: 'blue-hour-texture', label: 'Blue Hour Texture' },
  { value: 'cosmic-debug', label: 'Cosmic Debug' },
  { value: 'sharp-editorial', label: 'Sharp Editorial' },
];

export const TEXT_MOTION_OPTIONS: { value: TextMotion; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'soft-reveal', label: 'Soft Reveal' },
  { value: 'clip-reveal', label: 'Clip Reveal' },
  { value: 'stagger-reveal', label: 'Stagger Reveal' },
  { value: 'sliced-reveal', label: 'Sliced Reveal' },
  { value: 'terminal-reveal', label: 'Terminal Reveal' },
];

export const TEXT_TEXTURE_OPTIONS: { value: TextTexture; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'subtle-noise', label: 'Subtle Noise' },
  { value: 'rain', label: 'Rain' },
  { value: 'archive-grain', label: 'Archive Grain' },
  { value: 'cosmic', label: 'Cosmic' },
];

export const TYPOGRAPHY_PRESET_NAMES: TypographyPresetName[] = [
  'Clean Signal',
  'Editorial Ghost',
  'Kinetic Nocturne',
  'Proof Archive',
  'Cosmic Mask',
  'Noir Case File',
  'Soft Luxury',
  'Terminal Scan',
  'Human Blue Hour',
  'Experimental Controlled',
];

const slots: TextTreatmentSlot[] = [
  'body',
  'metadata',
  'heroHeadline',
  'identityStatement',
  'sectionTitle',
  'projectTitle',
  'manifestoLine',
  'contactHeading',
];

function treatment(
  effect: TextEffect,
  intensity: number,
  motion: TextMotion,
  texture: TextTexture,
  glow: number,
  outline: number,
): TextTreatmentConfig {
  return { effect, intensity, motion, texture, glow, outline };
}

const cleanBody = treatment('clean-readable', 0, 'none', 'none', 0, 0);

export const DEFAULT_TYPOGRAPHY_SYSTEM: TypographySystemConfig = {
  presetName: 'Kinetic Nocturne',
  treatments: {
    body: cleanBody,
    metadata: treatment('mono-signal', 0.24, 'none', 'none', 0.02, 0),
    heroHeadline: treatment('kinetic-masked-gradient', 0.62, 'stagger-reveal', 'subtle-noise', 0.14, 0.34),
    identityStatement: treatment('sharp-editorial', 0.42, 'clip-reveal', 'none', 0.04, 0.12),
    sectionTitle: treatment('outline-layered', 0.34, 'clip-reveal', 'none', 0.05, 0.44),
    projectTitle: treatment('casefile-solid-with-metadata', 0.44, 'soft-reveal', 'none', 0.04, 0.16),
    manifestoLine: treatment('sharp-editorial', 0.5, 'clip-reveal', 'none', 0.06, 0.18),
    contactHeading: treatment('terminal-scan', 0.3, 'soft-reveal', 'none', 0.05, 0.08),
  },
  controls: {
    animationIntensity: 0.62,
    glowIntensity: 0.12,
    outlineThickness: 1,
    strokeOpacity: 0.26,
    maskedTextureOpacity: 0.22,
    grainAmount: 0.08,
    kineticStaggerDelay: 54,
    revealDuration: 460,
    letterSpacing: '0',
    lineHeight: 1.6,
    headingScale: 1,
    caseBehavior: 'theme',
    pathTextEnabled: false,
    glitchEnabled: false,
    readingMode: false,
    reducedMotionBehavior: 'respect-system',
  },
};

const presetOverrides: Record<TypographyPresetName, Partial<TypographySystemConfig>> = {
  'Clean Signal': {
    presetName: 'Clean Signal',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('clean-readable', 0.25, 'soft-reveal', 'none', 0.04, 0.08),
      sectionTitle: treatment('clean-readable', 0.18, 'soft-reveal', 'none', 0.02, 0),
      manifestoLine: treatment('sharp-editorial', 0.32, 'soft-reveal', 'none', 0.02, 0.08),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.04, animationIntensity: 0.28, pathTextEnabled: false },
  },
  'Editorial Ghost': {
    presetName: 'Editorial Ghost',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('editorial-ghost', 0.72, 'clip-reveal', 'subtle-noise', 0.06, 0.62),
      sectionTitle: treatment('outline-layered', 0.48, 'clip-reveal', 'none', 0.03, 0.58),
      manifestoLine: treatment('editorial-ghost', 0.6, 'clip-reveal', 'none', 0.03, 0.36),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, outlineThickness: 1.2, strokeOpacity: 0.34, glowIntensity: 0.06 },
  },
  'Kinetic Nocturne': DEFAULT_TYPOGRAPHY_SYSTEM,
  'Proof Archive': {
    presetName: 'Proof Archive',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('archive-grain', 0.46, 'soft-reveal', 'archive-grain', 0.03, 0.22),
      sectionTitle: treatment('casefile-solid-with-metadata', 0.42, 'clip-reveal', 'archive-grain', 0.02, 0.26),
      projectTitle: treatment('casefile-solid-with-metadata', 0.5, 'none', 'archive-grain', 0.01, 0.2),
      manifestoLine: treatment('sharp-editorial', 0.38, 'soft-reveal', 'archive-grain', 0.02, 0.14),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.03, grainAmount: 0.16, animationIntensity: 0.3, pathTextEnabled: false },
  },
  'Cosmic Mask': {
    presetName: 'Cosmic Mask',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('masked-cosmic', 0.68, 'stagger-reveal', 'cosmic', 0.18, 0.28),
      sectionTitle: treatment('masked-cosmic', 0.36, 'clip-reveal', 'cosmic', 0.08, 0.18),
      contactHeading: treatment('cosmic-debug', 0.38, 'soft-reveal', 'cosmic', 0.08, 0.12),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.15, maskedTextureOpacity: 0.34, animationIntensity: 0.58 },
  },
  'Noir Case File': {
    presetName: 'Noir Case File',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('noir-sliced', 0.56, 'sliced-reveal', 'archive-grain', 0.02, 0.2),
      sectionTitle: treatment('casefile-solid-with-metadata', 0.46, 'clip-reveal', 'archive-grain', 0.02, 0.2),
      projectTitle: treatment('casefile-solid-with-metadata', 0.56, 'none', 'none', 0.01, 0.2),
      metadata: treatment('mono-signal', 0.34, 'none', 'none', 0.01, 0),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.02, animationIntensity: 0.42, strokeOpacity: 0.2, pathTextEnabled: false },
  },
  'Soft Luxury': {
    presetName: 'Soft Luxury',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('soft-luxury', 0.48, 'soft-reveal', 'subtle-noise', 0.05, 0.24),
      sectionTitle: treatment('outline-layered', 0.3, 'soft-reveal', 'none', 0.02, 0.3),
      identityStatement: treatment('soft-luxury', 0.34, 'soft-reveal', 'none', 0.02, 0.1),
      manifestoLine: treatment('soft-luxury', 0.36, 'soft-reveal', 'none', 0.02, 0.1),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.04, animationIntensity: 0.3, headingScale: 1.04, kineticStaggerDelay: 72 },
  },
  'Terminal Scan': {
    presetName: 'Terminal Scan',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('terminal-scan', 0.52, 'terminal-reveal', 'none', 0.09, 0.14),
      sectionTitle: treatment('terminal-scan', 0.34, 'clip-reveal', 'none', 0.04, 0.08),
      contactHeading: treatment('terminal-scan', 0.42, 'terminal-reveal', 'none', 0.06, 0.08),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.08, animationIntensity: 0.48, glitchEnabled: true, pathTextEnabled: false },
  },
  'Human Blue Hour': {
    presetName: 'Human Blue Hour',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('blue-hour-texture', 0.5, 'soft-reveal', 'subtle-noise', 0.07, 0.2),
      sectionTitle: treatment('blue-hour-texture', 0.32, 'soft-reveal', 'subtle-noise', 0.03, 0.18),
      identityStatement: treatment('blue-hour-texture', 0.34, 'soft-reveal', 'subtle-noise', 0.03, 0.08),
      manifestoLine: treatment('sharp-editorial', 0.42, 'soft-reveal', 'none', 0.02, 0.12),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.06, grainAmount: 0.1, animationIntensity: 0.34 },
  },
  'Experimental Controlled': {
    presetName: 'Experimental Controlled',
    treatments: {
      ...DEFAULT_TYPOGRAPHY_SYSTEM.treatments,
      heroHeadline: treatment('cosmic-debug', 0.64, 'stagger-reveal', 'cosmic', 0.16, 0.28),
      sectionTitle: treatment('editorial-ghost', 0.42, 'clip-reveal', 'subtle-noise', 0.06, 0.32),
      metadata: treatment('terminal-scan', 0.34, 'none', 'none', 0.04, 0),
    },
    controls: { ...DEFAULT_TYPOGRAPHY_SYSTEM.controls, glowIntensity: 0.13, glitchEnabled: true, maskedTextureOpacity: 0.32, animationIntensity: 0.58 },
  },
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getTypographyPreset(name: TypographyPresetName): TypographySystemConfig {
  const preset = presetOverrides[name] ?? DEFAULT_TYPOGRAPHY_SYSTEM;
  return normalizeTypographySystem(preset as TypographySystemConfig);
}

export function getTypographySystemForTheme(themeId: string): TypographySystemConfig {
  const map: Record<string, TypographyPresetName> = {
    'nocturnal-signal': 'Kinetic Nocturne',
    'soft-trace-luxury': 'Soft Luxury',
    'quantum-rain': 'Cosmic Mask',
    'noir-operating-system': 'Noir Case File',
    'skyline-terminal': 'Terminal Scan',
    'editorial-cybernetic': 'Editorial Ghost',
    'obsidian-lab': 'Clean Signal',
    'blue-hour-cinema': 'Human Blue Hour',
    'proof-archive': 'Proof Archive',
    'cosmic-debug': 'Experimental Controlled',
  };
  return getTypographyPreset(map[themeId] ?? 'Kinetic Nocturne');
}

export function normalizeTypographySystem(partial?: Partial<TypographySystemConfig> | null): TypographySystemConfig {
  const base = deepClone(DEFAULT_TYPOGRAPHY_SYSTEM);
  if (!partial) return base;

  const presetName = partial.presetName ?? base.presetName;
  const controls = {
    ...base.controls,
    ...(partial.controls ?? {}),
  };
  const treatments = slots.reduce((acc, slot) => {
    acc[slot] = {
      ...base.treatments[slot],
      ...(partial.treatments?.[slot] ?? {}),
    };
    return acc;
  }, {} as Record<TextTreatmentSlot, TextTreatmentConfig>);

  return { presetName, controls, treatments };
}

function typographySource(configOrTheme?: SiteConfig | ThemeDefinition): TypographySystemConfig | undefined {
  return configOrTheme && 'typographySystem' in configOrTheme ? configOrTheme.typographySystem : undefined;
}

export function getTreatment(
  configOrTheme: SiteConfig | ThemeDefinition | undefined,
  slot: TextTreatmentSlot,
): TextTreatmentConfig {
  return normalizeTypographySystem(typographySource(configOrTheme)).treatments[slot];
}

export function validateTypographySystem(system?: TypographySystemConfig): TypographyValidationWarning[] {
  const normalized = normalizeTypographySystem(system);
  const warnings: TypographyValidationWarning[] = [];

  if (normalized.treatments.body.effect !== 'clean-readable') {
    warnings.push({ code: 'body-effect', message: 'Body text should stay clean-readable; decorative effects belong to display text.' });
  }
  if (normalized.treatments.body.outline > 0.1) {
    warnings.push({ code: 'outline-small', message: 'Outline-only styling is unsafe for body or small text.' });
  }
  if (normalized.controls.glowIntensity > 0.34) {
    warnings.push({ code: 'glow-high', message: 'Glow intensity is high enough to soften edges and reduce readability.' });
  }
  if (/^-/.test(normalized.controls.letterSpacing) || /[3-9]px|0\.[2-9]em/.test(normalized.controls.letterSpacing)) {
    warnings.push({ code: 'letter-spacing', message: 'Letter spacing is extreme; compact UI labels and headings may break.' });
  }
  if (normalized.controls.animationIntensity > 0.82) {
    warnings.push({ code: 'motion-high', message: 'Animation intensity is high; reduced-motion fallback should be checked.' });
  }
  const maskedSlots = Object.values(normalized.treatments).filter(item => item.effect.includes('masked'));
  if (maskedSlots.length && normalized.controls.maskedTextureOpacity < 0.08) {
    warnings.push({ code: 'masked-fallback', message: 'Masked text is active; keep the solid fallback visible enough for contrast.' });
  }

  return warnings;
}

export function applyTypographyVars(
  root: HTMLElement,
  systemInput?: TypographySystemConfig,
  themeOrConfig?: ThemeDefinition | SiteConfig,
): void {
  const system = normalizeTypographySystem(systemInput);
  const colorSource = themeOrConfig && 'colors' in themeOrConfig ? themeOrConfig.colors : undefined;
  const typographySource = themeOrConfig && 'typography' in themeOrConfig ? themeOrConfig.typography : undefined;
  const text = colorSource && 'text' in colorSource ? colorSource.text : 'var(--text-primary)';
  const accent = colorSource && 'accent' in colorSource ? colorSource.accent : 'var(--accent-primary)';
  const accentSecondary = colorSource && 'accentSecondary' in colorSource ? colorSource.accentSecondary : 'var(--accent-secondary)';
  const labelCase = system.controls.caseBehavior === 'theme'
    ? typographySource?.sectionLabelStyle ?? 'uppercase'
    : system.controls.caseBehavior;

  root.dataset.typePreset = system.presetName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  root.dataset.typeReadingMode = system.controls.readingMode || system.controls.reducedMotionBehavior === 'reading-mode' ? 'true' : 'false';
  root.dataset.typeGlitch = system.controls.glitchEnabled ? 'true' : 'false';
  root.dataset.typePath = system.controls.pathTextEnabled ? 'true' : 'false';
  root.dataset.typeReducedMotion = system.controls.reducedMotionBehavior;
  root.dataset.typeCase = labelCase;

  const glowVal = clampNumber(system.controls.glowIntensity, 0, 0.5, 0.12);
  const strokeVal = clampNumber(system.controls.strokeOpacity, 0, 1, 0.26);
  root.style.setProperty('--type-animation-intensity', String(clampNumber(system.controls.animationIntensity, 0, 1, 0.5)));
  root.style.setProperty('--type-glow-opacity', String(glowVal));
  root.style.setProperty('--type-glow-opacity-pct', `${Math.round(glowVal * 100)}%`);
  root.style.setProperty('--type-outline-width', `${clampNumber(system.controls.outlineThickness, 0, 4, 1)}px`);
  root.style.setProperty('--type-outline-opacity', String(strokeVal));
  root.style.setProperty('--type-outline-opacity-pct', `${Math.round(strokeVal * 100)}%`);
  root.style.setProperty('--type-mask-opacity', String(clampNumber(system.controls.maskedTextureOpacity, 0, 1, 0.22)));
  root.style.setProperty('--type-grain-opacity', String(clampNumber(system.controls.grainAmount, 0, 0.4, 0.08)));
  root.style.setProperty('--type-reveal-duration', toMs(system.controls.revealDuration, 460));
  root.style.setProperty('--type-stagger-delay', toMs(system.controls.kineticStaggerDelay, 54));
  root.style.setProperty('--type-letter-spacing', system.controls.letterSpacing || '0');
  root.style.setProperty('--type-line-height', String(clampNumber(system.controls.lineHeight, 1, 2.2, 1.6)));
  root.style.setProperty('--type-heading-scale', String(clampNumber(system.controls.headingScale, 0.75, 1.45, 1)));
  root.style.setProperty('--type-label-transform', labelCase === 'none' ? 'none' : labelCase);
  root.style.setProperty('--type-shadow-depth', `${Math.round(clampNumber(system.controls.glowIntensity, 0, 0.5, 0.12) * 90)}px`);
  root.style.setProperty('--type-distortion-intensity', String(clampNumber(system.controls.animationIntensity, 0, 1, 0.5)));
  root.style.setProperty('--type-gradient-start', text);
  root.style.setProperty('--type-gradient-mid', accentSecondary);
  root.style.setProperty('--type-gradient-end', accent);
}
