import type { SectionConfig, SiteConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import MetadataText from '../typography/MetadataText';
import TextTreatment from '../typography/Text';

interface Props { config: SiteConfig; section: SectionConfig; }

export default function StatementSection({ config, section }: Props) {
  return (
    <section
      className="statement-shell section-frame"
      id={section.id}
      data-section-id={section.sectionId}
      data-signal={section.signal}
      data-proof-level={section.proofLevel}
      data-system-status={section.systemStatus}
    >
      <div className="trace-label" aria-hidden="true">
        <MetadataText config={config.typographySystem}>
          section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}
        </MetadataText>
      </div>
      <div className="section-rail">
        <p className="section-kicker icon-align-inline"><Icon name="trace" size="xs" tone="accent" /><MetadataText config={config.typographySystem}>{section.kicker}</MetadataText></p>
        {section.railLabel && <span><MetadataText config={config.typographySystem}>{section.railLabel}</MetadataText></span>}
      </div>
      <div className="statement-panel">
        {section.bodyAtmospheric && (
          <TextTreatment as="p" slot="identityStatement" config={config.typographySystem} className="statement-text" visibilityMode="atmospheric">
            {section.bodyAtmospheric}
          </TextTreatment>
        )}
        {section.bodyDirect && (
          <TextTreatment as="p" slot="identityStatement" config={config.typographySystem} className="statement-text" visibilityMode="direct">
            {section.bodyDirect}
          </TextTreatment>
        )}
      </div>
    </section>
  );
}
