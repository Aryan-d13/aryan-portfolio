export type Unsubscribe = () => void;
import type { SiteConfig } from '../types/siteConfig';
import type { ThemeDefinition } from '../themes/themeTypes';
import { DEFAULT_THEME_ID, builtInThemes, getThemeById } from '../themes/themeRegistry';
import { validateTheme } from '../themes/utils/themeValidation';
import { normalizeTypographySystem } from '../utils/textEffects';

export type ThemeSyncStatus = 'synced' | 'saving' | 'offline-cache' | 'failed' | 'unsaved';
export type ThemeSyncSource = 'cloud' | 'cache' | 'default';

export interface RemoteThemeState {
  activeThemeId: string;
  themeMode: 'built-in' | 'custom';
  customThemes: ThemeDefinition[];
  themeOverrides: Record<string, unknown>;
  typographySettings: ThemeDefinition['typography'] | null;
  typographySystem: ThemeDefinition['typographySystem'] | null;
  backgroundSettings: ThemeDefinition['background'] | null;
  motionSettings: ThemeDefinition['motion'] | null;
  siteConfig: SiteConfig | null;
  updatedAt: string;
  updatedBy: string | null;
  version: number;
}

export interface CachedThemeState {
  state: RemoteThemeState;
  activeTheme: ThemeDefinition;
  cachedAt: string;
}


const CACHE_KEY = 'aryan_theme_engine_remote_cache';

function nowIso(): string {
  return new Date().toISOString();
}

function canUseStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

function themeModeFor(themeId: string, customThemes: ThemeDefinition[]): 'built-in' | 'custom' {
  return customThemes.some(theme => theme.id === themeId) ? 'custom' : 'built-in';
}

function normalizeTheme(theme: ThemeDefinition): ThemeDefinition {
  return {
    ...theme,
    typographySystem: normalizeTypographySystem(theme.typographySystem),
  };
}

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => stripUndefined(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)]),
    ) as T;
  }

  return value;
}

export function createRemoteThemeState(params: {
  activeThemeId: string;
  customThemes: ThemeDefinition[];
  activeTheme?: ThemeDefinition;
  version?: number;
  updatedBy?: string | null;
  siteConfig?: SiteConfig | null;
}): RemoteThemeState {
  const activeTheme = params.activeTheme ? normalizeTheme(params.activeTheme) : null;
  return {
    activeThemeId: params.activeThemeId,
    themeMode: themeModeFor(params.activeThemeId, params.customThemes),
    customThemes: params.customThemes.map(normalizeTheme),
    themeOverrides: {},
    typographySettings: activeTheme?.typography ?? null,
    typographySystem: activeTheme?.typographySystem ?? null,
    backgroundSettings: activeTheme?.background ?? null,
    motionSettings: activeTheme?.motion ?? null,
    siteConfig: params.siteConfig ?? null,
    updatedAt: nowIso(),
    updatedBy: params.updatedBy ?? null,
    version: params.version ?? 1,
  };
}

function resolveActiveTheme(state: RemoteThemeState): ThemeDefinition {
  return normalizeTheme(getThemeById(state.activeThemeId, state.customThemes) ?? builtInThemes[0]);
}

export function sanitizeRemoteThemeState(raw: unknown): RemoteThemeState | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<RemoteThemeState>;
  const customThemes = Array.isArray(data.customThemes)
    ? data.customThemes.filter(theme => validateTheme(theme).valid).map(theme => normalizeTheme(theme as ThemeDefinition))
    : [];
  const activeThemeId = typeof data.activeThemeId === 'string' ? data.activeThemeId : DEFAULT_THEME_ID;
  const activeExists = !!getThemeById(activeThemeId, customThemes);
  const safeActiveThemeId = activeExists ? activeThemeId : DEFAULT_THEME_ID;
  const activeTheme = getThemeById(safeActiveThemeId, customThemes);

  if (activeTheme && !validateTheme(activeTheme).valid) return null;

  return {
    activeThemeId: safeActiveThemeId,
    themeMode: themeModeFor(safeActiveThemeId, customThemes),
    customThemes,
    themeOverrides: typeof data.themeOverrides === 'object' && data.themeOverrides ? data.themeOverrides : {},
    typographySettings: data.typographySettings ?? activeTheme?.typography ?? null,
    typographySystem: normalizeTypographySystem(data.typographySystem ?? activeTheme?.typographySystem),
    backgroundSettings: data.backgroundSettings ?? activeTheme?.background ?? null,
    motionSettings: data.motionSettings ?? activeTheme?.motion ?? null,
    siteConfig: data.siteConfig ?? null,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : nowIso(),
    updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
    version: typeof data.version === 'number' ? data.version : 1,
  };
}

export function loadCachedRemoteTheme(): CachedThemeState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedThemeState>;
    const state = sanitizeRemoteThemeState(parsed.state);
    if (!state) return null;
    const activeTheme = parsed.activeTheme && validateTheme(parsed.activeTheme).valid
      ? normalizeTheme(parsed.activeTheme as ThemeDefinition)
      : resolveActiveTheme(state);
    return { state, activeTheme, cachedAt: parsed.cachedAt ?? nowIso() };
  } catch {
    return null;
  }
}

export function saveCachedRemoteTheme(state: RemoteThemeState): void {
  if (!canUseStorage()) return;
  const activeTheme = resolveActiveTheme(state);
  const cache: CachedThemeState = { state, activeTheme, cachedAt: nowIso() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function readPublishSecret(): string {
  if (typeof window === 'undefined') return '';
  return (
    window.sessionStorage.getItem('aryan_theme_publish_secret')
    || window.localStorage.getItem('aryan_theme_publish_secret')
    || 'trace'
  );
}

export async function fetchRemoteThemeState(): Promise<RemoteThemeState | null> {
  try {
    const response = await fetch('/api/theme/config');
    if (!response.ok) {
      throw new Error(`Failed to fetch config (${response.status})`);
    }
    const data = await response.json();
    return sanitizeRemoteThemeState(data);
  } catch {
    return null;
  }
}

export async function subscribeRemoteThemeState(
  onNext: (state: RemoteThemeState | null) => void,
  onError: (error: Error) => void,
): Promise<Unsubscribe | null> {
  let active = true;
  const poll = async () => {
    try {
      const response = await fetch('/api/theme/config');
      if (!active) return;
      if (!response.ok) {
        throw new Error(`Failed to fetch config (${response.status})`);
      }
      const data = await response.json();
      onNext(sanitizeRemoteThemeState(data));
    } catch (err) {
      if (active) onError(err as Error);
    }
  };

  void poll();
  const interval = setInterval(poll, 15000);

  return () => {
    active = false;
    clearInterval(interval);
  };
}

export async function saveRemoteThemeState(next: RemoteThemeState): Promise<RemoteThemeState> {
  const state: RemoteThemeState = {
    ...next,
    updatedAt: nowIso(),
  };
  return publishRemoteThemeState(state, resolveActiveTheme(state));
}

export async function publishRemoteThemeState(
  next: RemoteThemeState,
  activeTheme: ThemeDefinition,
): Promise<RemoteThemeState> {
  const state: RemoteThemeState = {
    ...next,
    updatedAt: nowIso(),
  };
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  const publishSecret = readPublishSecret();
  if (publishSecret) headers['x-theme-publish-secret'] = publishSecret;

  const response = await fetch('/api/theme/publish', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      state: stripUndefined(state),
      activeTheme: stripUndefined(normalizeTheme(activeTheme)),
    }),
  });

  const payload = await response.json().catch(() => null) as {
    ok?: boolean;
    state?: unknown;
    snapshot?: { remoteState?: unknown };
    error?: string;
  } | null;

  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error || `Theme publish failed (${response.status})`);
  }

  const saved = sanitizeRemoteThemeState(payload?.state ?? payload?.snapshot?.remoteState ?? state);
  if (!saved) throw new Error('Published theme state was invalid');
  saveCachedRemoteTheme(saved);
  return saved;
}

export async function resetRemoteThemeState(): Promise<RemoteThemeState> {
  const state = createRemoteThemeState({
    activeThemeId: DEFAULT_THEME_ID,
    customThemes: [],
    activeTheme: builtInThemes[0],
    version: 1,
  });
  return publishRemoteThemeState(state, builtInThemes[0]);
}

export function exportRemoteThemeState(state: RemoteThemeState | null): string {
  return JSON.stringify(state, null, 2);
}
