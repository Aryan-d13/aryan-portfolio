import type { ReactNode } from 'react';
import type { SectionConfig, SiteConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { resolveIconName, sectionIconMap } from '../icons/iconRegistry';
import TextTreatment from './Text';

interface SectionHeadingProps {
  config: SiteConfig;
  section: SectionConfig;
  heading?: string;
  children?: ReactNode;
}

export default function SectionHeading({ config, section, heading, children }: SectionHeadingProps) {
  if (!heading) return null;

  return (
    <div className="section-heading type-section-heading">
      <div className="section-heading-title">
        <span className="section-heading-icon icon-align-heading" aria-hidden="true">
          <Icon name={resolveIconName(section.icon, sectionIconMap[section.type] ?? 'trace')} size="md" tone="accent" />
        </span>
        <TextTreatment as="h2" slot="sectionTitle" config={config.typographySystem}>
          {heading}
        </TextTreatment>
      </div>
      {children && <div className="section-heading-copy">{children}</div>}
    </div>
  );
}
