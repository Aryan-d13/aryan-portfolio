import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

export default function KineticText({ children, config, className = '' }: { children: string; config?: TypographySystemConfig; className?: string }) {
  return (
    <TextTreatment as="span" slot="heroHeadline" config={config} split="words" motion="stagger-reveal" className={className}>
      {children}
    </TextTreatment>
  );
}

