import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

export default function MaskedText({ children, config, className = '' }: { children: string; config?: TypographySystemConfig; className?: string }) {
  return (
    <TextTreatment as="span" slot="heroHeadline" config={config} effect="masked-cosmic" className={className}>
      {children}
    </TextTreatment>
  );
}

