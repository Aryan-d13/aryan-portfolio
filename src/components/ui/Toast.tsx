import { useState, useEffect, useCallback } from 'react';
import type { ToastMessage, ToastType } from '../../types/siteConfig';

// ─── TOAST SYSTEM ───────────────────────────────────────────────

let toastId = 0;
let toastSetter: ((msgs: ToastMessage[]) => void) | null = null;
let toastMessages: ToastMessage[] = [];

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
    <div className="cr-toasts">
      {messages.map(m => (
        <div key={m.id} className={`cr-toast ${m.type}`}>{m.message}</div>
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
      <div className="cr-modal">
        <h3>{data.title}</h3>
        <p>{data.message}</p>
        <div className="cr-modal-actions">
          <button type="button" className="cr-btn cr-btn-ghost" onClick={() => handleResult(false)}>cancel</button>
          <button type="button" className="cr-btn cr-btn-danger" onClick={() => handleResult(true)}>confirm</button>
        </div>
      </div>
    </div>
  );
}
