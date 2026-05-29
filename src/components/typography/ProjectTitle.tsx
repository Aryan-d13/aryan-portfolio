import TextTreatment from './Text';
import type { ProjectConfig, SiteConfig } from '../../types/siteConfig';

export default function ProjectTitle({ config, project }: { config: SiteConfig; project: ProjectConfig }) {
  return (
    <TextTreatment as="span" slot="projectTitle" config={config.typographySystem} className="project-title-treatment">
      {project.name}
    </TextTreatment>
  );
}

