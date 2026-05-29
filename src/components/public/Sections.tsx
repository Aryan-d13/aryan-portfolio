import type { SiteConfig, SectionConfig } from '../../types/siteConfig';
import PortraitSelector from '../portrait/PortraitSelector';

interface Props { config: SiteConfig; section: SectionConfig; }

export function PhilosophySection({ config, section }: Props) {
  const lines = [...(config.philosophy || [])].sort((a, b) => a.order - b.order);
  return (
    <section className="principle-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true">section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</div>
      <div className="section-rail"><p className="section-kicker">{section.kicker}</p>{section.railLabel && <span>{section.railLabel}</span>}</div>
      <ul className="principles" aria-label="Operating principles">
        {lines.map(l => <li key={l.id}>{l.text}</li>)}
      </ul>
    </section>
  );
}

export function HumanSection({ config, section }: Props) {
  const motifs = [...(config.humanLayer?.motifs || [])].filter(m => m.visible !== false).sort((a, b) => a.order - b.order);
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
        <div className="motif-line" aria-label="Personal motifs">
          {motifs.map(m => <span key={m.id}>{m.text}</span>)}
        </div>
        {config.portrait?.enabled && config.portrait?.placement === 'human-layer' && (
          <div className="human-portrait-wrapper" style={{ marginTop: 'var(--space-6)', maxWidth: config.portrait.variant === 'bento' ? '100%' : '520px' }}>
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
      <div className="trace-label" aria-hidden="true">section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</div>
      <div className="section-rail"><p className="section-kicker">{section.kicker}</p>{section.railLabel && <span>{section.railLabel}</span>}</div>
      <div className="section-main">
        <div className="section-heading"><h2>{section.heading}</h2></div>
        <ol className="timeline">
          {entries.map(e => <li key={e.id}><time>{e.date}</time><span>{e.title}</span></li>)}
        </ol>
      </div>
    </section>
  );
}

export function ContactSection({ config, section }: Props) {
  const ct = config.contact;
  return (
    <section className="contact-shell section-frame" id={section.id} data-section-id={section.sectionId} data-signal={section.signal} data-proof-level={section.proofLevel} data-system-status={section.systemStatus}>
      <div className="trace-label" aria-hidden="true">section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}</div>
      <div className="contact-copy">
        <p className="section-kicker">{section.kicker}</p>
        <h2>{section.heading}</h2>
        <address>
          {ct.email && <a href={`mailto:${ct.email}`}>{ct.email}</a>}
          {ct.handle && <span>{ct.handle}</span>}
          {ct.location && <span>{ct.location}</span>}
        </address>
      </div>
      <div className="contact-actions" aria-label="Contact actions">
        {ct.email && <a className="button button-primary" href={ct.ctaLink || `mailto:${ct.email}`}>{ct.ctaText}</a>}
        {ct.resumeLink && <a className="button button-secondary" href={ct.resumeLink}>{ct.resumeLabel}</a>}
        {ct.customLinks.map(link => <a key={link.href} className="button button-secondary" href={link.href}>{link.label}</a>)}
      </div>
    </section>
  );
}
