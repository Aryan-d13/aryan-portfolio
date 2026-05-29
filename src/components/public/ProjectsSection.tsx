import { useState } from 'react';
import type { SiteConfig, SectionConfig, ProjectConfig } from '../../types/siteConfig';
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
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="case-index"><MetadataText config={config.typographySystem}>{project.caseNumber}</MetadataText></span>
        <span className="case-name"><ProjectTitle config={config} project={project} /></span>
        <span className="case-type"><MetadataText config={config.typographySystem}>{project.type}</MetadataText></span>
        <span className="case-indicator" aria-hidden="true"><MetadataText config={config.typographySystem}>{isOpen ? 'open' : 'closed'}</MetadataText></span>
      </button>

      <div className="case-body">
        <div className="case-inner">
          <div className="case-narrative">
            <div className="project-mode" role="group" aria-label={`${project.name} project mode`}>
              <button className={storyMode === 'story' ? 'is-active' : ''} type="button" onClick={() => setStoryMode('story')}>Story Mode</button>
              <button className={storyMode === 'system' ? 'is-active' : ''} type="button" onClick={() => setStoryMode('system')}>System Mode</button>
            </div>

            <div className={`mode-copy${storyMode === 'story' ? ' is-active' : ''}`}>
              {project.storyDescription.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <div className={`mode-copy${storyMode === 'system' ? ' is-active' : ''}`}>
              <div className="system-flow" aria-label={`${project.name} system flow`}>
                {project.systemFlow.map((step) => <span key={step}>{step}</span>)}
              </div>
              <p>{project.systemDescription}</p>
            </div>
          </div>

          <div className="case-tabs" data-tabs="">
            <div className="tab-list" role="tablist" aria-label={`${project.name} dossier tabs`}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={activeTab === tab.key ? 'is-active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`tab-panel${activeTab === tab.key ? ' is-active' : ''}`}
                role="tabpanel"
              >
                {tab.content}
              </div>
            ))}
          </div>
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
