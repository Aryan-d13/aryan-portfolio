import type { SiteConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { resolveIconName } from '../icons/iconRegistry';

interface Props {
  config: SiteConfig;
  onSelect: (panel: string) => void;
}

export default function ControlRoomOverview({ config, onSelect }: Props) {
  const modules = [...config.controlRoomModules.items]
    .filter(module => module.visible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="cr-overview">
      <div className="cr-overview-heading">
        <span className="cr-overview-kicker icon-align-inline"><Icon name="terminal" size="xs" tone="accent" />private_system_index</span>
        <h1>{config.controlRoomModules.title}</h1>
        <p>{config.controlRoomModules.description}</p>
      </div>

      <div className="cr-overview-grid">
        {modules.map(module => {
          const content = (
            <>
              <span className="cr-overview-module-icon"><Icon name={resolveIconName(module.icon, 'settings')} size="sm" tone="muted" /></span>
              <span className="cr-overview-module-status">{module.status}</span>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
              {(module.targetPanel || module.href) && <span className="cr-overview-module-action">{module.href ? 'open artifact' : 'open module'} <Icon name="chevron" size="xs" tone="muted" /></span>}
            </>
          );

          if (module.href) {
            return <a className="cr-overview-module" href={module.href} key={module.id} target="_blank" rel="noreferrer">{content}</a>;
          }

          if (module.targetPanel) {
            return <button className="cr-overview-module" key={module.id} type="button" onClick={() => onSelect(module.targetPanel)}>{content}</button>;
          }

          return <article className="cr-overview-module" key={module.id}>{content}</article>;
        })}
      </div>
    </section>
  );
}
