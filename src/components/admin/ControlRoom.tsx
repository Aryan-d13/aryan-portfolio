import { useState, useCallback, useRef, useEffect } from 'react';
import type { SiteConfig } from '../../types/siteConfig';
import { loadConfig, saveConfig, saveDraft, loadDraft, clearDraft, downloadConfig, readConfigFile, importConfig, resetToDefaults } from '../../config/configManager';
import { useThemeEngine } from '../../hooks/useThemeEngine';
import type { ThemeDefinition } from '../../themes/themeTypes';
import { mergeThemeIntoConfig } from '../../themes/utils/themeConfigBridge';
import Icon from '../icons/Icon';
import NavPanel from './NavPanel';
import ControlRoomOverview from './ControlRoomOverview';
import { toast, confirmDialog, ToastContainer, ConfirmModal } from '../ui/Toast';
import ThemeEditorPanel from '../theme/ThemeEditorPanel';
import {
  IdentityEditor, SectionsEditor, ProjectsEditor, ProofEditor, SkillsEditor,
  PhilosophyEditor, HumanEditor, TimelineEditor, ContactEditor, IdentityLayerEditor, LabModulesEditor,
  TypographyEditor, ColorsEditor, BackgroundEditor, MotionEditor, LayoutEditor,
  SeoEditor, AssetsEditor, JsonEditor, PortraitEditor,
} from './editors/AllEditors';

function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }

interface Props {
  initialConfig: SiteConfig;
}

export default function ControlRoom({ initialConfig }: Props) {
  const themeEngine = useThemeEngine();
  const [draftConfig, setDraftConfig] = useState<SiteConfig>(() => {
    const draft = loadDraft();
    if (draft) { toast('Resumed from unsaved draft', 'info'); return draft; }
    return mergeThemeIntoConfig(deepClone(initialConfig), themeEngine.activeTheme);
  });
  const [activePanel, setActivePanel] = useState('overview');
  const [unsaved, setUnsaved] = useState(() => !!loadDraft());
  const [mobileTab, setMobileTab] = useState<'nav' | 'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const importRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [, forceRender] = useState(0);

  const publishPreview = useCallback((config: SiteConfig, theme?: ThemeDefinition) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      previewRef.current?.contentWindow?.postMessage({ type: 'CONFIG_UPDATE', config, theme }, '*');
    }, 300);
  }, []);

  const markUnsaved = useCallback(() => {
    setUnsaved(true);
    // Force re-render to pick up mutations
    forceRender(n => n + 1);
    // Debounced preview update
    publishPreview(draftConfig);
  }, [draftConfig, publishPreview]);

  const markThemeDesignUnsaved = useCallback(() => {
    const nextTheme = themeEngine.updateActiveThemeFromConfig(draftConfig);
    setUnsaved(true);
    forceRender(n => n + 1);
    publishPreview(mergeThemeIntoConfig(draftConfig, nextTheme), nextTheme);
  }, [draftConfig, publishPreview, themeEngine]);

  const handleThemeChanged = useCallback((theme: ThemeDefinition) => {
    const nextConfig = mergeThemeIntoConfig(draftConfig, theme);
    setDraftConfig(nextConfig);
    setUnsaved(true);
    previewRef.current?.contentWindow?.postMessage({ type: 'CONFIG_UPDATE', config: nextConfig, theme }, '*');
  }, [draftConfig]);

  const markSaved = useCallback(() => setUnsaved(false), []);

  // Keyboard shortcut: Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleApply();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Send initial config to preview after iframe loads
  useEffect(() => {
    const iframe = previewRef.current;
    if (!iframe) return;
    const handler = () => {
      setTimeout(() => {
        iframe.contentWindow?.postMessage({ type: 'CONFIG_UPDATE', config: draftConfig, theme: themeEngine.activeTheme }, '*');
      }, 500);
    };
    iframe.addEventListener('load', handler);
    return () => iframe.removeEventListener('load', handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveDraft = () => { saveDraft(draftConfig); toast('Draft saved', 'success'); };

  const handleApply = async () => {
    const result = saveConfig(draftConfig);
    if (result.success) {
      clearDraft();
      markSaved();
      previewRef.current?.contentWindow?.postMessage({ type: 'CONFIG_UPDATE', config: draftConfig, theme: themeEngine.activeTheme }, '*');
      toast('Applied to site locally', 'success');

      // Async cloud sync
      toast('Syncing with cloud database...', 'info');
      const cloudSuccess = await themeEngine.saveConfigGlobally(draftConfig);
      if (cloudSuccess) {
        toast('Synced to cloud database', 'success');
      } else {
        toast('Local save ok. Cloud sync failed/offline.', 'warning');
      }
    } else { toast(`Validation failed: ${result.errors[0]}`, 'error'); }
  };

  const handleExport = () => { downloadConfig(draftConfig); toast('Config exported', 'success'); };

  const handleImport = async () => {
    const file = importRef.current?.files?.[0];
    if (!file) return;
    try {
      const text = await readConfigFile(file);
      const result = importConfig(text);
      if (result.success && result.config) {
        setDraftConfig(result.config);
        setUnsaved(true);
        toast('Config imported', 'success');
      } else { toast(`Import failed: ${result.errors[0]}`, 'error'); }
    } catch (e) { toast(`Import error: ${(e as Error).message}`, 'error'); }
    if (importRef.current) importRef.current.value = '';
  };

  const handleReset = async () => {
    const ok = await confirmDialog('Restore Defaults', 'Reset ALL settings to defaults? This cannot be undone.');
    if (ok) {
      const defaults = resetToDefaults();
      setDraftConfig(defaults);
      markSaved();
      previewRef.current?.contentWindow?.postMessage({ type: 'CONFIG_UPDATE', config: defaults, theme: themeEngine.activeTheme }, '*');
      toast('Restored to defaults', 'warning');
    }
  };

  // Editor panel router
  const editors: Record<string, React.ReactNode> = {
    overview: <ControlRoomOverview config={draftConfig} onSelect={setActivePanel} />,
    identity: <IdentityEditor config={draftConfig} onChange={markUnsaved} />,
    'identity-layer': <IdentityLayerEditor config={draftConfig} onChange={markUnsaved} />,
    sections: <SectionsEditor config={draftConfig} onChange={markUnsaved} />,
    projects: <ProjectsEditor config={draftConfig} onChange={markUnsaved} />,
    proof: <ProofEditor config={draftConfig} onChange={markUnsaved} />,
    skills: <SkillsEditor config={draftConfig} onChange={markUnsaved} />,
    philosophy: <PhilosophyEditor config={draftConfig} onChange={markUnsaved} />,
    human: <HumanEditor config={draftConfig} onChange={markUnsaved} />,
    timeline: <TimelineEditor config={draftConfig} onChange={markUnsaved} />,
    contact: <ContactEditor config={draftConfig} onChange={markUnsaved} />,
    theme: <ThemeEditorPanel config={draftConfig} onConfigChange={markUnsaved} onThemeChanged={handleThemeChanged} />,
    portrait: <PortraitEditor config={draftConfig} onChange={markUnsaved} />,
    typography: <TypographyEditor config={draftConfig} onChange={markThemeDesignUnsaved} />,
    colors: <ColorsEditor config={draftConfig} onChange={markThemeDesignUnsaved} />,
    background: <BackgroundEditor config={draftConfig} onChange={markThemeDesignUnsaved} />,
    motion: <MotionEditor config={draftConfig} onChange={markThemeDesignUnsaved} />,
    layout: <LayoutEditor config={draftConfig} onChange={markThemeDesignUnsaved} />,
    seo: <SeoEditor config={draftConfig} onChange={markUnsaved} />,
    assets: <AssetsEditor config={draftConfig} onChange={markUnsaved} />,
    'lab-modules': <LabModulesEditor config={draftConfig} onChange={markUnsaved} />,
    json: <JsonEditor config={draftConfig} onChange={markUnsaved} />,
  };

  const previewWrapClass = `cr-preview-frame-wrap${previewDevice !== 'desktop' ? ` ${previewDevice}` : ''}`;

  return (
    <div className="cr-app">
      {/* TOP BAR */}
      <header className="cr-topbar">
        <div className="cr-topbar-left">
          <span className="cr-topbar-glyph">CR</span>
          <span className="cr-topbar-title">Control Room</span>
          <span className={`cr-topbar-status icon-align-status${unsaved ? ' unsaved' : ''}`}>
            <Icon name={unsaved ? 'warning' : 'success'} size="xs" tone={unsaved ? 'warning' : 'success'} state={unsaved ? 'warning' : 'success'} />
            {unsaved ? 'unsaved' : 'synced'}
          </span>
        </div>
        <div className="cr-topbar-actions">
          <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={handleSaveDraft}><Icon name="save" size="xs" tone="muted" />save draft</button>
          <button className="cr-btn cr-btn-primary icon-align-inline" type="button" onClick={handleApply}><Icon name="success" size="xs" tone="accent" />apply to site</button>
          <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={handleExport}><Icon name="export" size="xs" tone="muted" />export</button>
          <button className="cr-btn cr-btn-ghost icon-align-inline" type="button" onClick={() => importRef.current?.click()}><Icon name="import" size="xs" tone="muted" />import</button>
          <button className="cr-btn cr-btn-danger icon-align-inline" type="button" onClick={handleReset}><Icon name="reset" size="xs" tone="error" />reset</button>
          <a href="/" className="cr-btn cr-btn-ghost icon-align-inline" target="_blank" rel="noreferrer"><Icon name="externalLink" size="xs" tone="muted" />view site</a>
        </div>
      </header>

      {/* MOBILE TAB BAR */}
      <nav className="cr-mobile-tabs">
        {(['nav', 'editor', 'preview'] as const).map(tab => (
          <button key={tab} className={`icon-align-inline${mobileTab === tab ? ' is-active' : ''}`} type="button"
            onClick={() => setMobileTab(tab)}>
            <Icon name={tab === 'nav' ? 'menu' : tab === 'editor' ? 'edit' : 'layout'} size="xs" tone={mobileTab === tab ? 'accent' : 'muted'} />
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* THREE-PANEL LAYOUT */}
      <div className="cr-panels">
        <div className={mobileTab === 'nav' ? 'is-visible' : ''} style={mobileTab !== 'nav' ? {} : {}}>
          <NavPanel activePanel={activePanel} onSelect={(id) => { setActivePanel(id); setMobileTab('editor'); }} />
        </div>

        <main className={`cr-panel cr-editor-panel${mobileTab === 'editor' ? ' is-visible' : ''}`}>
          <div className="cr-editor-content">
            {editors[activePanel]}
          </div>
        </main>

        <aside className={`cr-panel cr-preview-panel${mobileTab === 'preview' ? ' is-visible' : ''}`}>
          <div className="cr-preview-toolbar">
            <span className="cr-preview-label icon-align-status"><Icon name="signal" size="xs" tone="accent" />live preview</span>
            <div className="cr-preview-devices">
              {(['desktop', 'tablet', 'mobile'] as const).map(device => (
                <button key={device} className={`icon-align-inline${previewDevice === device ? ' is-active' : ''}`}
                  type="button" onClick={() => setPreviewDevice(device)}>
                  <Icon name={device === 'desktop' ? 'layout' : device === 'tablet' ? 'image' : 'terminal'} size="xs" tone={previewDevice === device ? 'accent' : 'muted'} />
                  {device}
                </button>
              ))}
            </div>
          </div>
          <div className={previewWrapClass}>
            <iframe ref={previewRef} src="/" title="Live site preview" />
          </div>
        </aside>
      </div>

      {/* Hidden import input */}
      <input ref={importRef} type="file" accept=".json" hidden onChange={handleImport} />

      {/* Toast + Modal */}
      <ToastContainer />
      <ConfirmModal />
    </div>
  );
}
