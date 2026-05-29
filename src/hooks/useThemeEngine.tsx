import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SiteConfig } from '../types/siteConfig';
import type { ThemeDefinition, ThemeValidationResult } from '../themes/themeTypes';
import { DEFAULT_THEME_ID, builtInThemes, cloneTheme, getBuiltInTheme, getDefaultTheme, getThemeById } from '../themes/themeRegistry';
import { applyThemeTokens, startThemeTransition } from '../themes/utils/applyThemeTokens';
import { mergeThemeIntoConfig, deriveThemeFromConfig } from '../themes/utils/themeConfigBridge';
import {
  createThemeExport,
  downloadThemeJson,
  loadActiveThemeId,
  loadCustomThemes,
  loadDraftTheme,
  parseThemeImport,
  resolveActiveTheme,
  saveActiveThemeId,
  saveCustomThemes,
  saveDraftTheme,
} from '../themes/utils/themePersistence';
import { validateTheme } from '../themes/utils/themeValidation';
import { useSiteConfig } from './useSiteConfig';

interface ThemeEngineContextValue {
  builtInThemes: ThemeDefinition[];
  customThemes: ThemeDefinition[];
  allThemes: ThemeDefinition[];
  activeThemeId: string;
  activeTheme: ThemeDefinition;
  savedTheme: ThemeDefinition;
  draftTheme: ThemeDefinition | null;
  unsavedChanges: boolean;
  validation: ThemeValidationResult;
  setActiveTheme: (id: string) => void;
  duplicateTheme: (id?: string, name?: string) => ThemeDefinition;
  resetActiveTheme: () => void;
  deleteCustomTheme: (id: string) => void;
  renameActiveTheme: (name: string) => void;
  updateDraftTheme: (updater: (theme: ThemeDefinition) => ThemeDefinition) => ThemeDefinition;
  updateActiveThemeFromConfig: (config: SiteConfig) => ThemeDefinition;
  saveTheme: () => void;
  exportThemes: () => void;
  importThemes: (json: string) => { success: boolean; errors: string[] };
  getTheme: (id: string) => ThemeDefinition | undefined;
}

const ThemeEngineContext = createContext<ThemeEngineContextValue | null>(null);

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function createCustomTheme(source: ThemeDefinition, name?: string): ThemeDefinition {
  const now = new Date().toISOString();
  const baseId = slugify(name || `${source.name} Custom`) || 'custom-theme';
  return {
    ...cloneTheme(source),
    id: `${baseId}-${Date.now().toString(36)}`,
    name: name || `${source.name} Custom`,
    source: 'custom',
    sourceThemeId: source.source === 'built-in' ? source.id : source.sourceThemeId ?? source.id,
    createdAt: now,
    updatedAt: now,
  };
}

function replaceTheme(themes: ThemeDefinition[], theme: ThemeDefinition): ThemeDefinition[] {
  const exists = themes.some(item => item.id === theme.id);
  return exists ? themes.map(item => (item.id === theme.id ? theme : item)) : [...themes, theme];
}

export function ThemeEngineProvider({ children }: { children: ReactNode }) {
  const { config, setConfig } = useSiteConfig();
  const configRef = useRef(config);
  const [customThemes, setCustomThemes] = useState<ThemeDefinition[]>(() => loadCustomThemes());
  const [activeThemeId, setActiveThemeIdState] = useState(() => {
    const storedId = loadActiveThemeId();
    return getThemeById(storedId, loadCustomThemes()) ? storedId : DEFAULT_THEME_ID;
  });
  const [draftTheme, setDraftTheme] = useState<ThemeDefinition | null>(() => {
    const draft = loadDraftTheme();
    const activeId = loadActiveThemeId();
    return draft?.id === activeId ? draft : null;
  });
  const [unsavedChanges, setUnsavedChanges] = useState(() => {
    const draft = loadDraftTheme();
    return !!draft && draft.id === loadActiveThemeId();
  });

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const savedTheme = useMemo(
    () => getThemeById(activeThemeId, customThemes) ?? getDefaultTheme(),
    [activeThemeId, customThemes],
  );

  const activeTheme = useMemo(
    () => resolveActiveTheme(activeThemeId, customThemes, draftTheme),
    [activeThemeId, customThemes, draftTheme],
  );

  const allThemes = useMemo(() => [...builtInThemes, ...customThemes], [customThemes]);
  const validation = useMemo(() => validateTheme(activeTheme), [activeTheme]);

  useEffect(() => {
    saveCustomThemes(customThemes);
  }, [customThemes]);

  useEffect(() => {
    saveActiveThemeId(activeThemeId);
  }, [activeThemeId]);

  useEffect(() => {
    saveDraftTheme(unsavedChanges ? draftTheme : null);
  }, [draftTheme, unsavedChanges]);

  useEffect(() => {
    const theme = validation.valid ? activeTheme : getDefaultTheme();
    startThemeTransition(theme.motion.transitionDuration + 160);
    applyThemeTokens(theme);
    const themedConfig = mergeThemeIntoConfig(configRef.current, theme);
    configRef.current = themedConfig;
    setConfig(themedConfig);
  }, [activeTheme, setConfig, validation.valid]);

  const commitDraft = useCallback((theme = draftTheme) => {
    if (!theme || theme.source !== 'custom') {
      setUnsavedChanges(false);
      setDraftTheme(null);
      return;
    }
    const valid = validateTheme(theme);
    if (!valid.valid) return;
    setCustomThemes(prev => replaceTheme(prev, theme));
    setUnsavedChanges(false);
    setDraftTheme(null);
  }, [draftTheme]);

  const setActiveTheme = useCallback((id: string) => {
    const nextTheme = getThemeById(id, customThemes);
    const safeId = nextTheme ? id : DEFAULT_THEME_ID;
    if (unsavedChanges && draftTheme) commitDraft(draftTheme);
    setActiveThemeIdState(safeId);
    setDraftTheme(null);
    setUnsavedChanges(false);
  }, [commitDraft, customThemes, draftTheme, unsavedChanges]);

  const duplicateTheme = useCallback((id = activeThemeId, name?: string) => {
    const source = getThemeById(id, customThemes) ?? activeTheme;
    const duplicate = createCustomTheme(source, name);
    setCustomThemes(prev => replaceTheme(prev, duplicate));
    setActiveThemeIdState(duplicate.id);
    setDraftTheme(null);
    setUnsavedChanges(false);
    return duplicate;
  }, [activeTheme, activeThemeId, customThemes]);

  const updateDraftTheme = useCallback((updater: (theme: ThemeDefinition) => ThemeDefinition) => {
    let base = activeTheme;
    if (base.source === 'built-in') {
      base = createCustomTheme(base);
      setCustomThemes(prev => replaceTheme(prev, base));
      setActiveThemeIdState(base.id);
    }

    const updated = updater(cloneTheme(base));
    const next = {
      ...updated,
      source: 'custom' as const,
      sourceThemeId: updated.sourceThemeId ?? base.sourceThemeId ?? (base.source === 'built-in' ? base.id : undefined),
      updatedAt: new Date().toISOString(),
    };
    setDraftTheme(next);
    setUnsavedChanges(true);
    return next;
  }, [activeTheme]);

  const updateActiveThemeFromConfig = useCallback((nextConfig: SiteConfig) => (
    updateDraftTheme(theme => deriveThemeFromConfig(theme, nextConfig))
  ), [updateDraftTheme]);

  const saveTheme = useCallback(() => {
    commitDraft();
  }, [commitDraft]);

  const resetActiveTheme = useCallback(() => {
    const sourceTheme = activeTheme.source === 'custom' && activeTheme.sourceThemeId
      ? getBuiltInTheme(activeTheme.sourceThemeId)
      : getBuiltInTheme(activeTheme.id);

    if (activeTheme.source === 'custom' && sourceTheme) {
      const resetCustom: ThemeDefinition = {
        ...cloneTheme(sourceTheme),
        id: activeTheme.id,
        name: activeTheme.name,
        source: 'custom',
        sourceThemeId: sourceTheme.id,
        createdAt: activeTheme.createdAt,
        updatedAt: new Date().toISOString(),
      };
      setCustomThemes(prev => replaceTheme(prev, resetCustom));
      setDraftTheme(null);
      setUnsavedChanges(false);
      return;
    }

    setDraftTheme(null);
    setUnsavedChanges(false);
  }, [activeTheme]);

  const deleteCustomTheme = useCallback((id: string) => {
    setCustomThemes(prev => prev.filter(theme => theme.id !== id));
    if (activeThemeId === id) {
      setActiveThemeIdState(DEFAULT_THEME_ID);
      setDraftTheme(null);
      setUnsavedChanges(false);
    }
  }, [activeThemeId]);

  const renameActiveTheme = useCallback((name: string) => {
    if (!name.trim()) return;
    if (activeTheme.source !== 'custom') {
      duplicateTheme(activeTheme.id, name.trim());
      return;
    }
    updateDraftTheme(theme => ({ ...theme, name: name.trim() }));
  }, [activeTheme, duplicateTheme, updateDraftTheme]);

  const exportThemes = useCallback(() => {
    downloadThemeJson(createThemeExport(activeThemeId, customThemes));
  }, [activeThemeId, customThemes]);

  const importThemes = useCallback((json: string) => {
    const result = parseThemeImport(json);
    if (!result.success) return { success: false, errors: result.errors };

    setCustomThemes(prev => {
      const next = [...prev];
      result.customThemes.forEach(theme => {
        const index = next.findIndex(item => item.id === theme.id);
        if (index >= 0) next[index] = theme;
        else next.push(theme);
      });
      return next;
    });

    const importedActive = result.activeThemeId && getThemeById(result.activeThemeId, result.customThemes);
    if (importedActive) {
      setActiveThemeIdState(result.activeThemeId!);
      setDraftTheme(null);
      setUnsavedChanges(false);
    }

    return { success: true, errors: [] };
  }, []);

  const getTheme = useCallback((id: string) => getThemeById(id, customThemes), [customThemes]);

  const value = useMemo<ThemeEngineContextValue>(() => ({
    builtInThemes,
    customThemes,
    allThemes,
    activeThemeId,
    activeTheme,
    savedTheme,
    draftTheme,
    unsavedChanges,
    validation,
    setActiveTheme,
    duplicateTheme,
    resetActiveTheme,
    deleteCustomTheme,
    renameActiveTheme,
    updateDraftTheme,
    updateActiveThemeFromConfig,
    saveTheme,
    exportThemes,
    importThemes,
    getTheme,
  }), [
    customThemes,
    allThemes,
    activeThemeId,
    activeTheme,
    savedTheme,
    draftTheme,
    unsavedChanges,
    validation,
    setActiveTheme,
    duplicateTheme,
    resetActiveTheme,
    deleteCustomTheme,
    renameActiveTheme,
    updateDraftTheme,
    updateActiveThemeFromConfig,
    saveTheme,
    exportThemes,
    importThemes,
    getTheme,
  ]);

  return (
    <ThemeEngineContext.Provider value={value}>
      {children}
    </ThemeEngineContext.Provider>
  );
}

export function useThemeEngine(): ThemeEngineContextValue {
  const ctx = useContext(ThemeEngineContext);
  if (!ctx) throw new Error('useThemeEngine must be used within ThemeEngineProvider');
  return ctx;
}

