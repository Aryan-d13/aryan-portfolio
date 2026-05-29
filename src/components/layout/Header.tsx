import { useState } from 'react';
import type { SiteConfig } from '../../types/siteConfig';
import ThemeSelector from '../theme/ThemeSelector';

interface Props {
  config: SiteConfig;
  onOpenCommand: () => void;
}

export default function Header({ config, onOpenCommand }: Props) {
  const [isNoFluff, setIsNoFluff] = useState(false);

  const toggleNoFluff = () => {
    const next = !isNoFluff;
    setIsNoFluff(next);
    document.body.classList.toggle('no-fluff', next);
  };

  return (
    <header className="site-header" data-status="tracking">
      <a className="brand-mark" href="#trace-begins" aria-label={`${config.identity.name} home`}>
        <span className="brand-glyph">{config.identity.brandGlyph}</span>
        <span className="brand-copy">
          <span>{config.identity.name}</span>
          <span>{config.identity.brandSubtitle}</span>
        </span>
      </a>

      <nav className="header-nav" aria-label="Primary navigation">
        {config.navigation.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
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
          onClick={toggleNoFluff}
        >
          <span className={`mode-option${!isNoFluff ? ' is-active' : ''}`} data-mode-label="cinematic">cinematic</span>
          <span className={`mode-option${isNoFluff ? ' is-active' : ''}`} data-mode-label="no-fluff">no-fluff</span>
        </button>
        <button
          className="command-trigger"
          type="button"
          onClick={onOpenCommand}
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">/</span>
          command
        </button>
      </div>
    </header>
  );
}
