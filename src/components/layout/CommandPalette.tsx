import { useEffect, useRef } from 'react';
import type { SiteConfig } from '../../types/siteConfig';

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
      <div className="command-backdrop" onClick={onClose} />
      <section className="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title">
        <div className="command-top">
          <div>
            <h2 id="command-title">{cp.title}</h2>
            <p id="command-description">{cp.description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close command palette">Esc</button>
        </div>
        <div className="command-input" aria-hidden="true">
          <span>&gt;</span>
          <span>await selection</span>
        </div>
        <div className="command-list" role="listbox" aria-label="Command actions">
          {cp.commands.map((cmd, i) => (
            <button
              key={cmd.kbd}
              ref={i === 0 ? firstBtnRef : undefined}
              type="button"
              role="option"
              onClick={() => handleCommand(cmd.target, cmd.openProject)}
            >
              <span>{cmd.label}</span>
              <kbd>{cmd.kbd}</kbd>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
