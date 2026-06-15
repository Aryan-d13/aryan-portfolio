import type { SiteConfig, SectionConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { skillIconMap } from '../icons/iconRegistry';
import MetadataText from '../typography/MetadataText';
import SectionHeading from '../typography/SectionHeading';
import AmbientMarquee from './AmbientMarquee';
import { useInView } from '../../hooks/useInView';

interface Props { config: SiteConfig; section: SectionConfig; }

export default function StackSection({ config, section }: Props) {
  const ref = useInView<HTMLElement>({ threshold: 0.1, once: true });
  const groups = [...(config.skillGroups || [])].sort((a, b) => a.order - b.order);
  return (
    <section ref={ref} className="section-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="section-rail"><p className="section-kicker"><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>{section.railLabel && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}</div>
      <div className="section-main">
        <SectionHeading config={config} section={section} heading={section.heading}>
          <div>
            {section.descriptionAtmospheric && <p data-atmospheric="">{section.descriptionAtmospheric}</p>}
            {section.descriptionDirect && <p data-direct="">{section.descriptionDirect}</p>}
          </div>
        </SectionHeading>
        <div className="stack-matrix" aria-label="System skill clusters">
          {groups.map((g, index) => (
            <article key={g.id} style={{ '--stagger-index': index } as React.CSSProperties}>
              <h3 className="icon-align-inline">
                <Icon name={skillIconMap[g.id] ?? 'stack'} size="sm" tone="accent" />
                {g.name}
              </h3>
              <p>{g.description}</p>
            </article>
          ))}
        </div>
        <AmbientMarquee items={groups.flatMap(g => g.skills || [])} />
      </div>
    </section>
  );
}

