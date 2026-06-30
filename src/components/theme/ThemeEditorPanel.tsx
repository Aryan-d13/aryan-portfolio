import { useEffect, useRef, useState } from 'react';
import type { SiteConfig } from '../../types/siteConfig';
import type { ThemeBackgroundType, ThemeDefinition, ThemeDensity, ThemeMotionPersonality, ThemeTransitionStyle } from '../../themes/themeTypes';
import { useThemeEngine } from '../../hooks/useThemeEngine';
import Icon, { type IconName } from '../icons/Icon';
import ThemePreviewCard from './ThemePreviewCard';
import { toast, confirmDialog } from '../ui/Toast';

interface Props {
  config: SiteConfig;
  onConfigChange: () => void;
  onThemeChanged: (theme: ThemeDefinition) => void;
}

const backgroundTypes: ThemeBackgroundType[] = [
  'trace-grid',
  'soft-luxury',
  'starfield',
  'noir-document',
  'skyline',
  'diagram',
  'lab-grid',
  'blue-hour',
  'archive',
  'cosmic-debug',
];

const densities: ThemeDensity[] = ['compact', 'balanced', 'cinematic', 'editorial', 'dense'];
const motionPersonalities: ThemeMotionPersonality[] = ['restrained', 'minimal', 'atmospheric', 'sharp', 'scanline', 'editorial', 'dense', 'cinematic', 'archival', 'cosmic'];
const transitionStyles: ThemeTransitionStyle[] = ['crossfade', 'scale-fade', 'soft-wipe', 'cover-reveal', 'trace-sweep', 'glow-shift'];

function defaultTransitionStyle(personality: ThemeMotionPersonality): ThemeTransitionStyle {
  if (personality === 'scanline' || personality === 'restrained') return 'trace-sweep';
  if (personality === 'cosmic' || personality === 'atmospheric') return 'glow-shift';
  if (personality === 'sharp' || personality === 'archival') return 'soft-wipe';
  return 'scale-fade';
}

function syncIcon(status: string): IconName {
  if (status === 'saving') return 'sync';
  if (status === 'synced') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'unsaved') return 'warning';
  return 'database';
}

function ThemeField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="theme-edit-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function ThemeEditorPanel({ config, onConfigChange, onThemeChanged }: Props) {
  const themeEngine = useThemeEngine();
  const {
    allThemes,
    activeTheme: rawActiveTheme,
    activeThemeId,
    unsavedChanges,
    validation,
    syncStatus,
    syncSource,
    lastSyncedAt,
    remoteError,
    setActiveTheme,
    duplicateTheme,
    resetActiveTheme,
    deleteCustomTheme,
    renameActiveTheme,
    updateDraftTheme,
    saveTheme,
    saveThemeGlobally,
    reloadRemoteTheme,
    resetCloudTheme,
    exportCloudConfig,
    importCloudConfig,
    exportThemes,
    importThemes,
    getTheme,
  } = themeEngine;

  // Defensive fallback / default theme guard to protect from schema discrepancies
  const fallbackTheme = allThemes.find(t => t.id === 'proof-archive') || allThemes[0];
  const activeTheme = {
    ...fallbackTheme,
    ...rawActiveTheme,
    colors: rawActiveTheme?.colors ? { ...fallbackTheme?.colors, ...rawActiveTheme.colors } : fallbackTheme?.colors,
    typography: rawActiveTheme?.typography ? { ...fallbackTheme?.typography, ...rawActiveTheme.typography } : fallbackTheme?.typography,
    spacing: rawActiveTheme?.spacing ? { ...fallbackTheme?.spacing, ...rawActiveTheme.spacing } : fallbackTheme?.spacing,
    radius: rawActiveTheme?.radius ? { ...fallbackTheme?.radius, ...rawActiveTheme.radius } : fallbackTheme?.radius,
    borders: rawActiveTheme?.borders ? { ...fallbackTheme?.borders, ...rawActiveTheme.borders } : fallbackTheme?.borders,
    elevation: rawActiveTheme?.elevation ? { ...fallbackTheme?.elevation, ...rawActiveTheme.elevation } : fallbackTheme?.elevation,
    background: rawActiveTheme?.background ? { ...fallbackTheme?.background, ...rawActiveTheme.background } : fallbackTheme?.background,
    glow: rawActiveTheme?.glow ? { ...fallbackTheme?.glow, ...rawActiveTheme.glow } : fallbackTheme?.glow,
    motion: rawActiveTheme?.motion ? { ...fallbackTheme?.motion, ...rawActiveTheme.motion } : fallbackTheme?.motion,
    components: rawActiveTheme?.components ? { ...fallbackTheme?.components, ...rawActiveTheme.components } : fallbackTheme?.components,
    layout: rawActiveTheme?.layout ? { ...fallbackTheme?.layout, ...rawActiveTheme.layout } : fallbackTheme?.layout,
  } as ThemeDefinition;

  const importRef = useRef<HTMLInputElement>(null);
  const cloudImportRef = useRef<HTMLInputElement>(null);
  const [renameValue, setRenameValue] = useState(activeTheme.name);
  const [publishSecret, setPublishSecret] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aryan_theme_publish_secret') || 'trace';
    }
    return 'trace';
  });
  const isCloudSaving = syncStatus === 'saving';

  useEffect(() => {
    setRenameValue(activeTheme.name);
  }, [activeTheme.name]);

  const applySelectedTheme = (themeId: string) => {
    const nextTheme = getTheme(themeId);
    setActiveTheme(themeId);
    if (nextTheme) onThemeChanged(nextTheme);
    toast(`Theme active: ${nextTheme?.name ?? themeId}`, 'success');
  };

  const updateTheme = (updater: (theme: ThemeDefinition) => ThemeDefinition) => {
    const nextTheme = updateDraftTheme(updater);
    onThemeChanged(nextTheme);
  };

  const handleDuplicate = () => {
    const duplicate = duplicateTheme(activeThemeId);
    onThemeChanged(duplicate);
    toast(`Duplicated theme: ${duplicate.name}`, 'success');
  };

  const handleReset = async () => {
    const ok = await confirmDialog('Reset Theme', `Reset "${activeTheme.name}" to its default source values?`);
    if (!ok) return;
    resetActiveTheme();
    const source = activeTheme.sourceThemeId ? getTheme(activeTheme.sourceThemeId) : getTheme(activeTheme.id);
    if (source) onThemeChanged(activeTheme.source === 'custom' ? { ...source, id: activeTheme.id, name: activeTheme.name, source: 'custom', sourceThemeId: source.id } : source);
    toast('Theme reset', 'warning');
  };

  const handleRename = () => {
    if (!renameValue.trim()) return;
    renameActiveTheme(renameValue);
    toast('Theme renamed', 'info');
  };

  const handleDelete = async () => {
    if (activeTheme.source !== 'custom') return;
    const ok = await confirmDialog('Delete Custom Theme', `Delete "${activeTheme.name}"? Built-in themes are preserved.`);
    if (!ok) return;
    deleteCustomTheme(activeTheme.id);
    const fallback = getTheme('nocturnal-signal');
    if (fallback) onThemeChanged(fallback);
    toast('Custom theme deleted', 'warning');
  };

  const handleImport = async () => {
    const file = importRef.current?.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importThemes(text);
    if (result.success) toast('Themes imported', 'success');
    else toast(`Theme import failed: ${result.errors[0]}`, 'error');
    if (importRef.current) importRef.current.value = '';
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGlobalSave = async () => {
    const ok = await saveThemeGlobally();
    toast(ok ? 'Theme synced across clients' : 'Theme sync failed; local cache kept', ok ? 'success' : 'error');
  };

  const handleCloudReload = async () => {
    const ok = await reloadRemoteTheme();
    toast(ok ? 'Reloaded theme from cloud' : 'No cloud theme available', ok ? 'success' : 'warning');
  };

  const handleCloudReset = async () => {
    const ok = await confirmDialog('Reset Cloud Theme', 'Reset the globally synced theme to the default Nocturnal Signal?');
    if (!ok) return;
    const synced = await resetCloudTheme();
    toast(synced ? 'Cloud theme reset to default' : 'Cloud reset failed', synced ? 'warning' : 'error');
  };

  const handleCloudExport = () => {
    downloadText(exportCloudConfig(), 'aryan-cloud-theme-config.json');
    toast('Cloud theme config exported', 'success');
  };

  const handleCloudImport = async () => {
    const file = cloudImportRef.current?.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = await importCloudConfig(text);
    if (result.success) toast('Imported and uploaded cloud theme config', 'success');
    else toast(`Cloud import failed: ${result.errors[0]}`, 'error');
    if (cloudImportRef.current) cloudImportRef.current.value = '';
  };

  const togglePublicSelector = () => {
    config.themeEngine = config.themeEngine ?? { publicSelectorEnabled: false };
    config.themeEngine.publicSelectorEnabled = !config.themeEngine.publicSelectorEnabled;
    onConfigChange();
  };

  return (
    <div className="theme-engine-panel">
      <div className="cr-editor-header">
        <h2><Icon name="theme" size="md" tone="accent" />Theme Engine</h2>
        <p>Saved visual identity systems. Default themes stay immutable; custom variants hold your edits.</p>
        <div className="cr-table-container" style={{ margin: '14px 0', maxWidth: '580px' }}>
          <table className="cr-table cr-table-soft density-compact">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>System Metric / Parameter</th>
                <th>Diagnostic Value / Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Theme Type</td>
                <td>
                  <span className="cr-badge cr-badge-info" style={{ textTransform: 'none' }}>
                    <Icon name={activeTheme.source === 'custom' ? 'edit' : 'lock'} size="xs" tone="accent" />
                    {activeTheme.source === 'custom' ? 'custom editable theme' : 'built-in source preset'}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Cloud Database Sync</td>
                <td>
                  <span className={`cr-badge ${syncStatus === 'synced' ? 'cr-badge-success' : syncStatus === 'failed' ? 'cr-badge-error' : syncStatus === 'saving' ? 'cr-badge-info' : 'cr-badge-warning'}`}>
                    <Icon name={syncIcon(syncStatus)} size="xs" tone={syncStatus === 'synced' ? 'success' : syncStatus === 'failed' ? 'error' : syncStatus === 'saving' ? 'accent' : 'warning'} state={syncStatus === 'saving' ? 'loading' : 'idle'} />
                    cloud: {syncStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Config Source</td>
                <td>
                  <code style={{ fontSize: '11px', color: 'var(--table-text-muted)', fontFamily: 'var(--cr-font-mono)' }}>{syncSource}</code>
                </td>
              </tr>
              {lastSyncedAt && (
                <tr>
                  <td>Last Synced At</td>
                  <td style={{ fontFamily: 'var(--cr-font-mono)', fontSize: '11px', color: 'var(--table-text-secondary)' }}>
                    {new Date(lastSyncedAt).toLocaleString()}
                  </td>
                </tr>
              )}
              {unsavedChanges && (
                <tr>
                  <td>Local Cache State</td>
                  <td>
                    <span className="cr-badge cr-badge-warning">
                      <Icon name="warning" size="xs" tone="warning" state="warning" />
                      unsaved local changes
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {remoteError && (
          <div className="cr-table-container" style={{ margin: '8px 0', maxWidth: '580px', borderColor: 'color-mix(in srgb, var(--table-error) 40%, var(--table-border))' }}>
            <table className="cr-table">
              <tbody>
                <tr style={{ background: 'color-mix(in srgb, var(--table-error) 4%, var(--table-bg))' }}>
                  <td style={{ width: '130px' }}>
                    <span className="cr-badge cr-badge-error">CLOUD ERROR</span>
                  </td>
                  <td style={{ color: 'var(--table-error)', fontSize: '11px', fontFamily: 'var(--cr-font-mono)' }}>
                    {remoteError}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section className="theme-engine-block">
        <div className="theme-cloud-actions" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button className="cr-btn cr-btn-primary icon-align-inline" type="button" onClick={handleGlobalSave} disabled={isCloudSaving} aria-busy={isCloudSaving}>
              <Icon name="sync" size="xs" tone="accent" state={isCloudSaving ? 'loading' : 'idle'} />
              {isCloudSaving ? 'saving theme' : 'save theme globally'}
            </button>
            <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={handleCloudReload} disabled={isCloudSaving}><Icon name="download" size="xs" tone="muted" />reload from cloud</button>
            <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={handleCloudExport} disabled={isCloudSaving}><Icon name="export" size="xs" tone="muted" />export cloud config</button>
            <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={() => cloudImportRef.current?.click()} disabled={isCloudSaving}><Icon name="import" size="xs" tone="muted" />import and upload config</button>
            <button className="cr-btn cr-btn-danger icon-align-inline" type="button" onClick={handleCloudReset} disabled={isCloudSaving}><Icon name="reset" size="xs" tone="error" />reset cloud theme</button>
          </div>
          <div className="cr-field" style={{ maxWidth: '460px', margin: '4px 0 0' }}>
            <label className="cr-label" htmlFor="publish-secret-input">Production Publish Secret (THEME_PUBLISH_SECRET)</label>
            <input 
              id="publish-secret-input"
              className="cr-input" 
              type="password" 
              placeholder="Enter your custom Vercel authorization secret key" 
              value={publishSecret}
              onChange={e => {
                const val = e.target.value;
                setPublishSecret(val);
                localStorage.setItem('aryan_theme_publish_secret', val);
              }}
            />
            <span className="cr-label-hint">Required to authenticate and push theme changes to your live site in production.</span>
          </div>
        </div>
        <input ref={cloudImportRef} type="file" accept=".json" hidden onChange={handleCloudImport} />

        <div className="theme-engine-toolbar">
          <ThemeField label="Active theme">
            <select className="cr-select" value={activeThemeId} onChange={event => applySelectedTheme(event.target.value)}>
              {allThemes.map(theme => (
                <option key={theme.id} value={theme.id}>{theme.name} - {theme.preview?.vibeLabel ?? 'Custom theme'}</option>
              ))}
            </select>
          </ThemeField>
          <button className="cr-btn cr-btn-primary icon-align-inline" type="button" onClick={handleDuplicate}><Icon name="duplicate" size="xs" tone="accent" />duplicate theme</button>
          <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={handleReset}><Icon name="reset" size="xs" tone="muted" />reset active theme</button>
          <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={exportThemes}><Icon name="export" size="xs" tone="muted" />export themes JSON</button>
          <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={() => importRef.current?.click()}><Icon name="import" size="xs" tone="muted" />import themes JSON</button>
        </div>

        <label className="theme-public-toggle">
          <input type="checkbox" checked={!!config.themeEngine?.publicSelectorEnabled} onChange={togglePublicSelector} />
          <span>Enable hidden public theme dropdown</span>
        </label>

        <input ref={importRef} type="file" accept=".json" hidden onChange={handleImport} />
      </section>

      <section className="theme-engine-block">
        <div className="theme-preview-grid">
          {allThemes.map(theme => (
            <ThemePreviewCard
              key={theme.id}
              theme={theme}
              active={theme.id === activeThemeId}
              dirty={theme.id === activeThemeId && unsavedChanges}
              onSelect={applySelectedTheme}
            />
          ))}
        </div>
      </section>

      <section className="theme-engine-block">
        <div className="theme-custom-row">
          <ThemeField label="Theme name">
            <input className="cr-input" value={renameValue} onChange={event => setRenameValue(event.target.value)} />
          </ThemeField>
          <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={handleRename}><Icon name="edit" size="xs" tone="muted" />rename custom theme</button>
          <button className="cr-btn cr-btn-primary icon-align-inline" type="button" onClick={saveTheme} disabled={!unsavedChanges}><Icon name="save" size="xs" tone="accent" />save custom theme</button>
          <button className="cr-btn cr-btn-danger icon-align-inline" type="button" onClick={handleDelete} disabled={activeTheme.source !== 'custom'}><Icon name="delete" size="xs" tone="error" />delete custom theme</button>
        </div>

        {!validation.valid && (
          <div className="cr-table-container" style={{ margin: '14px 0', borderColor: 'color-mix(in srgb, var(--table-error) 40%, var(--table-border))' }}>
            <table className="cr-table cr-table-soft density-compact">
              <thead>
                <tr style={{ background: 'color-mix(in srgb, var(--table-error) 4%, var(--table-bg))' }}>
                  <th style={{ color: 'var(--table-error)', width: '130px' }}>Diagnostic Status</th>
                  <th style={{ color: 'var(--table-error)' }}>Validation Error Description</th>
                </tr>
              </thead>
              <tbody>
                {validation.errors.map((error, idx) => (
                  <tr key={idx} style={{ background: 'color-mix(in srgb, var(--table-error) 2%, var(--table-bg))' }}>
                    <td>
                      <span className="cr-badge cr-badge-error">
                        <Icon name="error" size="xs" tone="error" />
                        ERROR
                      </span>
                    </td>
                    <td style={{ color: 'var(--table-error)', fontSize: '11px', fontFamily: 'var(--cr-font-mono)' }}>
                      {error}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <details className="theme-token-editor" open>
        <summary><Icon name="settings" size="sm" tone="accent" />Edit current theme</summary>

        <div className="theme-token-section">
          <h3>Identity</h3>
          <ThemeField label="Short description">
            <input className="cr-input" value={activeTheme.shortDescription ?? ''} onChange={event => updateTheme(theme => ({ ...theme, shortDescription: event.target.value }))} />
          </ThemeField>
          <ThemeField label="Emotional tone">
            <textarea className="cr-textarea" rows={2} value={activeTheme.emotionalTone ?? ''} onChange={event => updateTheme(theme => ({ ...theme, emotionalTone: event.target.value }))} />
          </ThemeField>
        </div>

        <div className="theme-token-section">
          <h3>Color System</h3>
          <div className="theme-token-grid">
            {(['bg', 'bgSecondary', 'surface', 'surfaceElevated', 'text', 'textSecondary', 'textMuted', 'accent', 'accentSecondary', 'accentEmotional', 'accentProof', 'border', 'borderSubtle', 'borderStrong', 'glow'] as const).map(key => (
              <ThemeField key={key} label={key}>
                <input type="color" className="cr-color-swatch" value={activeTheme.colors?.[key] ?? '#000000'} onChange={event => updateTheme(theme => ({ ...theme, colors: { ...theme.colors, [key]: event.target.value } }))} />
              </ThemeField>
            ))}
          </div>
        </div>

        <div className="theme-token-section">
          <h3>Typography</h3>
          <ThemeField label="Display font">
            <input className="cr-input" value={activeTheme.typography?.displayFont ?? ''} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, displayFont: event.target.value } }))} />
          </ThemeField>
          <ThemeField label="Body font">
            <input className="cr-input" value={activeTheme.typography?.bodyFont ?? ''} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, bodyFont: event.target.value } }))} />
          </ThemeField>
          <div className="theme-token-grid">
            <ThemeField label="Heading weight">
              <input className="cr-input" type="number" min={100} max={900} step={50} value={activeTheme.typography?.headingWeight ?? 400} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, headingWeight: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Line height">
              <input className="cr-input" type="number" min={1} max={2.5} step={0.05} value={activeTheme.typography?.lineHeight ?? 1.5} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, lineHeight: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Display size">
              <input className="cr-input" value={activeTheme.typography?.typeDisplay ?? ''} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, typeDisplay: event.target.value } }))} />
            </ThemeField>
          </div>
        </div>

        <div className="theme-token-section">
          <h3>Atmosphere</h3>
          <div className="theme-token-grid">
            <ThemeField label="Background type">
              <select className="cr-select" value={activeTheme.background?.type ?? 'trace-grid'} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, type: event.target.value as ThemeBackgroundType } }))}>
                {backgroundTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </ThemeField>
            <ThemeField label="Dot spacing">
              <input className="cr-input" type="number" min={12} max={96} value={activeTheme.background?.dotSpacing ?? 24} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, dotSpacing: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Dot opacity">
              <input className="cr-input" type="number" min={0} max={0.3} step={0.01} value={activeTheme.background?.dotOpacity ?? 0.1} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, dotOpacity: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Vignette">
              <input className="cr-input" type="number" min={0} max={1} step={0.01} value={activeTheme.background?.vignetteOpacity ?? 0.5} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, vignetteOpacity: Number(event.target.value) } }))} />
            </ThemeField>
          </div>
        </div>

        <div className="theme-token-section">
          <h3>Motion and Layout</h3>
          <div className="theme-token-grid">
            <ThemeField label="Motion personality">
              <select className="cr-select" value={activeTheme.motion?.personality ?? 'restrained'} onChange={event => updateTheme(theme => ({ ...theme, motion: { ...theme.motion, personality: event.target.value as ThemeMotionPersonality } }))}>
                {motionPersonalities.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </ThemeField>
            <ThemeField label="Transition style">
              <select className="cr-select" value={activeTheme.motion?.transitionStyle ?? defaultTransitionStyle(activeTheme.motion?.personality ?? 'restrained')} onChange={event => updateTheme(theme => ({ ...theme, motion: { ...theme.motion, transitionStyle: event.target.value as ThemeTransitionStyle } }))}>
                {transitionStyles.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </ThemeField>
            <ThemeField label="Transition ms">
              <input className="cr-input" type="number" min={100} max={500} value={activeTheme.motion?.transitionDuration ?? 300} onChange={event => updateTheme(theme => ({ ...theme, motion: { ...theme.motion, transitionDuration: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Density">
              <select className="cr-select" value={activeTheme.layout?.density ?? 'comfortable'} onChange={event => updateTheme(theme => ({ ...theme, spacing: { ...theme.spacing, density: event.target.value as ThemeDensity }, layout: { ...theme.layout, density: event.target.value as ThemeDensity } }))}>
                {densities.map(density => <option key={density} value={density}>{density}</option>)}
              </select>
            </ThemeField>
            <ThemeField label="Section Y">
              <input className="cr-input" value={activeTheme.layout?.sectionPaddingTop ?? ''} onChange={event => updateTheme(theme => ({ ...theme, spacing: { ...theme.spacing, sectionY: event.target.value }, layout: { ...theme.layout, sectionPaddingTop: event.target.value, sectionPaddingBottom: event.target.value } }))} />
            </ThemeField>
            <ThemeField label="Card radius">
              <input className="cr-input" value={activeTheme.radius?.card ?? ''} onChange={event => updateTheme(theme => ({ ...theme, radius: { ...theme.radius, card: event.target.value, button: event.target.value }, layout: { ...theme.layout, borderRadius: event.target.value } }))} />
            </ThemeField>
          </div>
        </div>
      </details>
    </div>
  );
}
