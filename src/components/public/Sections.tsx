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
    {
      id: 't1',
      date: 'Mar 2023 -> June 2023',
      title: 'IBM Full Stack Software Developer Professional Certificate',
      description: 'Professional certification path covering full-stack systems engineering, APIs, cloud deployments, and devops.',
      tags: ['certification'],
      visible: true,
      order: 0,
      link: 'https://www.credly.com/badges/e5943dbe-2559-4902-abd2-42469465bb04/public_url'
    },
    {
      id: 't2',
      date: 'June 2021 -> June 2025',
      title: 'B.Tech Computer Science specialisation AI, Medi-Caps University',
      description: 'Undergraduate degree focusing on software engineering foundations, data structures, algorithms, and artificial intelligence.',
      tags: ['education'],
      visible: true,
      order: 1
    },
    {
      id: 't3',
      date: 'Aug 2025 -> Oct 2025',
      title: 'Freelance Social Media Executive',
      description: 'Managed social media pages with cumulative following of 1M+. This also gave me exposure into automation world and the subsequent job role I got was thanks to this.',
      tags: ['work', 'automation'],
      visible: true,
      order: 2
    },
    {
      id: 't4',
      date: 'Oct 2025 -> April 2026',
      title: 'Full Stack Engineer at Creativefuel',
      description: 'Built Julius and July, implementing high-performance clipping automation and AI-driven creator systems.',
      tags: ['work', 'systems'],
      visible: true,
      order: 3
    },
    {
      id: 't5',
      date: 'May 2026 -> Present',
      title: 'Lead Full-Stack Systems Engineer (Contract / Freelance) at Maa Pitambara Automobiles',
      description: 'Orchestrated the complete digital transition of a legacy automotive dealership into a high-visibility, automation-driven online operation. Owned the end-to-end architecture, deployment, and management of the central web platform, structuring reliable core database schemas and automated data pipelines. Programmed custom automated CRM bot to handle real-time client interaction loops, asynchronous webhooks, and state synchronization.',
      tags: ['work', 'systems', 'automation'],
      visible: true,
      order: 4
    }
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
              <span>
                {e.link ? (
                  <a href={e.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--accent-secondary)' }}>
                    {e.title}
                  </a>
                ) : (
                  e.title
                )}
                {e.description && (
                  <span style={{ display: 'block', fontSize: 'var(--type-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)', lineHeight: 1.4 }}>
                    {e.description}
                  </span>
                )}
              </span>
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

