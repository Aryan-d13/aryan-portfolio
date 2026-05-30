import {
  type Unsubscribe,
} from 'firebase/firestore';
import type { SiteConfig } from '../types/siteConfig';
import { firebaseConfigured, getFirebaseRuntime } from '../lib/firebase';
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

const COLLECTION = 'portfolioConfig';
const DOC_ID = 'main';
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

async function themeDocRef() {
  if (!firebaseConfigured) return null;
  const runtime = await getFirebaseRuntime();
  if (!runtime) return null;
  return {
    ref: runtime.api.doc(runtime.firestore, COLLECTION, DOC_ID),
    api: runtime.api,
  };
}

export async function fetchRemoteThemeState(): Promise<RemoteThemeState | null> {
  const runtime = await themeDocRef();
  if (!runtime) return null;
  const snap = await runtime.api.getDoc(runtime.ref);
  if (!snap.exists()) return null;
  return sanitizeRemoteThemeState(snap.data());
}

export async function subscribeRemoteThemeState(
  onNext: (state: RemoteThemeState | null) => void,
  onError: (error: Error) => void,
): Promise<Unsubscribe | null> {
  const runtime = await themeDocRef();
  if (!runtime) return null;
  return runtime.api.onSnapshot(
    runtime.ref,
    snapshot => {
      if (!snapshot.exists()) {
        onNext(null);
        return;
      }
      const state = sanitizeRemoteThemeState(snapshot.data());
      onNext(state);
    },
    error => onError(error),
  );
}

export async function saveRemoteThemeState(next: RemoteThemeState): Promise<RemoteThemeState> {
  const runtime = await themeDocRef();
  if (!runtime) throw new Error('Firebase is not configured');
  const state: RemoteThemeState = {
    ...next,
    updatedAt: nowIso(),
  };
  await runtime.api.setDoc(runtime.ref, stripUndefined(state), { merge: false });
  saveCachedRemoteTheme(state);
  return state;
}

export async function resetRemoteThemeState(): Promise<RemoteThemeState> {
  return saveRemoteThemeState(createRemoteThemeState({
    activeThemeId: DEFAULT_THEME_ID,
    customThemes: [],
    activeTheme: builtInThemes[0],
    version: 1,
  }));
}

export function exportRemoteThemeState(state: RemoteThemeState | null): string {
  return JSON.stringify(state, null, 2);
}
