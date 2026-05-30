import { useState, useEffect, useCallback } from 'react';
import type { ToastMessage, ToastType } from '../../types/siteConfig';
import Icon, { type IconName } from '../icons/Icon';

// ─── TOAST SYSTEM ───────────────────────────────────────────────

let toastId = 0;
let toastSetter: ((msgs: ToastMessage[]) => void) | null = null;
let toastMessages: ToastMessage[] = [];

const toastIcons: Record<ToastType, IconName> = {
  info: 'signal',
  success: 'success',
  error: 'error',
  warning: 'warning',
};

export function toast(message: string, type: ToastType = 'info') {
  const id = String(++toastId);
  const t: ToastMessage = { id, message, type };
  toastMessages = [...toastMessages, t];
  toastSetter?.(toastMessages);
  setTimeout(() => {
    toastMessages = toastMessages.filter(m => m.id !== id);
    toastSetter?.(toastMessages);
  }, 3000);
}

export function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastSetter = setMessages;
    return () => { toastSetter = null; };
  }, []);

  return (
    <div className="cr-toasts" aria-live="polite" aria-atomic="false">
      {messages.map(m => (
        <div key={m.id} className={`cr-toast ${m.type}`} role="status" data-toast-type={m.type}>
          <span className="cr-toast-mark icon-align-heading" aria-hidden="true">
            <Icon name={toastIcons[m.type]} size="xs" tone={m.type === 'info' ? 'accent' : m.type} state={m.type === 'success' ? 'success' : m.type === 'warning' || m.type === 'error' ? m.type : 'idle'} />
          </span>
          <span>{m.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── CONFIRM MODAL ──────────────────────────────────────────────

let confirmResolve: ((val: boolean) => void) | null = null;
let showConfirmSetter: ((data: { title: string; message: string } | null) => void) | null = null;

export function confirmDialog(title: string, message: string): Promise<boolean> {
  return new Promise(resolve => {
    confirmResolve = resolve;
    showConfirmSetter?.({ title, message });
  });
}

export function ConfirmModal() {
  const [data, setData] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    showConfirmSetter = setData;
    return () => { showConfirmSetter = null; };
  }, []);

  const handleResult = useCallback((result: boolean) => {
    confirmResolve?.(result);
    confirmResolve = null;
    setData(null);
  }, []);

  if (!data) return null;

  return (
    <div className="cr-modal-backdrop">
      <div className="cr-modal" role="dialog" aria-modal="true" aria-labelledby="cr-confirm-title" aria-describedby="cr-confirm-message">
        <h3 id="cr-confirm-title">{data.title}</h3>
        <p id="cr-confirm-message">{data.message}</p>
        <div className="cr-modal-actions">
          <button type="button" className="cr-btn cr-btn-ghost icon-align-inline" onClick={() => handleResult(false)}><Icon name="close" size="xs" tone="muted" />cancel</button>
          <button type="button" className="cr-btn cr-btn-danger icon-align-inline" onClick={() => handleResult(true)}><Icon name="warning" size="xs" tone="error" />confirm</button>
        </div>
      </div>
    </div>
  );
}
