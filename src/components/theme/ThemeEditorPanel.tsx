import { useEffect, useRef, useState } from 'react';
import type { SiteConfig } from '../../types/siteConfig';
import type { ThemeBackgroundType, ThemeDefinition, ThemeDensity, ThemeMotionPersonality } from '../../themes/themeTypes';
import { useThemeEngine } from '../../hooks/useThemeEngine';
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
    activeTheme,
    activeThemeId,
    unsavedChanges,
    validation,
    setActiveTheme,
    duplicateTheme,
    resetActiveTheme,
    deleteCustomTheme,
    renameActiveTheme,
    updateDraftTheme,
    saveTheme,
    exportThemes,
    importThemes,
    getTheme,
  } = themeEngine;

  const importRef = useRef<HTMLInputElement>(null);
  const [renameValue, setRenameValue] = useState(activeTheme.name);

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

  const togglePublicSelector = () => {
    config.themeEngine = config.themeEngine ?? { publicSelectorEnabled: false };
    config.themeEngine.publicSelectorEnabled = !config.themeEngine.publicSelectorEnabled;
    onConfigChange();
  };

  return (
    <div className="theme-engine-panel">
      <div className="cr-editor-header">
        <h2>Theme Engine</h2>
        <p>Saved visual identity systems. Default themes stay immutable; custom variants hold your edits.</p>
        <div className="theme-engine-status">
          <span>{activeTheme.source === 'custom' ? 'custom editable theme' : 'built-in source preset'}</span>
          {unsavedChanges && <span className="is-dirty">unsaved theme changes</span>}
        </div>
      </div>

      <section className="theme-engine-block">
        <div className="theme-engine-toolbar">
          <ThemeField label="Active theme">
            <select className="cr-select" value={activeThemeId} onChange={event => applySelectedTheme(event.target.value)}>
              {allThemes.map(theme => (
                <option key={theme.id} value={theme.id}>{theme.name} - {theme.preview.vibeLabel}</option>
              ))}
            </select>
          </ThemeField>
          <button className="cr-btn cr-btn-primary" type="button" onClick={handleDuplicate}>duplicate theme</button>
          <button className="cr-btn cr-btn-ghost" type="button" onClick={handleReset}>reset active theme</button>
          <button className="cr-btn cr-btn-ghost" type="button" onClick={exportThemes}>export themes JSON</button>
          <button className="cr-btn cr-btn-ghost" type="button" onClick={() => importRef.current?.click()}>import themes JSON</button>
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
          <button className="cr-btn cr-btn-ghost" type="button" onClick={handleRename}>rename custom theme</button>
          <button className="cr-btn cr-btn-primary" type="button" onClick={saveTheme} disabled={!unsavedChanges}>save custom theme</button>
          <button className="cr-btn cr-btn-danger" type="button" onClick={handleDelete} disabled={activeTheme.source !== 'custom'}>delete custom theme</button>
        </div>

        {!validation.valid && (
          <div className="theme-validation-errors">
            <strong>Validation errors</strong>
            {validation.errors.map(error => <span key={error}>{error}</span>)}
          </div>
        )}
      </section>

      <details className="theme-token-editor" open>
        <summary>Edit current theme</summary>

        <div className="theme-token-section">
          <h3>Identity</h3>
          <ThemeField label="Short description">
            <input className="cr-input" value={activeTheme.shortDescription} onChange={event => updateTheme(theme => ({ ...theme, shortDescription: event.target.value }))} />
          </ThemeField>
          <ThemeField label="Emotional tone">
            <textarea className="cr-textarea" rows={2} value={activeTheme.emotionalTone} onChange={event => updateTheme(theme => ({ ...theme, emotionalTone: event.target.value }))} />
          </ThemeField>
        </div>

        <div className="theme-token-section">
          <h3>Color System</h3>
          <div className="theme-token-grid">
            {(['bg', 'bgSecondary', 'surface', 'surfaceElevated', 'text', 'textSecondary', 'textMuted', 'accent', 'accentSecondary', 'accentEmotional', 'accentProof', 'border', 'borderSubtle', 'borderStrong', 'glow'] as const).map(key => (
              <ThemeField key={key} label={key}>
                <input type="color" className="cr-color-swatch" value={activeTheme.colors[key]} onChange={event => updateTheme(theme => ({ ...theme, colors: { ...theme.colors, [key]: event.target.value } }))} />
              </ThemeField>
            ))}
          </div>
        </div>

        <div className="theme-token-section">
          <h3>Typography</h3>
          <ThemeField label="Display font">
            <input className="cr-input" value={activeTheme.typography.displayFont} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, displayFont: event.target.value } }))} />
          </ThemeField>
          <ThemeField label="Body font">
            <input className="cr-input" value={activeTheme.typography.bodyFont} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, bodyFont: event.target.value } }))} />
          </ThemeField>
          <div className="theme-token-grid">
            <ThemeField label="Heading weight">
              <input className="cr-input" type="number" min={100} max={900} step={50} value={activeTheme.typography.headingWeight} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, headingWeight: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Line height">
              <input className="cr-input" type="number" min={1} max={2.5} step={0.05} value={activeTheme.typography.lineHeight} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, lineHeight: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Display size">
              <input className="cr-input" value={activeTheme.typography.typeDisplay} onChange={event => updateTheme(theme => ({ ...theme, typography: { ...theme.typography, typeDisplay: event.target.value } }))} />
            </ThemeField>
          </div>
        </div>

        <div className="theme-token-section">
          <h3>Atmosphere</h3>
          <div className="theme-token-grid">
            <ThemeField label="Background type">
              <select className="cr-select" value={activeTheme.background.type} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, type: event.target.value as ThemeBackgroundType } }))}>
                {backgroundTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </ThemeField>
            <ThemeField label="Dot spacing">
              <input className="cr-input" type="number" min={12} max={96} value={activeTheme.background.dotSpacing} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, dotSpacing: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Dot opacity">
              <input className="cr-input" type="number" min={0} max={0.3} step={0.01} value={activeTheme.background.dotOpacity} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, dotOpacity: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Vignette">
              <input className="cr-input" type="number" min={0} max={1} step={0.01} value={activeTheme.background.vignetteOpacity} onChange={event => updateTheme(theme => ({ ...theme, background: { ...theme.background, vignetteOpacity: Number(event.target.value) } }))} />
            </ThemeField>
          </div>
        </div>

        <div className="theme-token-section">
          <h3>Motion and Layout</h3>
          <div className="theme-token-grid">
            <ThemeField label="Motion personality">
              <select className="cr-select" value={activeTheme.motion.personality} onChange={event => updateTheme(theme => ({ ...theme, motion: { ...theme.motion, personality: event.target.value as ThemeMotionPersonality } }))}>
                {motionPersonalities.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </ThemeField>
            <ThemeField label="Transition ms">
              <input className="cr-input" type="number" min={100} max={500} value={activeTheme.motion.transitionDuration} onChange={event => updateTheme(theme => ({ ...theme, motion: { ...theme.motion, transitionDuration: Number(event.target.value) } }))} />
            </ThemeField>
            <ThemeField label="Density">
              <select className="cr-select" value={activeTheme.layout.density} onChange={event => updateTheme(theme => ({ ...theme, spacing: { ...theme.spacing, density: event.target.value as ThemeDensity }, layout: { ...theme.layout, density: event.target.value as ThemeDensity } }))}>
                {densities.map(density => <option key={density} value={density}>{density}</option>)}
              </select>
            </ThemeField>
            <ThemeField label="Section Y">
              <input className="cr-input" value={activeTheme.layout.sectionPaddingTop} onChange={event => updateTheme(theme => ({ ...theme, spacing: { ...theme.spacing, sectionY: event.target.value }, layout: { ...theme.layout, sectionPaddingTop: event.target.value, sectionPaddingBottom: event.target.value } }))} />
            </ThemeField>
            <ThemeField label="Card radius">
              <input className="cr-input" value={activeTheme.radius.card} onChange={event => updateTheme(theme => ({ ...theme, radius: { ...theme.radius, card: event.target.value, button: event.target.value }, layout: { ...theme.layout, borderRadius: event.target.value } }))} />
            </ThemeField>
          </div>
        </div>
      </details>
    </div>
  );
}

