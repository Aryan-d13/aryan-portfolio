import type { ThemeDefinition, ThemeValidationResult } from '../themeTypes';

const REQUIRED_COLOR_KEYS: Array<keyof ThemeDefinition['colors']> = [
  'bg',
  'bgSecondary',
  'surface',
  'surfaceElevated',
  'text',
  'textSecondary',
  'textMuted',
  'accent',
  'accentSecondary',
  'accentEmotional',
  'accentProof',
  'border',
  'borderSubtle',
  'borderStrong',
  'glow',
  'warning',
  'success',
  'selection',
];

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function validateTheme(theme: unknown): ThemeValidationResult {
  const errors: string[] = [];
  if (!isObject(theme)) return { valid: false, errors: ['Theme must be an object'] };

  const t = theme as Partial<ThemeDefinition>;
  if (!t.id || typeof t.id !== 'string') errors.push('theme.id is required');
  if (!t.name || typeof t.name !== 'string') errors.push('theme.name is required');
  if (!t.shortDescription || typeof t.shortDescription !== 'string') errors.push('theme.shortDescription is required');
  if (!Array.isArray(t.designKeywords)) errors.push('theme.designKeywords must be an array');

  if (!isObject(t.colors)) {
    errors.push('theme.colors is required');
  } else {
    REQUIRED_COLOR_KEYS.forEach(key => {
      const value = t.colors?.[key];
      if (typeof value !== 'string' || !HEX_COLOR.test(value)) {
        errors.push(`theme.colors.${key} must be a hex color`);
      }
    });
  }

  if (!isObject(t.typography)) {
    errors.push('theme.typography is required');
  } else {
    const typography = t.typography as Record<string, unknown>;
    ['displayFont', 'bodyFont', 'monoFont', 'baseFontSize'].forEach(key => {
      if (typeof typography[key] !== 'string') errors.push(`theme.typography.${key} must be a string`);
    });
    if (typeof typography.headingWeight !== 'number') errors.push('theme.typography.headingWeight must be a number');
    if (typeof typography.bodyWeight !== 'number') errors.push('theme.typography.bodyWeight must be a number');
    if (typeof typography.lineHeight !== 'number') errors.push('theme.typography.lineHeight must be a number');
  }

  ['spacing', 'radius', 'borders', 'elevation', 'background', 'glow', 'motion', 'components', 'layout', 'preview'].forEach(key => {
    if (!isObject((t as unknown as Record<string, unknown>)[key])) errors.push(`theme.${key} is required`);
  });

  if (isObject(t.background)) {
    const background = t.background as Record<string, unknown>;
    ['dotSize', 'dotSpacing', 'dotOpacity', 'vignetteOpacity', 'animationSpeed'].forEach(key => {
      if (typeof background[key] !== 'number') errors.push(`theme.background.${key} must be a number`);
    });
  }

  if (isObject(t.motion)) {
    const motion = t.motion as Record<string, unknown>;
    ['revealDuration', 'hoverDuration', 'transitionDuration', 'complexDuration'].forEach(key => {
      if (typeof motion[key] !== 'number') errors.push(`theme.motion.${key} must be a number`);
    });
  }

  return { valid: errors.length === 0, errors };
}

export function validateThemes(themes: unknown[]): ThemeValidationResult {
  const errors: string[] = [];
  themes.forEach((theme, index) => {
    const result = validateTheme(theme);
    if (!result.valid) errors.push(...result.errors.map(error => `themes[${index}].${error}`));
  });
  return { valid: errors.length === 0, errors };
}

