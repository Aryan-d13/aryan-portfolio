import type { SiteConfig, SectionConfig } from '../../types/siteConfig';
import PortraitSelector from '../portrait/PortraitSelector';
import { HeroHeadline } from '../typography/DisplayText';
import MetadataText from '../typography/MetadataText';
import PathText from '../typography/PathText';

interface Props { config: SiteConfig; section: SectionConfig; }

function TraceLabel({ config, section }: { config: SiteConfig; section: SectionConfig }) {
  return (
    <div className="trace-label" aria-hidden="true">
      <MetadataText config={config.typographySystem}>
        section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}
      </MetadataText>
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
      <TraceLabel config={config} section={section} />

      <div className="hero-content">
        <p className="section-kicker reveal">
          <MetadataText config={config.typographySystem}>{id.heroKicker}</MetadataText>
        </p>
        <h1 className="hero-title reveal">
          <HeroHeadline config={config.typographySystem}>{id.name}</HeroHeadline>
        </h1>
        <PathText
          enabled={config.typographySystem?.controls.pathTextEnabled ?? true}
          text="PROOF OVER VIBES / SYSTEMS BUILDER / ARYAN SHARMA / "
        />
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
