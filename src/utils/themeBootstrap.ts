import type { ThemeBootstrapSnapshot } from '../types/themeBootstrap';

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function isThemeBootstrapSnapshot(value: unknown): value is ThemeBootstrapSnapshot {
  if (!isObject(value)) return false;
  if (typeof value.activeThemeId !== 'string') return false;
  if (!isObject(value.remoteState)) return false;
  const activeTheme = value.activeTheme;
  if (!isObject(activeTheme)) return false;
  if (typeof activeTheme.id !== 'string' || typeof activeTheme.name !== 'string') return false;
  if (!isObject(activeTheme.colors)) return false;
  return activeTheme.id === value.activeThemeId;
}

export function getThemeBootstrapSnapshot(): ThemeBootstrapSnapshot | null {
  if (typeof window === 'undefined') return null;
  const snapshot = window.__ARYAN_THEME_BOOTSTRAP__;
  return isThemeBootstrapSnapshot(snapshot) ? snapshot : null;
}

export function hasThemeBootstrap(): boolean {
  return getThemeBootstrapSnapshot() !== null;
}

export function getThemeBootstrapError(): string | null {
  if (typeof window === 'undefined') return null;
  return typeof window.__ARYAN_THEME_BOOTSTRAP_ERROR__ === 'string'
    ? window.__ARYAN_THEME_BOOTSTRAP_ERROR__
    : null;
}
