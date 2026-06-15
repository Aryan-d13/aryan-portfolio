import { useEffect, useState } from 'react';
import type { ThemeDefinition } from '../../themes/themeTypes';
import '../../styles/boot.css';

export interface BootLoaderProps {
  step: string;
  statusText: string;
  progress: number;
  activeTheme: ThemeDefinition | null;
  offline: boolean;
  onExitComplete?: () => void;
}

const BOOT_STAGES = [
  { id: 'cache', label: 'cache' },
  { id: 'theme', label: 'theme' },
  { id: 'portrait', label: 'portrait' },
  { id: 'fonts', label: 'fonts' },
  { id: 'ready', label: 'ready' },
];

export default function BootLoader({
  step,
  statusText,
  progress,
  activeTheme,
  offline,
  onExitComplete,
}: BootLoaderProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (step !== 'ready') return;

    const timer = window.setTimeout(() => {
      setExiting(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (!exiting) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 100 : 320;
    const timer = window.setTimeout(() => {
      onExitComplete?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [exiting, onExitComplete]);

  const displayFont = activeTheme?.typography?.displayFont || 'var(--font-display)';
  const monoFont = activeTheme?.typography?.monoFont || 'var(--font-mono)';
  const accentColor = activeTheme?.colors?.accentSecondary || 'var(--accent-secondary)';
  const showOfflineTag = offline && !statusText.toLowerCase().includes('cache mode');

  return (
    <div
      className={`boot-container${exiting ? ' exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={step !== 'ready'}
    >
      <div className="boot-dot-grid" aria-hidden="true" />
      <div className="boot-glow" aria-hidden="true" />

      <div className="boot-lockup">
        <div
          className="boot-status mono-label"
          style={{ fontFamily: monoFont }}
        >
          <span className="boot-status-bullet" aria-hidden="true" />
          <span className="status-text-resolve">{statusText}</span>
          {showOfflineTag && (
            <span className="boot-offline-tag" style={{ color: 'var(--color-accent-proof, #ff3b5c)' }}>
              {' '}- cache mode
            </span>
          )}
        </div>

        <div className="boot-progress-trace" aria-label="System boot progress">
          {BOOT_STAGES.map((stage, idx) => {
            const isCompleted = idx < progress;
            const isActive = idx === progress;
            return (
              <div
                key={stage.id}
                className={`boot-trace-segment${isCompleted ? ' completed' : ''}${isActive ? ' active' : ''}`}
              >
                <div className="boot-trace-bar" />
                <span
                  className="boot-trace-label mono-label"
                  style={{ fontFamily: monoFont }}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="boot-branding">
          <h1
            className="boot-title"
            style={{ fontFamily: displayFont }}
          >
            ARYAN<span style={{ color: accentColor }}>.SH</span>
          </h1>
          <p
            className="boot-subtitle"
            style={{ fontFamily: monoFont }}
          >
            proof_over_vibes
          </p>
        </div>
      </div>
    </div>
  );
}
