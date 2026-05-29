import type { SiteConfig, SectionConfig } from '../../types/siteConfig';

interface Props { config: SiteConfig; section: SectionConfig; }

export default function ProofSection({ config, section }: Props) {
  const cards = [...(config.proofCards || [])].filter(c => c.visible !== false).sort((a, b) => a.order - b.order);
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
        <div className="proof-grid">
          {cards.map(card => (
            <article key={card.id} className="proof-item">
              <span>{card.index}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
