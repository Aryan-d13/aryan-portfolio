export type TextTreatmentSlot =
  | 'body'
  | 'metadata'
  | 'heroHeadline'
  | 'identityStatement'
  | 'sectionTitle'
  | 'projectTitle'
  | 'manifestoLine'
  | 'contactHeading';

export type TextEffect =
  | 'clean-readable'
  | 'mono-signal'
  | 'kinetic-masked-gradient'
  | 'outline-layered'
  | 'soft-luxury'
  | 'masked-cosmic'
  | 'noir-sliced'
  | 'terminal-scan'
  | 'editorial-ghost'
  | 'casefile-solid-with-metadata'
  | 'lab-status'
  | 'archive-grain'
  | 'blue-hour-texture'
  | 'cosmic-debug'
  | 'sharp-editorial';

export type TextMotion =
  | 'none'
  | 'soft-reveal'
  | 'clip-reveal'
  | 'stagger-reveal'
  | 'sliced-reveal'
  | 'terminal-reveal';

export type TextTexture = 'none' | 'subtle-noise' | 'rain' | 'archive-grain' | 'cosmic';

export type TextCaseBehavior = 'theme' | 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export type ReducedMotionBehavior = 'respect-system' | 'force-reduced' | 'reading-mode';

export type TypographyPresetName =
  | 'Clean Signal'
  | 'Editorial Ghost'
  | 'Kinetic Nocturne'
  | 'Proof Archive'
  | 'Cosmic Mask'
  | 'Noir Case File'
  | 'Soft Luxury'
  | 'Terminal Scan'
  | 'Human Blue Hour'
  | 'Experimental Controlled';

export interface TextTreatmentConfig {
  effect: TextEffect;
  intensity: number;
  motion: TextMotion;
  texture: TextTexture;
  glow: number;
  outline: number;
}

export interface TypographyControls {
  animationIntensity: number;
  glowIntensity: number;
  outlineThickness: number;
  strokeOpacity: number;
  maskedTextureOpacity: number;
  grainAmount: number;
  kineticStaggerDelay: number;
  revealDuration: number;
  letterSpacing: string;
  lineHeight: number;
  headingScale: number;
  caseBehavior: TextCaseBehavior;
  pathTextEnabled: boolean;
  glitchEnabled: boolean;
  readingMode: boolean;
  reducedMotionBehavior: ReducedMotionBehavior;
}

export interface TypographySystemConfig {
  presetName: TypographyPresetName;
  treatments: Record<TextTreatmentSlot, TextTreatmentConfig>;
  controls: TypographyControls;
}

export interface TypographyValidationWarning {
  code:
    | 'body-effect'
    | 'outline-small'
    | 'glow-high'
    | 'letter-spacing'
    | 'motion-high'
    | 'masked-fallback';
  message: string;
}
