import type { ReactNode } from 'react';
import type { SectionConfig, SiteConfig } from '../../types/siteConfig';
import TextTreatment from './Text';

interface SectionHeadingProps {
  config: SiteConfig;
  section: SectionConfig;
  heading?: string;
  children?: ReactNode;
}

function ghostLabel(section: SectionConfig, heading?: string): string {
  const raw = section.railLabel || section.sectionId || heading || section.kicker;
  return raw.replace(/[_/]+/g, ' ').toUpperCase();
}

export default function SectionHeading({ config, section, heading, children }: SectionHeadingProps) {
  if (!heading) return null;

  return (
    <div className="section-heading type-section-heading" data-ghost={ghostLabel(section, heading)}>
      <TextTreatment as="h2" slot="sectionTitle" config={config.typographySystem}>
        {heading}
      </TextTreatment>
      {children && <div className="section-heading-copy">{children}</div>}
    </div>
  );
}

