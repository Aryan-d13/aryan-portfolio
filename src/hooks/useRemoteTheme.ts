import { useCallback, useEffect, useRef, useState } from 'react';
import type { Unsubscribe } from 'firebase/firestore';
import type { ThemeDefinition } from '../themes/themeTypes';
import type { SiteConfig } from '../types/siteConfig';
import { getThemeById } from '../themes/themeRegistry';
import { loadActiveThemeId, loadCustomThemes, saveActiveThemeId, saveCustomThemes } from '../themes/utils/themePersistence';
import {
  createRemoteThemeState,
  exportRemoteThemeState,
  fetchRemoteThemeState,
  loadCachedRemoteTheme,
  resetRemoteThemeState,
  saveCachedRemoteTheme,
  saveRemoteThemeState,
  sanitizeRemoteThemeState,
  subscribeRemoteThemeState,
  type RemoteThemeState,
  type ThemeSyncSource,
  type ThemeSyncStatus,
} from '../services/themeService';
import { firebaseConfigured } from '../lib/firebase';

interface UseRemoteThemeOptions {
  onRemoteState: (state: RemoteThemeState, source: ThemeSyncSource) => void;
}

export interface UseRemoteThemeResult {
  syncStatus: ThemeSyncStatus;
  syncSource: ThemeSyncSource;
  lastSyncedAt: string | null;
  remoteError: string | null;
  remoteState: RemoteThemeState | null;
  saveThemeGlobally: (params: {
    activeThemeId: string;
    customThemes: ThemeDefinition[];
    activeTheme: ThemeDefinition;
    updatedBy?: string | null;
  }) => Promise<boolean>;
  saveConfigGlobally: (config: SiteConfig) => Promise<boolean>;
  reloadRemoteTheme: () => Promise<boolean>;
  resetCloudTheme: () => Promise<boolean>;
  exportCloudConfig: () => string;
  importCloudConfig: (json: string) => Promise<{ success: boolean; errors: string[] }>;
}

function isNewer(next: RemoteThemeState, current: RemoteThemeState | null): boolean {
  if (!current) return true;
  if (next.version !== current.version) return next.version > current.version;
  return new Date(next.updatedAt).getTime() >= new Date(current.updatedAt).getTime();
}

export function useRemoteTheme({ onRemoteState }: UseRemoteThemeOptions): UseRemoteThemeResult {
  const [syncStatus, setSyncStatus] = useState<ThemeSyncStatus>('offline-cache');
  const [syncSource, setSyncSource] = useState<ThemeSyncSource>('default');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [remoteState, setRemoteState] = useState<RemoteThemeState | null>(null);
  const remoteStateRef = useRef<RemoteThemeState | null>(null);
  const onRemoteStateRef = useRef(onRemoteState);

  useEffect(() => {
    onRemoteStateRef.current = onRemoteState;
  }, [onRemoteState]);

  const applyRemote = useCallback((state: RemoteThemeState, source: ThemeSyncSource) => {
    if (!isNewer(state, remoteStateRef.current) && source === 'cloud') return;
    remoteStateRef.current = state;
    setRemoteState(state);
    setSyncSource(source);
    setLastSyncedAt(state.updatedAt);
    setRemoteError(null);
    setSyncStatus(source === 'cloud' ? 'synced' : 'offline-cache');
    saveCachedRemoteTheme(state);
    saveActiveThemeId(state.activeThemeId);
    saveCustomThemes(state.customThemes);
    onRemoteStateRef.current(state, source);
  }, []);

  useEffect(() => {
    const cached = loadCachedRemoteTheme();
    if (cached) applyRemote(cached.state, 'cache');

    let cancelled = false;
    let unsub: Unsubscribe | null = null;

    const connect = async () => {
      if (!firebaseConfigured) {
        setSyncStatus('offline-cache');
        setSyncSource(cached ? 'cache' : 'default');
        setRemoteError('Firebase environment variables are not configured');
        return;
      }

      try {
        let isFirstEmit = true;
        unsub = await subscribeRemoteThemeState(
          async state => {
            if (cancelled) return;
            if (state) {
              applyRemote(state, 'cloud');
            } else if (isFirstEmit) {
              isFirstEmit = false;
              const localActiveThemeId = loadActiveThemeId();
              const localCustomThemes = loadCustomThemes();
              const localActiveTheme = getThemeById(localActiveThemeId, localCustomThemes);
              if (localActiveTheme || localCustomThemes.length) {
                const migrated = await saveRemoteThemeState(createRemoteThemeState({
                  activeThemeId: localActiveThemeId,
                  customThemes: localCustomThemes,
                  activeTheme: localActiveTheme,
                }));
                if (!cancelled) applyRemote(migrated, 'cloud');
              } else {
                setSyncStatus(cached ? 'offline-cache' : 'synced');
                setSyncSource(cached ? 'cache' : 'default');
              }
            }
          },
          error => {
            if (cancelled) return;
            setRemoteError(error.message);
            setSyncStatus('failed');
            setSyncSource(cached ? 'cache' : 'default');
          },
        );

        if (cancelled) {
          unsub?.();
          return;
        }

        if (!unsub && !cached) {
          setSyncStatus('offline-cache');
          setSyncSource('default');
        }
      } catch (error) {
        if (cancelled) return;
        setRemoteError((error as Error).message);
        setSyncStatus(cached ? 'offline-cache' : 'failed');
        setSyncSource(cached ? 'cache' : 'default');
      }
    };

    connect();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [applyRemote]);

  const saveThemeGlobally = useCallback<UseRemoteThemeResult['saveThemeGlobally']>(async ({ activeThemeId, customThemes, activeTheme, updatedBy }) => {
    setSyncStatus('saving');
    setRemoteError(null);
    try {
      const current = remoteStateRef.current;
      const state = createRemoteThemeState({
        activeThemeId,
        customThemes,
        activeTheme,
        updatedBy,
        siteConfig: current?.siteConfig ?? null,
        version: (current?.version ?? 0) + 1,
      });
      const saved = await saveRemoteThemeState(state);
      applyRemote(saved, 'cloud');
      return true;
    } catch (error) {
      const fallback = createRemoteThemeState({
        activeThemeId,
        customThemes,
        activeTheme,
        siteConfig: remoteStateRef.current?.siteConfig ?? null,
        version: remoteStateRef.current?.version ?? 1
      });
      saveCachedRemoteTheme(fallback);
      setRemoteError((error as Error).message);
      setSyncStatus(firebaseConfigured ? 'failed' : 'offline-cache');
      setSyncSource('cache');
      return false;
    }
  }, [applyRemote]);

  const saveConfigGlobally = useCallback<UseRemoteThemeResult['saveConfigGlobally']>(async (config: SiteConfig) => {
    setSyncStatus('saving');
    setRemoteError(null);
    try {
      const current = remoteStateRef.current;
      const activeThemeId = current?.activeThemeId || loadActiveThemeId();
      const customThemes = current?.customThemes || loadCustomThemes();
      const activeTheme = getThemeById(activeThemeId, customThemes);
      const state = createRemoteThemeState({
        activeThemeId,
        customThemes,
        activeTheme,
        siteConfig: config,
        version: (current?.version ?? 0) + 1,
      });
      const saved = await saveRemoteThemeState(state);
      applyRemote(saved, 'cloud');
      return true;
    } catch (error) {
      setRemoteError((error as Error).message);
      setSyncStatus(firebaseConfigured ? 'failed' : 'offline-cache');
      return false;
    }
  }, [applyRemote]);

  const reloadRemoteTheme = useCallback(async () => {
    setSyncStatus('saving');
    try {
      const state = await fetchRemoteThemeState();
      if (!state) {
        setSyncStatus('offline-cache');
        return false;
      }
      applyRemote(state, 'cloud');
      return true;
    } catch (error) {
      setRemoteError((error as Error).message);
      setSyncStatus('failed');
      return false;
    }
  }, [applyRemote]);

  const resetCloudTheme = useCallback(async () => {
    setSyncStatus('saving');
    try {
      const state = await resetRemoteThemeState();
      applyRemote(state, 'cloud');
      return true;
    } catch (error) {
      setRemoteError((error as Error).message);
      setSyncStatus('failed');
      return false;
    }
  }, [applyRemote]);

  const exportCloudConfig = useCallback(() => {
    if (remoteStateRef.current) return exportRemoteThemeState(remoteStateRef.current);
    const activeThemeId = loadActiveThemeId();
    const customThemes = loadCustomThemes();
    const activeTheme = getThemeById(activeThemeId, customThemes);
    return exportRemoteThemeState(createRemoteThemeState({ activeThemeId, customThemes, activeTheme }));
  }, []);

  const importCloudConfig = useCallback(async (json: string) => {
    try {
      const parsed = JSON.parse(json) as RemoteThemeState;
      const state = sanitizeRemoteThemeState(parsed);
      if (!state) return { success: false, errors: ['Imported cloud theme config is invalid'] };
      setSyncStatus('saving');
      const saved = await saveRemoteThemeState(state);
      applyRemote(saved, 'cloud');
      return { success: true, errors: [] };
    } catch (error) {
      setRemoteError((error as Error).message);
      setSyncStatus('failed');
      return { success: false, errors: [(error as Error).message] };
    }
  }, [applyRemote]);

  return {
    syncStatus,
    syncSource,
    lastSyncedAt,
    remoteError,
    remoteState,
    saveThemeGlobally,
    saveConfigGlobally,
    reloadRemoteTheme,
    resetCloudTheme,
    exportCloudConfig,
    importCloudConfig,
  };
}
