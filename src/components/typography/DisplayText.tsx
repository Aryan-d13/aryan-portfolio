import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

interface DisplayTextProps {
  children: string;
  config?: TypographySystemConfig;
  className?: string;
}

export function HeroHeadline({ children, config, className = '' }: DisplayTextProps) {
  return (
    <TextTreatment
      as="span"
      slot="heroHeadline"
      config={config}
      split="words"
      className={`hero-headline ${className}`.trim()}
    >
      {children}
    </TextTreatment>
  );
}

export function DisplayText({ children, config, className = '' }: DisplayTextProps) {
  return (
    <TextTreatment as="span" slot="sectionTitle" config={config} className={className}>
      {children}
    </TextTreatment>
  );
}

