import { useEffect, useRef, useState } from 'react';
import type { PortraitConfig } from '../../types/siteConfig';
import { useThemeEngine } from '../../hooks/useThemeEngine';
import { getPortraitForTheme, fallbackPortrait } from '../../config/themePortraitMap';
import Icon from '../icons/Icon';

interface Props {
  portrait: PortraitConfig;
}

export default function PortraitFrame({ portrait }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { activeThemeId } = useThemeEngine();

  // Resolve target source from theme or fallback
  const targetSrc = getPortraitForTheme(activeThemeId) || portrait.src || fallbackPortrait;

  const [displayedSrc, setDisplayedSrc] = useState(targetSrc);
  const [prevSrc, setPrevSrc] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);

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

  // Handle preloading and image swapping on theme change
  useEffect(() => {
    if (targetSrc === displayedSrc) {
      return;
    }

    let active = true;
    const img = new Image();
    img.src = targetSrc;
    img.onload = () => {
      if (!active) return;
      setPrevSrc(displayedSrc);
      setDisplayedSrc(targetSrc);
      setIsEntering(true);
    };

    return () => {
      active = false;
    };
  }, [targetSrc, displayedSrc]);

  // Settle the entering animation and clear previous image
  useEffect(() => {
    if (!isEntering) return;

    const raf = requestAnimationFrame(() => {
      setIsEntering(false);
    });

    const timer = setTimeout(() => {
      setPrevSrc(null);
    }, 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [isEntering]);

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
      {/* Current active portrait */}
      <img
        src={displayedSrc}
        alt={portrait.alt || 'Aryan Sharma Portrait'}
        loading="lazy"
        decoding="async"
        className={`portrait-img-current ${isEntering ? 'is-entering' : ''}`}
        style={{ objectPosition: portrait.objectPosition || '52% 50%' }}
      />

      {/* Previous portrait during crossfade */}
      {prevSrc && (
        <img
          src={prevSrc}
          alt={portrait.alt || 'Aryan Sharma Portrait'}
          decoding="async"
          className="portrait-img-prev is-fading-out"
          style={{
            objectPosition: portrait.objectPosition || '52% 50%',
          }}
        />
      )}

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
        <div className="portrait-hud-tag icon-align-status">
          <Icon name="trace" size="xs" tone="accent" />
          {portrait.metadata[0].value}
        </div>
      )}
    </div>
  );
}
