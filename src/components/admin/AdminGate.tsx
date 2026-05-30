import { useState, useRef, useEffect } from 'react';
import Icon from '../icons/Icon';

const ACCESS_KEY = 'trace';

interface Props {
  onAuthenticated: () => void;
}

export default function AdminGate({ onAuthenticated }: Props) {
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('cr_authenticated') === '1') {
      onAuthenticated();
    } else {
      inputRef.current?.focus();
    }
  }, [onAuthenticated]);

  const tryAuth = () => {
    if (inputRef.current?.value === ACCESS_KEY) {
      sessionStorage.setItem('cr_authenticated', '1');
      onAuthenticated();
    } else {
      setError(true);
      if (inputRef.current) inputRef.current.value = '';
      inputRef.current?.focus();
    }
  };

  return (
    <div className="cr-gate">
      <div className="cr-gate-inner">
        <div className="cr-gate-glyph"><Icon name="lock" size="lg" tone="accent" /></div>
        <h1 className="cr-gate-title">Control Room</h1>
        <p className="cr-gate-subtitle">identity system access</p>
        <div className="cr-gate-form">
          <label htmlFor="cr-password">access_key</label>
          <input
            ref={inputRef}
            type="password"
            id="cr-password"
            autoComplete="off"
            placeholder="enter trace key"
            onKeyDown={e => { if (e.key === 'Enter') tryAuth(); }}
          />
          <button className="icon-align-inline" type="button" onClick={tryAuth}><Icon name="unlock" size="xs" tone="accent" />authenticate</button>
        </div>
        {error && <p className="cr-gate-error icon-align-status"><Icon name="error" size="xs" tone="error" state="error" />invalid access key</p>}
        <p className="cr-gate-note icon-align-status"><Icon name="warning" size="xs" tone="warning" />prototype access gate - not production security</p>
      </div>
    </div>
  );
}
