import { useEffect, useRef, useState } from 'react';
import { useThemeEngine } from '../../hooks/useThemeEngine';

export default function ThemeTransitionLayer() {
  const { activeTheme } = useThemeEngine();
  const previousThemeId = useRef(activeTheme.id);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (previousThemeId.current === activeTheme.id) return;
    previousThemeId.current = activeTheme.id;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), Math.min(activeTheme.motion.complexDuration + 160, 680));
    return () => window.clearTimeout(timeout);
  }, [activeTheme.id, activeTheme.motion.complexDuration]);

  return (
    <div
      className={`theme-transition-layer${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    />
  );
}

