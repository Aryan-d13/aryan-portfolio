import { useState, useCallback, useEffect } from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ReactLenis } from 'lenis/react';
import BackgroundSystem from '../components/layout/BackgroundSystem';
import Header from '../components/layout/Header';
import CommandPalette from '../components/layout/CommandPalette';
import HeroSection from '../components/public/HeroSection';
import StatementSection from '../components/public/StatementSection';
import ProjectsSection from '../components/public/ProjectsSection';
import ProofSection from '../components/public/ProofSection';
import StackSection from '../components/public/StackSection';
import { PhilosophySection, HumanSection, TimelineSection, ContactSection } from '../components/public/Sections';
import { AntiPatternsSection, FieldNotesSection, OperatingManualSection, SignalProfileSection } from '../components/public/IdentitySections';
import type { SectionConfig, SiteConfig } from '../types/siteConfig';
import { applyTheme } from '../themes/utils/applyThemeTokens';
import { validateTheme } from '../themes/utils/themeValidation';
import { useBoot } from '../components/boot/BootProvider';

const SECTION_COMPONENTS: Record<string, React.FC<{ config: SiteConfig; section: SectionConfig; openProjectId: string | null }>> = {
  hero: ({ config, section }) => <HeroSection config={config} section={section} />,
  statement: ({ config, section }) => <StatementSection config={config} section={section} />,
  'signal-profile': ({ config, section }) => <SignalProfileSection config={config} section={section} />,
  projects: ({ config, section, openProjectId }) => <ProjectsSection config={config} section={section} openProjectId={openProjectId} />,
  proof: ({ config, section }) => <ProofSection config={config} section={section} />,
  'anti-patterns': ({ config, section }) => <AntiPatternsSection config={config} section={section} />,
  stack: ({ config, section }) => <StackSection config={config} section={section} />,
  'field-notes': ({ config, section }) => <FieldNotesSection config={config} section={section} />,
  philosophy: ({ config, section }) => <PhilosophySection config={config} section={section} />,
  'operating-manual': ({ config, section }) => <OperatingManualSection config={config} section={section} />,
  human: ({ config, section }) => <HumanSection config={config} section={section} />,
  timeline: ({ config, section }) => <TimelineSection config={config} section={section} />,
  contact: ({ config, section }) => <ContactSection config={config} section={section} />,
};

export default function HomePage() {
  const { config, setConfig } = useSiteConfig();
  const { isReady: bootReady } = useBoot();
  const [commandOpen, setCommandOpen] = useState(false);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  // Listen for config updates from Control Room iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'CONFIG_UPDATE') {
        try {
          if (event.data.theme && validateTheme(event.data.theme).valid) {
            applyTheme(event.data.theme, { transition: true });
          }
          setConfig(event.data.config);
        } catch (e) { console.warn('[HomePage] Bad config update:', e); }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setConfig]);

  // Keyboard: '/' or 'k' opens command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const isTyping = t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement || t?.isContentEditable;
      if (!isTyping && (e.key === '/' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleOpenProject = useCallback((projectId: string) => {
    setOpenProjectId(projectId);
  }, []);

  const sections = [...config.sections].filter(s => s.visible !== false).sort((a, b) => a.order - b.order);

  const isSmoothScrollDisabled = config.motion.reducedMotion || !config.motion.enabled || !bootReady;

  const content = (
    <>
      <BackgroundSystem config={config} />
      <a className="skip-link" href="#main">Skip to content</a>
      <Header config={config} onOpenCommand={() => setCommandOpen(true)} />
      <main id="main">
        {sections.map(section => {
          const Component = SECTION_COMPONENTS[section.type];
          if (!Component) return null;
          return <Component key={section.id} config={config} section={section} openProjectId={openProjectId} />;
        })}
      </main>
      <footer className="site-footer" style={{ padding: '40px 24px', borderTop: '1px solid var(--line-subtle)', textAlign: 'center', opacity: 0.8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 'var(--container)', margin: '0 auto', fontSize: 'var(--type-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <span>Copyright {new Date().getFullYear()} Aryan Sharma.</span>
          <a href="/control-room" className="footer-admin-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px dotted var(--text-muted)', paddingBottom: '2px' }}>[system_control]</a>
        </div>
      </footer>
      <CommandPalette
        config={config}
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onOpenProject={handleOpenProject}
      />
    </>
  );

  if (isSmoothScrollDisabled) {
    return content;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, syncTouch: false }}>
      {content}
    </ReactLenis>
  );
}
