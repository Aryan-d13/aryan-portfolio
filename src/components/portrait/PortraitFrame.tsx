import { useEffect, useRef, useState } from 'react';
import type { PortraitConfig } from '../../types/siteConfig';

interface Props {
  portrait: PortraitConfig;
}

export default function PortraitFrame({ portrait }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!portrait.effects.scrollReveal) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [portrait.effects.scrollReveal]);

  const inlineStyles: React.CSSProperties = {
    aspectRatio: portrait.aspectRatio || '4 / 5',
    '--portrait-vignette-opacity': portrait.effects.vignette,
    '--portrait-glow-opacity': portrait.effects.glow,
    '--portrait-grain-opacity': portrait.effects.grain,
  } as React.CSSProperties;

  const containerClass = [
    'portrait-frame',
    'portrait-frame-container',
    portrait.effects.hoverLift ? 'portrait-hover-lift' : '',
    portrait.effects.glow > 0 ? 'portrait-glow-shadow' : '',
    portrait.effects.scrollReveal ? 'portrait-scroll-reveal' : '',
    isVisible ? 'is-visible' : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={containerClass} style={inlineStyles}>
      <img
        src={portrait.src}
        alt={portrait.alt}
        loading="lazy"
        style={{ objectPosition: portrait.objectPosition || '52% 50%' }}
      />
      {portrait.effects.vignette > 0 && (
        <div
          className="portrait-vignette"
          style={{ opacity: portrait.effects.vignette }}
        />
      )}
      <div className="portrait-scanlines" />
      {portrait.effects.grain > 0 && <div className="portrait-grain" />}
      <div className="portrait-hairline" />
      <div className="portrait-sweep" />
      {portrait.showMetadata && portrait.metadata && portrait.metadata.length > 0 && (
        <div className="portrait-hud-tag">
          {portrait.metadata[0].value}
        </div>
      )}
    </div>
  );
}
