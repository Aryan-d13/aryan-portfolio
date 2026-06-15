import { useEffect, useState } from 'react';
import type { SiteConfig } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { navIconMap } from '../icons/iconRegistry';
import ThemeSelector from '../theme/ThemeSelector';

interface Props {
  config: SiteConfig;
  onOpenCommand: () => void;
}

export default function Header({ config, onOpenCommand }: Props) {
  const [isNoFluff, setIsNoFluff] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  const toggleNoFluff = () => {
    const next = !isNoFluff;
    setIsNoFluff(next);
    document.body.classList.toggle('no-fluff', next);
  };

  useEffect(() => {
    const heroSection = document.querySelector<HTMLElement>('#trace-begins');
    const sections = config.navigation
      .map(item => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => !!section);
    if (!sections.length && !heroSection) return;

    const allSections = heroSection ? [heroSection, ...sections] : sections;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          if (visible.target.id === 'trace-begins') {
            setActiveHref(null);
          } else {
            setActiveHref(`#${visible.target.id}`);
          }
        }
      },
      { rootMargin: '-35% 0px -52% 0px', threshold: [0.12, 0.28, 0.42] },
    );

    allSections.forEach(section => observer.observe(section));
    return () => {
      observer.disconnect();
    };
  }, [config.navigation]);

  return (
    <header className="site-header" data-status="tracking">
      <div className="header-inner">
        <a className="brand-mark" href="#trace-begins" aria-label={`${config.identity.name} home`}>
          <span className="brand-glyph">{config.identity.brandGlyph}</span>
          <span className="brand-copy">
            <span>{config.identity.name}</span>
            <span>{config.identity.brandSubtitle}</span>
          </span>
        </a>

        <nav className="header-nav" aria-label="Primary navigation">
          {config.navigation.map((item) => (
            <a key={item.href} className="icon-align-inline" href={item.href} aria-current={activeHref === item.href ? 'page' : undefined}>
              <Icon name={navIconMap[item.href] ?? 'trace'} size="xs" tone={activeHref === item.href ? 'accent' : 'muted'} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {config.themeEngine?.publicSelectorEnabled && (
            <ThemeSelector compact label="theme" />
          )}
          <button
            className="mode-toggle"
            type="button"
            aria-pressed={isNoFluff}
            aria-label="Toggle cinematic or direct copy"
            onClick={toggleNoFluff}
          >
            <span className={`mode-option${!isNoFluff ? ' is-active' : ''}`} data-mode-label="cinema">cinema</span>
            <span className={`mode-option${isNoFluff ? ' is-active' : ''}`} data-mode-label="direct">direct</span>
          </button>
          <button
            className="command-trigger"
            type="button"
            onClick={onOpenCommand}
            aria-haspopup="dialog"
          >
            <span className="command-trigger-glyph icon-align-heading" aria-hidden="true">
              <Icon name="command" size="sm" tone="accent" />
            </span>
            command
          </button>
        </div>
      </div>
    </header>
  );
}
