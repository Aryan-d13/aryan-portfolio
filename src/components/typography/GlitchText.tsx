import TextTreatment from './Text';
import type { TypographySystemConfig } from '../../types/typographyConfig';

export default function GlitchText({ children, config, className = '' }: { children: string; config?: TypographySystemConfig; className?: string }) {
  return (
    <TextTreatment as="span" slot="metadata" config={config} effect="terminal-scan" className={`glitch-text ${className}`.trim()}>
      {children}
    </TextTreatment>
  );
}

