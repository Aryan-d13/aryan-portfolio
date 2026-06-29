import { useEffect, useState } from 'react';
import type { PortraitConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import PortraitFrame from './PortraitFrame';

interface Props {
  portrait: PortraitConfig;
}

const MOCK_LOGS = [
  'BOOT: trace_id validated successfully',
  'LOAD: active theme loaded',
  'SYNC: telemetry hubs connected to ACA',
  'OBS: observer metrics: 100% accuracy',
  'HMR: hot reload daemon initialized',
  'SYS: nocturnal_engine is running',
  'RECV: pipeline signal: proof_over_vibes',
  'JOB: julius distributed queue initialized',
  'LEAS: token active - heartbeat stable',
  'WARN: rain noise threshold set to cinematic',
  'COMP: css variables successfully applied',
  'DB: local state-machine synced',
];

export default function PortraitBento({ portrait }: Props) {
  const [logs, setLogs] = useState<string[]>([
    'BOOT: trace_id validated successfully',
    'LOAD: active theme loaded',
    'SYNC: telemetry hubs connected to ACA',
    'SYS: nocturnal_engine is running',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
        const withTimestamp = `[${new Date().toLocaleTimeString()}] ${nextLog}`;
        return [...prev.slice(-4), withTimestamp];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="portrait-bento-grid">
      <div className="portrait-bento-cell cell-main">
        <PortraitFrame portrait={portrait} />
      </div>

      <div className="portrait-bento-cell cell-terminal">
        <div className="bento-terminal-header">
          <span className="icon-align-inline"><Icon name="terminal" size="xs" tone="accent" />system_log.sh</span>
          <span className="icon-align-status"><Icon name="signal" size="xs" tone="accent" />streaming</span>
        </div>
        <div className="bento-terminal-logs">
          {logs.map((log, idx) => {
            const hasBrackets = log.includes(']');
            const time = hasBrackets ? log.split(']')[0] + ']' : '';
            const msg = hasBrackets ? log.split(']')[1] : log;
            return (
              <div key={idx} className="bento-terminal-line">
                <span className="muted">{time}</span>
                <span className="cyan">{msg}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="portrait-bento-cell cell-widget">
        <div className="bento-widget-title icon-align-inline"><Icon name="status" size="xs" tone="accent" />telemetry.data</div>
        <div className="bento-widget-grid">
          <div className="bento-widget-stat">
            <span>sky_status</span>
            <span>nighttime</span>
          </div>
          <div className="bento-widget-stat">
            <span>precipitation</span>
            <span>moderate 🌧</span>
          </div>
          <div className="bento-widget-stat">
            <span>noise_floor</span>
            <span>{portrait.effects.grain}</span>
          </div>
          <div className="bento-widget-stat">
            <span>system_core</span>
            <span>stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
