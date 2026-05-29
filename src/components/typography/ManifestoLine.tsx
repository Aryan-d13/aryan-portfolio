import TextTreatment from './Text';
import type { PhilosophyLine, SiteConfig } from '../../types/siteConfig';

interface ManifestoLineProps {
  config: SiteConfig;
  line: PhilosophyLine;
}

export default function ManifestoLine({ config, line }: ManifestoLineProps) {
  return (
    <li data-intensity={line.intensity}>
      <TextTreatment as="span" slot="manifestoLine" config={config.typographySystem} split="words">
        {line.text}
      </TextTreatment>
    </li>
  );
}

