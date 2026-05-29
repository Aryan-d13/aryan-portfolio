import type { SiteConfig, SectionConfig } from '../../types/siteConfig';

interface Props { config: SiteConfig; section: SectionConfig; }

export default function StackSection({ config, section }: Props) {
  const groups = [...(config.skillGroups || [])].sort((a, b) => a.order - b.order);
  return (
    <section className="section-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true">section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</div>
      <div className="section-rail"><p className="section-kicker">{section.kicker}</p>{section.railLabel && <span>{section.railLabel}</span>}</div>
      <div className="section-main">
        <div className="section-heading">
          <h2>{section.heading}</h2>
          <div>
            {section.descriptionAtmospheric && <p data-atmospheric="">{section.descriptionAtmospheric}</p>}
            {section.descriptionDirect && <p data-direct="">{section.descriptionDirect}</p>}
          </div>
        </div>
        <div className="stack-matrix" aria-label="System skill clusters">
          {groups.map(g => (
            <article key={g.id}><h3>{g.name}</h3><p>{g.description}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}
