import type { PortraitConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import PortraitFrame from './PortraitFrame';

interface Props {
  portrait: PortraitConfig;
}

export default function PortraitIdentityCard({ portrait }: Props) {
  return (
    <div className="portrait-identity-card">
      <header className="portrait-card-header">
        <span className="icon-align-inline"><Icon name="trace" size="xs" tone="accent" />identity.trace_file</span>
        <div className="live-heartbeat icon-align-status">
          <Icon name="signal" size="xs" tone="accent" />
          <span>live</span>
        </div>
      </header>

      <PortraitFrame portrait={portrait} />

      {portrait.showMetadata && portrait.metadata && portrait.metadata.length > 0 && (
        <dl className="portrait-card-metadata">
          {portrait.metadata.map((item, idx) => (
            <div key={idx} className="metadata-item">
              <dt className="icon-align-inline"><Icon name={idx === 0 ? 'trace' : idx === 1 ? 'terminal' : idx === 2 ? 'location' : 'signal'} size="xs" tone="muted" />{item.label}</dt>
              <dd title={item.value}>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
