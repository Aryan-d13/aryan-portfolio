import { useEffect, useState } from 'react';
import type { ThemeDefinition } from '../../themes/themeTypes';
import '../../styles/boot.css';

export interface BootLoaderProps {
  step: string;
  statusText: string;
  progress: number; // 0 to 5
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
    if (step === 'ready') {
      // Trigger exit transition
      const timer = setTimeout(() => {
        setExiting(true);
      }, 500); // give the user 500ms to see 'ready' and 'opening signal'

      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (exiting) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduceMotion ? 100 : 420;
      const timer = setTimeout(() => {
        onExitComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [exiting, onExitComplete]);

  // Read theme typography to style loader text
  const displayFont = activeTheme?.typography?.displayFont || 'var(--font-display)';
  const monoFont = activeTheme?.typography?.monoFont || 'var(--font-mono)';
  const bodyFont = activeTheme?.typography?.bodyFont || 'var(--font-body)';

  const accentColor = activeTheme?.colors?.accentSecondary || 'var(--accent-secondary)';

  return (
    <div
      className={`boot-container${exiting ? ' exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={step !== 'ready'}
    >
      {/* Cinematic Background Dot Field / Trace Grid */}
      <div className="boot-dot-grid" aria-hidden="true" />
      <div className="boot-glow" aria-hidden="true" />

      {/* Centered Lockup */}
      <div className="boot-lockup">
        {/* Top: Status / Microcopy */}
        <div
          className="boot-status mono-label"
          style={{ fontFamily: monoFont }}
        >
          <span className="boot-status-bullet" aria-hidden="true" />
          <span className="status-text-resolve">{statusText}</span>
          {offline && (
            <span className="boot-offline-tag" style={{ color: 'var(--color-accent-proof, #ff3b5c)' }}>
              {' '}· cache mode
            </span>
          )}
        </div>

        {/* Middle: Horizontal Step-based Trace Progress */}
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

        {/* Bottom: Main Branding Lockup */}
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
