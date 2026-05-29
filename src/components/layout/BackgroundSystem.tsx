import type { SiteConfig } from '../../types/siteConfig';
import type { CSSProperties } from 'react';

interface Props { config: SiteConfig; }

export default function BackgroundSystem({ config }: Props) {
  if (!config.background.enabled) return null;

  const bg = config.background;
  const backgroundVars = {
    '--background-dot-size': `${bg.dotSize}px`,
    '--background-dot-spacing': `${bg.dotSpacing}px`,
    '--background-dot-opacity': bg.dotOpacity,
    '--background-dot-reveal-opacity': bg.dotRevealOpacity,
    '--background-dot-field-opacity': bg.dotFieldOpacity,
    '--background-radial-glow-color': bg.radialGlowColor,
    '--background-radial-glow-opacity': bg.radialGlowOpacity,
    '--background-radial-glow-color-2': bg.radialGlowColor2,
    '--background-radial-glow-opacity-2': bg.radialGlowOpacity2,
    '--background-radial-glow-blur': `${bg.radialGlowBlur}px`,
    '--background-vignette-opacity': bg.vignetteOpacity,
    '--background-animation-speed': `${bg.animationSpeed}s`,
  } as CSSProperties;

  return (
    <div className="background-system" style={backgroundVars} aria-hidden="true">
      <div className="dot-field" />
      <div className="dot-reveal" />
      <div className="radial-glow" />
      <div className="vignette-layer" />
    </div>
  );
}
