import type { ThemeDefinition, ThemeExportPayload } from '../themeTypes';
import { DEFAULT_THEME_ID, builtInThemeIds, builtInThemes, cloneTheme, getDefaultTheme, getThemeById, getBuiltInTheme } from '../themeRegistry';
import { validateTheme, validateThemes } from './themeValidation';

export const ACTIVE_THEME_KEY = 'aryan_theme_engine_active_theme_id';
export const CUSTOM_THEMES_KEY = 'aryan_theme_engine_custom_themes';
export const DRAFT_THEME_KEY = 'aryan_theme_engine_draft_theme';

function canUseStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadActiveThemeId(): string {
  if (!canUseStorage()) return DEFAULT_THEME_ID;
  const id = localStorage.getItem(ACTIVE_THEME_KEY);
  return id || DEFAULT_THEME_ID;
}

export function saveActiveThemeId(id: string): void {
  if (!canUseStorage()) return;
  localStorage.setItem(ACTIVE_THEME_KEY, id);
}

export function loadCustomThemes(): ThemeDefinition[] {
  if (!canUseStorage()) return [];
  const parsed = safeParse<unknown[]>(localStorage.getItem(CUSTOM_THEMES_KEY), []);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(theme => validateTheme(theme).valid)
    .map(theme => ({ ...(theme as ThemeDefinition), source: 'custom' as const }))
    .filter(theme => !builtInThemeIds.has(theme.id));
}

export function saveCustomThemes(themes: ThemeDefinition[]): void {
  if (!canUseStorage()) return;
  const safeThemes = themes
    .filter(theme => theme.source === 'custom')
    .filter(theme => validateTheme(theme).valid)
    .filter(theme => !builtInThemeIds.has(theme.id));
  localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(safeThemes));
}

export function loadDraftTheme(): ThemeDefinition | null {
  if (!canUseStorage()) return null;
  const parsed = safeParse<unknown | null>(localStorage.getItem(DRAFT_THEME_KEY), null);
  if (!parsed || !validateTheme(parsed).valid) return null;
  return parsed as ThemeDefinition;
}

export function saveDraftTheme(theme: ThemeDefinition | null): void {
  if (!canUseStorage()) return;
  if (!theme) {
    localStorage.removeItem(DRAFT_THEME_KEY);
    return;
  }
  localStorage.setItem(DRAFT_THEME_KEY, JSON.stringify(theme));
}

export function resolveActiveTheme(activeThemeId: string, customThemes: ThemeDefinition[], draftTheme?: ThemeDefinition | null): ThemeDefinition {
  let theme: ThemeDefinition;
  if (draftTheme?.id === activeThemeId && validateTheme(draftTheme).valid) {
    theme = draftTheme;
  } else {
    theme = getThemeById(activeThemeId, customThemes) ?? getDefaultTheme();
  }

  const builtIn = getBuiltInTheme(theme.id) ?? (theme.sourceThemeId ? getBuiltInTheme(theme.sourceThemeId) : undefined);
  if (builtIn) {
    return {
      ...builtIn,
      ...theme,
      colors: { ...builtIn.colors, ...theme.colors },
      typography: { ...builtIn.typography, ...theme.typography },
      spacing: { ...builtIn.spacing, ...theme.spacing },
      radius: { ...builtIn.radius, ...theme.radius },
      borders: { ...builtIn.borders, ...theme.borders },
      elevation: { ...builtIn.elevation, ...theme.elevation },
      background: { ...builtIn.background, ...theme.background },
      glow: { ...builtIn.glow, ...theme.glow },
      motion: { ...builtIn.motion, ...theme.motion },
      components: { ...builtIn.components, ...theme.components },
      layout: { ...builtIn.layout, ...theme.layout },
    };
  }

  return theme;
}

export function createThemeExport(activeThemeId: string, customThemes: ThemeDefinition[]): ThemeExportPayload {
  return {
    _version: 1,
    exportedAt: new Date().toISOString(),
    activeThemeId,
    builtInThemes: builtInThemes.map(cloneTheme),
    customThemes: customThemes.map(cloneTheme),
  };
}

export function parseThemeImport(json: string): { success: boolean; customThemes: ThemeDefinition[]; activeThemeId?: string; errors: string[] } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    return { success: false, customThemes: [], errors: [`Invalid JSON: ${(error as Error).message}`] };
  }

  const themes = Array.isArray(parsed)
    ? parsed
    : (parsed as Partial<ThemeExportPayload>)?.customThemes ?? (parsed as Partial<ThemeExportPayload>)?.builtInThemes ?? [];

  if (!Array.isArray(themes)) {
    return { success: false, customThemes: [], errors: ['Theme import must contain a themes array'] };
  }

  const validation = validateThemes(themes);
  if (!validation.valid) return { success: false, customThemes: [], errors: validation.errors };

  const customThemes = (themes as ThemeDefinition[])
    .map(theme => ({
      ...cloneTheme(theme),
      id: builtInThemeIds.has(theme.id) ? `${theme.id}-imported-${Date.now()}` : theme.id,
      source: 'custom' as const,
      sourceThemeId: builtInThemeIds.has(theme.id) ? theme.id : theme.sourceThemeId,
      updatedAt: new Date().toISOString(),
    }))
    .filter(theme => validateTheme(theme).valid);

  const activeThemeId = (parsed as Partial<ThemeExportPayload>)?.activeThemeId;
  return {
    success: true,
    customThemes,
    activeThemeId: typeof activeThemeId === 'string' ? activeThemeId : undefined,
    errors: [],
  };
}

export function downloadThemeJson(payload: ThemeExportPayload, filename = 'aryan-theme-engine.json'): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

