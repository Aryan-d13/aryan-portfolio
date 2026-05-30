import type { SiteConfig, SectionConfig } from '../../types/siteConfig';
import Icon, { type IconName } from '../icons/Icon';
import { timelineIconMap } from '../icons/iconRegistry';
import PortraitSelector from '../portrait/PortraitSelector';
import ManifestoLine from '../typography/ManifestoLine';
import MetadataText from '../typography/MetadataText';
import SectionHeading from '../typography/SectionHeading';
import TextTreatment from '../typography/Text';

interface Props { config: SiteConfig; section: SectionConfig; }

function timelineIcon(tags: string[]): IconName {
  const tag = tags.find(t => timelineIconMap[t]);
  return tag ? timelineIconMap[tag] : 'log';
}

export function PhilosophySection({ config, section }: Props) {
  const lines = [...(config.philosophy || [])].sort((a, b) => a.order - b.order);
  return (
    <section className="principle-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="section-rail"><p className="section-kicker icon-align-inline"><Icon name="spark" size="xs" tone="accent" /><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>{section.railLabel && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}</div>
      <ul className="principles" aria-label="Operating principles">
        {lines.map(l => <ManifestoLine key={l.id} config={config} line={l} />)}
      </ul>
    </section>
  );
}

export function HumanSection({ config, section }: Props) {
  const motifs = [...(config.humanLayer?.motifs || [])].filter(m => m.visible !== false).sort((a, b) => a.order - b.order);
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
        <div className="motif-line" aria-label="Personal motifs">
          {motifs.map(m => <span key={m.id}>{m.text}</span>)}
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
  const entries = [...(config.timeline || [])].filter(t => t.visible !== false).sort((a, b) => a.order - b.order);
  return (
    <section className="section-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true"><MetadataText config={config.typographySystem}>section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</MetadataText></div>
      <div className="section-rail"><p className="section-kicker"><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>{section.railLabel && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}</div>
      <div className="section-main">
        <SectionHeading config={config} section={section} heading={section.heading} />
        <ol className="timeline">
          {entries.map(e => (
            <li key={e.id}>
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
  const ct = config.contact;
  return (
    <section className="contact-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
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
