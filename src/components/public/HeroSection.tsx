import type { SiteConfig, SectionConfig } from '../../types/siteConfig';
import PortraitSelector from '../portrait/PortraitSelector';
import EncryptedName from './EncryptedName';

interface Props { config: SiteConfig; section: SectionConfig; }

function TraceLabel({ section }: { section: SectionConfig }) {
  return (
    <div className="trace-label" aria-hidden="true">
      section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}
    </div>
  );
}

export default function HeroSection({ config, section }: Props) {
  const id = config.identity;
  const showInHero = config.portrait?.enabled && config.portrait?.placement === 'hero';

  return (
    <section
      className={`hero-shell section-frame ${!showInHero ? 'no-portrait' : ''}`}
      id={section.id}
      data-section-id={section.sectionId}
      data-signal={section.signal}
      data-proof-level={section.proofLevel}
      data-system-status={section.systemStatus}
    >
      <TraceLabel section={section} />

      <div className="hero-content">
        <p className="section-kicker reveal">{id.heroKicker}</p>
        <h1 className="hero-title reveal">
          <EncryptedName fullName={id.name} />
          <span className="terminal-cursor" aria-hidden="true" />
        </h1>
        <p className="hero-line reveal" data-atmospheric="">{id.heroStatement}</p>
        <p className="hero-line reveal" data-direct="">{id.heroStatementDirect}</p>
        <div className="hero-actions reveal" aria-label="Primary actions">
          <a className="button button-primary" href={id.ctaPrimary.href}>{id.ctaPrimary.text}</a>
          <a className="button button-secondary" href={id.ctaSecondary.href}>{id.ctaSecondary.text}</a>
        </div>
      </div>

      {showInHero && (
        <aside className="identity-portrait reveal" aria-label="Identity portrait and trace metadata">
          <PortraitSelector config={config} />
        </aside>
      )}

      <div className="hero-proof-strip reveal" aria-label="Core operating roles">
        {id.roleLines.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </div>
    </section>
  );
}
