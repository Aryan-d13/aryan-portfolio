import type { PortraitConfig } from '../../types/siteConfig';
import PortraitFrame from './PortraitFrame';

interface Props {
  portrait: PortraitConfig;
}

export default function PortraitIdentityCard({ portrait }: Props) {
  return (
    <div className="portrait-identity-card">
      <header className="portrait-card-header">
        <span>identity.trace_file</span>
        <div className="live-heartbeat">
          <span className="heartbeat-dot" />
          <span>live</span>
        </div>
      </header>

      <PortraitFrame portrait={portrait} />

      {portrait.showMetadata && portrait.metadata && portrait.metadata.length > 0 && (
        <dl className="portrait-card-metadata">
          {portrait.metadata.map((item, idx) => (
            <div key={idx} className="metadata-item">
              <dt>{item.label}</dt>
              <dd title={item.value}>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
