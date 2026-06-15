import TextTreatment from './Text';
import type { PhilosophyLine, SiteConfig } from '../../types/siteConfig';

interface ManifestoLineProps {
  config: SiteConfig;
  line: PhilosophyLine;
  index?: number;
}

export default function ManifestoLine({ config, line, index }: ManifestoLineProps) {
  return (
    <li 
      data-intensity={line.intensity}
      style={index !== undefined ? ({ '--stagger-index': index } as React.CSSProperties) : undefined}
    >
      <TextTreatment as="span" slot="manifestoLine" config={config.typographySystem} split="words">
        {line.text}
      </TextTreatment>
    </li>
  );
}


