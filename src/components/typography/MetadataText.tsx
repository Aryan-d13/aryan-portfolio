import type { ReactNode } from 'react';
import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

export default function MetadataText({ children, config, className = '' }: { children: ReactNode; config?: TypographySystemConfig; className?: string }) {
  return (
    <TextTreatment as="span" slot="metadata" config={config} className={`metadata-text ${className}`.trim()}>
      {children}
    </TextTreatment>
  );
}

