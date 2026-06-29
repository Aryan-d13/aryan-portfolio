import type { SiteConfig, SectionConfig, TimelineEntry } from '../../types/siteConfig';
import Icon, { type IconName } from '../icons/Icon';
import { resolveIconName, timelineIconMap } from '../icons/iconRegistry';
import PortraitSelector from '../portrait/PortraitSelector';
import ManifestoLine from '../typography/ManifestoLine';
import MetadataText from '../typography/MetadataText';
import SectionHeading from '../typography/SectionHeading';
import TextTreatment from '../typography/Text';
import { useInView } from '../../hooks/useInView';


interface Props { config: SiteConfig; section: SectionConfig; }

function timelineIcon(tags: string[]): IconName {
  const tag = tags.find(t => timelineIconMap[t]);
  return tag ? timelineIconMap[tag] : 'log';
}

export function PhilosophySection({ config, section }: Props) {
  const ref = useInView<HTMLElement>({ threshold: 0.1, once: true });
  const lines = [...(config.philosophy || [])].sort((a, b) => a.order - b.order);
  return (
    <section ref={ref} className="principle-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="section-rail"><p className="section-kicker icon-align-inline"><Icon name="spark" size="xs" tone="accent" /><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>{section.railLabel && section.railLabel.toLowerCase() !== section.kicker.toLowerCase() && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}</div>
      <ul className="principles" aria-label="Operating principles">
        {lines.map((l, index) => <ManifestoLine key={l.id} config={config} line={l} index={index} />)}
      </ul>
    </section>
  );
}


export function HumanSection({ config, section }: Props) {
  const ref = useInView<HTMLElement>({ threshold: 0.1, once: true });
  const motifs = [...(config.humanLayer?.motifs || [])].filter(m => m.visible !== false).sort((a, b) => a.order - b.order);
  const tasteItems = [...(config.tasteLayer?.items || [])].filter(item => item.visible !== false).sort((a, b) => a.order - b.order);
  const glitches = [...(config.humanLayer?.glitches || [])].filter(item => item.visible !== false).sort((a, b) => a.order - b.order);
  return (
    <section ref={ref} className="section-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="section-rail"><p className="section-kicker"><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>{section.railLabel && section.railLabel.toLowerCase() !== section.kicker.toLowerCase() && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}</div>
      <div className="section-main">
        <SectionHeading config={config} section={section} heading={section.heading}>
          <div>
            {section.descriptionAtmospheric && <p data-atmospheric="">{section.descriptionAtmospheric}</p>}
            {section.descriptionDirect && <p data-direct="">{section.descriptionDirect}</p>}
          </div>
        </SectionHeading>
        <div className="motif-line" aria-label="Personal motifs">
          {motifs.map(m => <span key={m.id}>{m.text}</span>)}
        </div>
        <div className="human-module-grid">
          {config.tasteLayer?.enabled && (
            <article className="human-module" style={{ '--stagger-index': 0 } as React.CSSProperties}>
              <span className="human-module-label"><MetadataText config={config.typographySystem}>{config.tasteLayer.sectionLabel}</MetadataText></span>
              <h3>{config.tasteLayer.title}</h3>
              <p>{config.tasteLayer.description}</p>
              <div className="taste-list">
                {tasteItems.map(item => (
                  <span className="icon-align-chip" key={item.id}>
                    <Icon name={resolveIconName(item.icon, 'spark')} size="xs" tone="muted" />
                    {item.label}
                  </span>
                ))}
              </div>
            </article>
          )}
          <article className="human-module" style={{ '--stagger-index': config.tasteLayer?.enabled ? 1 : 0 } as React.CSSProperties}>
            <span className="human-module-label"><MetadataText config={config.typographySystem}>{config.humanLayer.glitchesSectionLabel}</MetadataText></span>
            <h3>{config.humanLayer.glitchesTitle}</h3>
            <ul className="glitch-list">
              {glitches.map(item => (
                <li key={item.id}>
                  <Icon name={resolveIconName(item.icon, 'signal')} size="xs" tone="muted" />
                  <span>{item.label}</span>
                  <small>{item.description}</small>
                </li>
              ))}
            </ul>
          </article>
        </div>
        {config.portrait?.enabled && config.portrait?.placement === 'human-layer' && (
          <div className={`human-portrait-wrapper${config.portrait.variant === 'bento' ? ' is-bento' : ''}`}>
            <PortraitSelector config={config} />
          </div>
        )}
      </div>
    </section>
  );
}


export function TimelineSection({ config, section }: Props) {
  const ref = useInView<HTMLElement>({ threshold: 0.1, once: true });
  const defaultTimeline: TimelineEntry[] = [
    { id: 't1', date: '2023.03 -> 2023.06', title: 'Completed the IBM Full Stack Software Developer Certificate', description: '', tags: ['education'], visible: true, order: 0 },
    { id: 't2', date: '2025.11', title: 'Joined Creativefuel as a Full Stack Developer', description: '', tags: ['work'], visible: true, order: 1 },
    { id: 't3', date: '2025.11 -> 2026.04', title: 'Worked across AI automation, media systems, cloud infrastructure, frontend tooling, and observability', description: '', tags: ['work', 'systems'], visible: true, order: 2 },
    { id: 't4', date: '2026', title: 'Rebuilding my public identity around proof, systems, and taste', description: '', tags: ['identity'], visible: true, order: 3 },
  ];
  const rawTimeline = config.timeline && config.timeline.length > 0 ? config.timeline : defaultTimeline;
  const entries = [...rawTimeline].filter(t => t.visible !== false).sort((a, b) => a.order - b.order);

  return (
    <section ref={ref} className="section-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="section-rail"><p className="section-kicker"><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>{section.railLabel && section.railLabel.toLowerCase() !== section.kicker.toLowerCase() && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}</div>
      <div className="section-main">
        <SectionHeading config={config} section={section} heading={section.heading} />
        <ol className="timeline">
          {entries.map((e, index) => (
            <li key={e.id} style={{ '--stagger-index': index } as React.CSSProperties}>
              <span className="timeline-icon icon-align-heading" aria-hidden="true">
                <Icon name={timelineIcon(e.tags)} size="sm" tone="accent" />
              </span>
              <time>{e.date}</time>
              <span>{e.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}


export function ContactSection({ config, section }: Props) {
  const ref = useInView<HTMLElement>({ threshold: 0.1, once: true });
  const ct = config.contact;
  return (
    <section ref={ref} className="contact-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="contact-copy">
        <p className="section-kicker icon-align-inline"><Icon name="mail" size="xs" tone="accent" /><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>
        <TextTreatment as="h2" slot="contactHeading" config={config.typographySystem}>{section.heading}</TextTreatment>
        <address>
          {ct.email && <a className="icon-align-inline" href={`mailto:${ct.email}`}><Icon name="mail" size="xs" tone="accent" />{ct.email}</a>}
          {ct.handle && <span className="icon-align-inline"><Icon name="person" size="xs" tone="muted" />{ct.handle}</span>}
          {ct.location && <span className="icon-align-inline"><Icon name="location" size="xs" tone="muted" />{ct.location}</span>}
        </address>
      </div>
      <div className="contact-actions" aria-label="Contact actions">
        {ct.email && <a className="button button-primary icon-align-inline" href={ct.ctaLink || `mailto:${ct.email}`}><Icon name="mail" size="sm" tone="accent" />{ct.ctaText}</a>}
        {ct.resumeLink && <a className="button button-secondary icon-align-inline" href={ct.resumeLink}><Icon name="resume" size="sm" tone="muted" />{ct.resumeLabel}</a>}
        {ct.customLinks.map(link => <a key={link.href} className="button button-secondary icon-align-inline" href={link.href}><Icon name="externalLink" size="sm" tone="muted" />{link.label}</a>)}
      </div>
    </section>
  );
}

