import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const bufferRef = useRef<string>('');
  const timeoutRef = useRef<number | null>(null);

  const cp = config.commandPalette;

  const handleCommand = useCallback((target: string, openProject: string | null) => {
    onClose();
    if (target.startsWith('/')) {
      navigate(target);
      return;
    }
    if (openProject) onOpenProject(openProject);
    const el = document.querySelector(target);
    el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [navigate, onClose, onOpenProject]);

  // Esc key down handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Global keyboard shortcuts sequence handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key).toUpperCase();

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        bufferRef.current = '';
      }, 1000);

      const matchedCommand = cp.commands.find(
        cmd => bufferRef.current.endsWith(cmd.kbd.toUpperCase())
      );

      if (matchedCommand) {
        bufferRef.current = '';
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        handleCommand(matchedCommand.target, matchedCommand.openProject);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [cp.commands, handleCommand]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      firstBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const commandIcon = (target: string, openProject: string | null): IconName => {
    if (openProject) return 'archive';
    if (target.includes('proof')) return 'proof';
    if (target.includes('open-channel')) return 'mail';
    if (target.includes('stack')) return 'stack';
    return 'command';
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
