import { useEffect, useRef } from 'react';
import type { SiteConfig } from '../../types/siteConfig';
import Icon, { type IconName } from '../icons/Icon';

interface Props {
  config: SiteConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenProject: (projectId: string) => void;
}

export default function CommandPalette({ config, isOpen, onClose, onOpenProject }: Props) {
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      firstBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cp = config.commandPalette;

  const commandIcon = (target: string, openProject: string | null): IconName => {
    if (openProject) return 'archive';
    if (target.includes('proof')) return 'proof';
    if (target.includes('open-channel')) return 'mail';
    if (target.includes('stack')) return 'stack';
    return 'command';
  };

  const handleCommand = (target: string, openProject: string | null) => {
    onClose();
    if (target.startsWith('/')) {
      window.location.href = target;
      return;
    }
    if (openProject) onOpenProject(openProject);
    const el = document.querySelector(target);
    el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  return (
    <div className="command-palette" data-command-palette>
      <div className="command-backdrop" aria-hidden="true" onClick={onClose} />
      <section className="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title" aria-describedby="command-description">
        <div className="command-top">
          <div>
            <h2 id="command-title" className="icon-align-inline"><Icon name="command" size="md" tone="accent" />{cp.title}</h2>
            <p id="command-description">{cp.description}</p>
          </div>
          <button className="icon-align-inline" type="button" onClick={onClose} aria-label="Close command palette"><Icon name="close" size="xs" tone="muted" />Esc</button>
        </div>
        <div className="command-input icon-align-inline" aria-hidden="true">
          <Icon name="terminal" size="xs" tone="accent" />
          <span>await selection</span>
        </div>
        <div className="command-list" role="listbox" aria-label="Command actions">
          {cp.commands.map((cmd, i) => (
            <button
              key={cmd.kbd}
              ref={i === 0 ? firstBtnRef : undefined}
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => handleCommand(cmd.target, cmd.openProject)}
            >
              <span className="icon-align-inline"><Icon name={commandIcon(cmd.target, cmd.openProject)} size="xs" tone="muted" />{cmd.label}</span>
              <kbd>{cmd.kbd}</kbd>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
