import { useEffect, useRef, useState } from 'react';
import { useThemeEngine } from '../../hooks/useThemeEngine';
import { useBoot } from '../boot/BootProvider';

export default function ThemeTransitionLayer() {
  const { activeTheme } = useThemeEngine();
  const { isReady } = useBoot();
  const previousThemeId = useRef(activeTheme.id);
  const hasBooted = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isReady) {
      previousThemeId.current = activeTheme.id;
      return;
    }

    if (!hasBooted.current) {
      hasBooted.current = true;
      previousThemeId.current = activeTheme.id;
      return;
    }

    if (previousThemeId.current === activeTheme.id) return;
    previousThemeId.current = activeTheme.id;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), Math.min(activeTheme.motion.complexDuration + 160, 680));
    return () => window.clearTimeout(timeout);
  }, [activeTheme.id, activeTheme.motion.complexDuration, isReady]);

  return (
    <div
      className={`theme-transition-layer${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    />
  );
}
