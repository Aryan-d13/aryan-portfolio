import type { SiteConfig, SectionConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { proofIconMap } from '../icons/iconRegistry';
import MetadataText from '../typography/MetadataText';
import SectionHeading from '../typography/SectionHeading';

interface Props { config: SiteConfig; section: SectionConfig; }

export default function ProofSection({ config, section }: Props) {
  const cards = [...(config.proofCards || [])].filter(c => c.visible !== false).sort((a, b) => a.order - b.order);
  return (
    <section className="section-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="section-rail"><p className="section-kicker"><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>{section.railLabel && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}</div>
      <div className="section-main">
        <SectionHeading config={config} section={section} heading={section.heading}>
          <div>
            {section.descriptionAtmospheric && <p data-atmospheric="">{section.descriptionAtmospheric}</p>}
            {section.descriptionDirect && <p data-direct="">{section.descriptionDirect}</p>}
          </div>
        </SectionHeading>
        <div className="proof-grid">
          {cards.map(card => (
            <article key={card.id} className="proof-item">
              <span className="proof-index icon-align-status">
                <Icon name={proofIconMap[card.id] ?? 'proof'} size="sm" tone="accent" />
                <MetadataText config={config.typographySystem}>{card.index}</MetadataText>
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
