import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

export default function OutlineText({ children, config, className = '' }: { children: string; config?: TypographySystemConfig; className?: string }) {
  return (
    <TextTreatment as="span" slot="sectionTitle" config={config} effect="outline-layered" className={className}>
      {children}
    </TextTreatment>
  );
}

