import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

export default function GradientText({ children, config, className = '' }: { children: string; config?: TypographySystemConfig; className?: string }) {
  return (
    <TextTreatment as="span" slot="sectionTitle" config={config} effect="kinetic-masked-gradient" className={className}>
      {children}
    </TextTreatment>
  );
}

