import { useEffect, useState } from 'react';
import type { SiteConfig, SectionConfig, ProjectConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { projectTabIconMap, resolveIconName } from '../icons/iconRegistry';
import MetadataText from '../typography/MetadataText';
import ProjectTitle from '../typography/ProjectTitle';
import SectionHeading from '../typography/SectionHeading';

interface Props {
  config: SiteConfig;
  section: SectionConfig;
  openProjectId: string | null;
}

function CaseFile({ config, project, isOpen: defaultOpen }: { config: SiteConfig; project: ProjectConfig; isOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [storyMode, setStoryMode] = useState<'story' | 'system'>('story');
  const [activeTab, setActiveTab] = useState('problem');
  const [proofOpen, setProofOpen] = useState(false);
  const caseBodyId = `${project.id}-case-body`;
  const proofDrawerId = `${project.id}-proof-drawer`;
  const drawer = project.proofDrawer;
  const builderModes = config.builderModes.modes;

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  const tabs = [
    { key: 'problem', label: 'Problem', content: project.problem },
    { key: 'system', label: 'System', content: project.system },
    { key: 'stack', label: 'Stack', content: project.stack },
    { key: 'proof', label: 'Proof', content: project.proofThemes },
    { key: 'shows', label: 'Shows', content: project.shows },
  ];

  return (
    <article className={`case-file${isOpen ? ' is-open' : ''}`} data-case-file="" data-project={project.id}>
      <button
        className="case-summary"
        type="button"
        aria-expanded={isOpen}
        aria-controls={caseBodyId}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="case-index icon-align-chip">
          <Icon name="archive" size="xs" tone={isOpen ? 'accent' : 'muted'} />
          <MetadataText config={config.typographySystem}>{project.caseNumber}</MetadataText>
        </span>
        <span className="case-name"><ProjectTitle config={config} project={project} /></span>
        <span className="case-type"><MetadataText config={config.typographySystem}>{project.type}</MetadataText></span>
        <span className="case-indicator icon-align-status" aria-hidden="true">
          <MetadataText config={config.typographySystem}>{isOpen ? 'open' : 'closed'}</MetadataText>
          <Icon name="chevron" size="xs" tone="accent" state={isOpen ? 'active' : 'idle'} />
        </span>
      </button>

      <div className="case-body" id={caseBodyId}>
        <div className="case-inner">
          <div className="case-narrative">
            <div className="project-mode" role="group" aria-label={`${project.name} project mode`}>
              {builderModes.map(mode => (
                <button key={mode.id} className={`icon-align-inline${storyMode === mode.id ? ' is-active' : ''}`} type="button" aria-pressed={storyMode === mode.id} onClick={() => setStoryMode(mode.id)}>
                  <Icon name={resolveIconName(mode.icon, mode.id === 'story' ? 'story' : 'system')} size="xs" tone={storyMode === mode.id ? 'accent' : 'muted'} />
                  {mode.label}
                </button>
              ))}
            </div>

            <div className={`mode-copy${storyMode === 'story' ? ' is-active' : ''}`}>
              {project.storyDescription.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <div className={`mode-copy${storyMode === 'system' ? ' is-active' : ''}`}>
              <div className="system-flow" aria-label={`${project.name} system flow`}>
                {project.systemFlow.map((step) => (
                  <span key={step} className="icon-align-chip">
                    <Icon name="trace" size="xs" tone="muted" />
                    {step}
                  </span>
                ))}
              </div>
              <p>{project.systemDescription}</p>
            </div>
          </div>

          <div className="case-tabs" data-tabs="">
            <div className="tab-list" role="tablist" aria-label={`${project.name} dossier tabs`}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  id={`${project.id}-${tab.key}-tab`}
                  className={`icon-align-inline${activeTab === tab.key ? ' is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  aria-controls={`${project.id}-${tab.key}-panel`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon name={projectTabIconMap[tab.key] ?? 'trace'} size="xs" tone={activeTab === tab.key ? 'accent' : 'muted'} />
                  {tab.label}
                </button>
              ))}
            </div>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                id={`${project.id}-${tab.key}-panel`}
                className={`tab-panel${activeTab === tab.key ? ' is-active' : ''}`}
                role="tabpanel"
                aria-labelledby={`${project.id}-${tab.key}-tab`}
              >
                {tab.content}
              </div>
            ))}
          </div>

          {drawer.enabled && (
            <div className={`proof-drawer${proofOpen ? ' is-open' : ''}`}>
              <button
                className="proof-drawer-trigger"
                type="button"
                aria-expanded={proofOpen}
                aria-controls={proofDrawerId}
                onClick={() => setProofOpen(!proofOpen)}
              >
                <span className="icon-align-inline">
                  <Icon name="proof" size="sm" tone="accent" />
                  {drawer.label}
                </span>
                <span className="icon-align-status">
                  <MetadataText config={config.typographySystem}>{proofOpen ? 'close' : 'inspect'}</MetadataText>
                  <Icon name="chevron" size="xs" tone="accent" state={proofOpen ? 'active' : 'idle'} />
                </span>
              </button>
              <div className="proof-drawer-body" id={proofDrawerId} aria-hidden={!proofOpen}>
                {proofOpen && (
                  <div>
                    <div className="proof-drawer-inner">
                      <div className="proof-drawer-heading">
                        <h4>{drawer.title}</h4>
                        <p>{drawer.description}</p>
                      </div>
                      <div className="proof-slot-grid">
                        {[...drawer.items].sort((a, b) => a.order - b.order).map(item => (
                          <article className={`proof-slot is-${item.status}`} key={item.id}>
                            <span className="proof-slot-icon"><Icon name={resolveIconName(item.icon, 'proof')} size="xs" tone={item.status === 'ready' ? 'accent' : 'muted'} /></span>
                            <div>
                              <h5>{item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a> : item.label}</h5>
                              <p>{item.description}</p>
                            </div>
                            <span className="proof-slot-status"><MetadataText config={config.typographySystem}>{item.status === 'ready' ? 'attached' : 'slot_ready'}</MetadataText></span>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection({ config, section, openProjectId }: Props) {
  return (
    <section
      className="section-shell section-frame"
      id={section.id}
      data-section-id={section.sectionId}
      data-signal={section.signal}
      data-proof-level={section.proofLevel}
      data-system-status={section.systemStatus}
    >
      <div className="trace-label" aria-hidden="true">
        <MetadataText config={config.typographySystem}>
          section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}
        </MetadataText>
      </div>
      <div className="section-rail">
        <p className="section-kicker"><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>
        {section.railLabel && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}
      </div>
      <div className="section-main">
        <SectionHeading config={config} section={section} heading={section.heading}>
          <div>
            {section.descriptionAtmospheric && <p data-atmospheric="">{section.descriptionAtmospheric}</p>}
            {section.descriptionDirect && <p data-direct="">{section.descriptionDirect}</p>}
          </div>
        </SectionHeading>
        {config.builderModes.enabled && (
          <aside className="builder-mode-guide" aria-label="Project reading modes">
            <div>
              <span><MetadataText config={config.typographySystem}>{config.builderModes.sectionLabel}</MetadataText></span>
              <h3>{config.builderModes.title}</h3>
              <p>{config.builderModes.description}</p>
            </div>
            <div className="builder-mode-list">
              {config.builderModes.modes.map(mode => (
                <article key={mode.id}>
                  <Icon name={resolveIconName(mode.icon, mode.id === 'story' ? 'story' : 'system')} size="sm" tone="accent" />
                  <div>
                    <h4>{mode.label}</h4>
                    <p>{mode.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        )}
        <div className="case-files" aria-label="Project case files">
          {config.projects.map((project, idx) => (
            <CaseFile
              key={project.id}
              config={config}
              project={project}
              isOpen={openProjectId ? project.id === openProjectId : idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
