import type { SiteConfig } from '../../types/siteConfig';
import PortraitFrame from './PortraitFrame';
import PortraitIdentityCard from './PortraitIdentityCard';
import PortraitBento from './PortraitBento';

interface Props {
  config: SiteConfig;
}

export default function PortraitSelector({ config }: Props) {
  const portrait = config.portrait;

  if (!portrait || !portrait.enabled) return null;

  switch (portrait.variant) {
    case 'identity-card':
      return <PortraitIdentityCard portrait={portrait} />;

    case 'bento':
      return <PortraitBento portrait={portrait} />;

    case 'archive':
      return (
        <div className="portrait-archive-frame">
          <PortraitFrame portrait={portrait} />
          {portrait.showMetadata && portrait.metadata && (
            <div className="portrait-archive-footer">
              <div className="portrait-archive-line">
                <span>FILE_ID</span>
                <span>{portrait.metadata[0]?.value || 'SYS_ARCHIVE'}</span>
              </div>
              <div className="portrait-archive-line">
                <span>SIGNAL_TYPE</span>
                <span>{portrait.metadata[3]?.value || 'CLASSIFIED'}</span>
              </div>
            </div>
          )}
        </div>
      );

    case 'cinematic-panel':
      return (
        <div className="portrait-cinematic-panel">
          <div className="portrait-panel-overlay" />
          <PortraitFrame portrait={portrait} />
        </div>
      );

    case 'editorial':
    default:
      return (
        <div className="portrait-editorial">
          <PortraitFrame portrait={portrait} />
        </div>
      );
  }
}
