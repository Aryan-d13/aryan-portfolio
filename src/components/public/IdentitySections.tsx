import { useState, type ReactNode } from 'react';
import type { IdentityModuleConfig, SectionConfig, SiteConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { resolveIconName } from '../icons/iconRegistry';
import MetadataText from '../typography/MetadataText';
import SectionHeading from '../typography/SectionHeading';
import { useInView } from '../../hooks/useInView';

interface Props {
  config: SiteConfig;
  section: SectionConfig;
}

interface FrameProps extends Props {
  module: IdentityModuleConfig;
  children: ReactNode;
}

function ModuleFrame({ config, section, module, children }: FrameProps) {
  const ref = useInView<HTMLElement>({ threshold: 0.1, once: true });
  if (!module.enabled) return null;

  return (
    <section ref={ref} className="section-shell section-frame identity-module-shell" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true">
        <MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText>
      </div>
      <div className="section-rail">
        <p className="section-kicker"><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>
        {(module.sectionLabel || section.railLabel) && (module.sectionLabel || section.railLabel)?.toLowerCase() !== section.kicker?.toLowerCase() && (
          <span><MetadataText config={config.typographySystem}>{module.sectionLabel || section.railLabel}</MetadataText></span>
        )}
      </div>
      <div className="section-main">
        <SectionHeading config={config} section={section} heading={module.title || section.heading}>
          {module.description && <p>{module.description}</p>}
        </SectionHeading>
        {children}
      </div>
    </section>
  );
}


function visibleItems(module: IdentityModuleConfig) {
  return [...module.items].filter(item => item.visible !== false).sort((a, b) => a.order - b.order);
}

function SignalProfileGrid({ config, module }: { config: SiteConfig; module: IdentityModuleConfig }) {
  const items = visibleItems(module);

  return (
    <div className="signal-profile-grid" aria-label="Signal profile diagnostics">
      {items.map((item, index) => (
        <article className="signal-profile-item" key={item.id} style={{ '--stagger-index': index } as React.CSSProperties}>
          <span className="identity-item-index icon-align-status">
            <Icon name={resolveIconName(item.icon, 'signal')} size="xs" tone="accent" />
            <MetadataText config={config.typographySystem}>{String(index + 1).padStart(2, '0')}</MetadataText>
          </span>
          <span className="identity-item-label"><MetadataText config={config.typographySystem}>{item.label}</MetadataText></span>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

function AntiPatternGrid({ module }: { module: IdentityModuleConfig }) {
  const items = visibleItems(module);

  return (
    <div className="anti-pattern-grid" aria-label="Professional anti-patterns">
      {items.map((item, index) => (
        <article className="anti-pattern-item" key={item.id} style={{ '--stagger-index': index } as React.CSSProperties}>
          <Icon name={resolveIconName(item.icon, 'warning')} size="sm" tone="muted" />
          <div>
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function FieldNotesGrid({ config, module }: { config: SiteConfig; module: IdentityModuleConfig }) {
  const items = visibleItems(module);

  return (
    <div className="field-notes-grid" aria-label="Builder field notes">
      {items.map((item, index) => (
        <article className="field-note" key={item.id} style={{ '--stagger-index': index } as React.CSSProperties}>
          <span className="field-note-meta icon-align-status">
            <Icon name={resolveIconName(item.icon, 'log')} size="xs" tone="accent" />
            <MetadataText config={config.typographySystem}>{item.label || `note_${String(index + 1).padStart(2, '0')}`}</MetadataText>
          </span>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

function OperatingManualList({ config, module }: { config: SiteConfig; module: IdentityModuleConfig }) {
  const items = visibleItems(module);

  return (
    <ol className="operating-manual" aria-label="Working style defaults">
      {items.map((item, index) => (
        <li key={item.id} style={{ '--stagger-index': index } as React.CSSProperties}>
          <span className="manual-index"><MetadataText config={config.typographySystem}>{String(index + 1).padStart(2, '0')}</MetadataText></span>
          <Icon name={resolveIconName(item.icon, 'trace')} size="sm" tone="muted" />
          <span className="manual-label"><MetadataText config={config.typographySystem}>{item.label}</MetadataText></span>
          <p>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}


export function SignalProfileSection({ config, section }: Props) {
  const module = config.signalProfile;
  const [activeFacet, setActiveFacet] = useState<'profile' | 'refusals' | 'notes' | 'manual'>('profile');
  const facets = [
    { id: 'profile', label: config.signalProfile.sectionLabel },
    { id: 'refusals', label: config.antiPatterns.sectionLabel },
    { id: 'notes', label: config.fieldNotes.sectionLabel },
    { id: 'manual', label: config.operatingManual.sectionLabel },
  ] as const;

  return (
    <ModuleFrame config={config} section={section} module={module}>
      <div className="signal-facet-tabs" role="tablist" aria-label="Signal profile facets">
        {facets.map(facet => (
          <button
            aria-controls={`signal-facet-${facet.id}`}
            aria-selected={activeFacet === facet.id}
            key={facet.id}
            onClick={() => setActiveFacet(facet.id)}
            role="tab"
            type="button"
          >
            {facet.label}
          </button>
        ))}
      </div>
      {facets.map(facet => (
        <div className="signal-facet-panel" hidden={activeFacet !== facet.id} id={`signal-facet-${facet.id}`} key={facet.id} role="tabpanel">
          {facet.id === 'profile' && activeFacet === facet.id && <SignalProfileGrid config={config} module={config.signalProfile} />}
          {facet.id === 'refusals' && activeFacet === facet.id && <AntiPatternGrid module={config.antiPatterns} />}
          {facet.id === 'notes' && activeFacet === facet.id && <FieldNotesGrid config={config} module={config.fieldNotes} />}
          {facet.id === 'manual' && activeFacet === facet.id && <OperatingManualList config={config} module={config.operatingManual} />}
        </div>
      ))}
    </ModuleFrame>
  );
}

export function AntiPatternsSection({ config, section }: Props) {
  return (
    <ModuleFrame config={config} section={section} module={config.antiPatterns}>
      <AntiPatternGrid module={config.antiPatterns} />
    </ModuleFrame>
  );
}

export function FieldNotesSection({ config, section }: Props) {
  return (
    <ModuleFrame config={config} section={section} module={config.fieldNotes}>
      <FieldNotesGrid config={config} module={config.fieldNotes} />
    </ModuleFrame>
  );
}

export function OperatingManualSection({ config, section }: Props) {
  return (
    <ModuleFrame config={config} section={section} module={config.operatingManual}>
      <OperatingManualList config={config} module={config.operatingManual} />
    </ModuleFrame>
  );
}
