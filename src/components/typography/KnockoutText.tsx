import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

export default function KnockoutText({ children, config, className = '' }: { children: string; config?: TypographySystemConfig; className?: string }) {
  return (
    <TextTreatment as="span" slot="sectionTitle" config={config} effect="editorial-ghost" className={`knockout-text ${className}`.trim()}>
      {children}
    </TextTreatment>
  );
}

