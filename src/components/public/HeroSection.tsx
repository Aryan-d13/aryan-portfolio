import type { SiteConfig, SectionConfig } from '../../types/siteConfig';
import Icon, { type IconName } from '../icons/Icon';
import PortraitSelector from '../portrait/PortraitSelector';
import { HeroHeadline } from '../typography/DisplayText';
import RotatingWord from '../typography/RotatingWord';
import MetadataText from '../typography/MetadataText';
import PathText from '../typography/PathText';
import { useMagneticHover } from '../../hooks/useMagneticHover';

interface Props { config: SiteConfig; section: SectionConfig; }

const IDENTITY_WORDS = ['reliable', 'observable', 'thoughtful', 'human'];

function TraceLabel({ config, section }: { config: SiteConfig; section: SectionConfig }) {
  return (
    <div className="trace-label icon-align-status" aria-hidden="true">
      <Icon name="trace" size="xs" tone="muted" />
      <MetadataText config={config.typographySystem}>
        section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}
      </MetadataText>
    </div>
  );
}

function roleIcon(role: string): IconName {
  const normalized = role.toLowerCase();
  if (normalized.includes('ai')) return 'ai';
  if (normalized.includes('media')) return 'media';
  if (normalized.includes('automation')) return 'sync';
  if (normalized.includes('stack') || normalized.includes('developer')) return 'code';
  return 'signal';
}

export default function HeroSection({ config, section }: Props) {
  const id = config.identity;
  const showInHero = config.portrait?.enabled && config.portrait?.placement === 'hero';

  const primaryBtnRef = useMagneticHover<HTMLAnchorElement>({ radius: 75, strength: 0.3 });
  const secondaryBtnRef = useMagneticHover<HTMLAnchorElement>({ radius: 75, strength: 0.3 });

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
        <p className="section-kicker reveal icon-align-inline">
          <Icon name="signal" size="xs" tone="accent" />
          <MetadataText config={config.typographySystem}>{id.heroKicker}</MetadataText>
        </p>
        <h1 className="hero-title reveal">
          <HeroHeadline config={config.typographySystem}>{id.name}</HeroHeadline>
        </h1>
        <PathText
          enabled={config.typographySystem?.controls.pathTextEnabled ?? false}
          text="PROOF OVER VIBES / SYSTEMS BUILDER / ARYAN SHARMA / "
        />
        <p className="hero-identity-line reveal" aria-label="I build systems that are reliable, observable, thoughtful, human">
          I build systems that are <RotatingWord words={IDENTITY_WORDS} />
        </p>
        <p className="hero-line reveal" data-atmospheric="">{id.heroStatement}</p>
        <p className="hero-line reveal" data-direct="">{id.heroStatementDirect}</p>
        <div className="hero-actions reveal" aria-label="Primary actions">
          <a ref={primaryBtnRef} className="button button-primary icon-align-inline" href={id.ctaPrimary.href}>
            <Icon name="archive" size="sm" tone="accent" />
            {id.ctaPrimary.text}
          </a>
          <a ref={secondaryBtnRef} className="button button-secondary icon-align-inline" href={id.ctaSecondary.href}>
            <Icon name="mail" size="sm" tone="muted" />
            {id.ctaSecondary.text}
          </a>
        </div>
      </div>


      {showInHero && (
        <aside className="identity-portrait reveal" aria-label="Identity portrait and trace metadata">
          <PortraitSelector config={config} />
        </aside>
      )}

      <div className="hero-proof-strip reveal" aria-label="Core operating roles">
        {id.roleLines.map((role) => (
          <span key={role} className="icon-align-chip">
            <Icon name={roleIcon(role)} size="xs" tone="muted" />
            {role}
          </span>
        ))}
      </div>
    </section>
  );
}
