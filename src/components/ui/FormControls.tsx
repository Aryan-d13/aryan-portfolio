import type { SiteConfig } from '../../types/siteConfig';

type Path = string;

function getPath(obj: unknown, path: Path): unknown {
  return path.split('.').reduce((o: unknown, k: string) => (o as Record<string, unknown>)?.[k], obj);
}

function setPath(obj: unknown, path: Path, value: unknown): void {
  const keys = path.split('.');
  const last = keys.pop()!;
  const target = keys.reduce((o: unknown, k: string) => {
    const rec = o as Record<string, unknown>;
    if (rec[k] === undefined) rec[k] = {};
    return rec[k];
  }, obj);
  (target as Record<string, unknown>)[last] = value;
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="cr-field">
      <label className="cr-label">
        {label}
        {hint && <span className="cr-label-hint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

interface TextInputProps {
  config: SiteConfig;
  path: Path;
  placeholder?: string;
  onChange: () => void;
}

export function TextInput({ config, path, placeholder, onChange }: TextInputProps) {
  const val = (getPath(config, path) as string) ?? '';
  return (
    <input
      type="text"
      className="cr-input"
      value={val}
      placeholder={placeholder}
      onChange={e => { setPath(config, path, e.target.value); onChange(); }}
    />
  );
}

interface TextAreaProps {
  config: SiteConfig;
  path: Path;
  placeholder?: string;
  rows?: number;
  onChange: () => void;
}

export function TextArea({ config, path, placeholder, rows = 3, onChange }: TextAreaProps) {
  const val = (getPath(config, path) as string) ?? '';
  return (
    <textarea
      className="cr-textarea"
      value={val}
      placeholder={placeholder}
      rows={rows}
      onChange={e => { setPath(config, path, e.target.value); onChange(); }}
    />
  );
}

interface NumberInputProps {
  config: SiteConfig;
  path: Path;
  min: number;
  max: number;
  step?: number;
  onChange: () => void;
}

export function NumberInput({ config, path, min, max, step = 1, onChange }: NumberInputProps) {
  const val = (getPath(config, path) as number) ?? 0;
  return (
    <input
      type="number"
      className="cr-input"
      value={val}
      min={min}
      max={max}
      step={step}
      onChange={e => { setPath(config, path, parseFloat(e.target.value) || 0); onChange(); }}
    />
  );
}

interface ToggleProps {
  config: SiteConfig;
  path: Path;
  label: string;
  onChange: () => void;
}

export function Toggle({ config, path, label, onChange }: ToggleProps) {
  const val = !!getPath(config, path);
  return (
    <div className="cr-toggle">
      <input
        type="checkbox"
        className="cr-toggle-switch"
        checked={val}
        onChange={e => { setPath(config, path, e.target.checked); onChange(); }}
      />
      <span className="cr-toggle-label">{label}</span>
    </div>
  );
}

interface ColorFieldProps {
  config: SiteConfig;
  path: Path;
  onChange: () => void;
}

export function ColorField({ config, path, onChange }: ColorFieldProps) {
  const val = (getPath(config, path) as string) || '#000000';
  return (
    <div className="cr-color-field">
      <input
        type="color"
        className="cr-color-swatch"
        value={val}
        onChange={e => { setPath(config, path, e.target.value); onChange(); }}
      />
      <input
        type="text"
        className="cr-input cr-color-hex"
        value={val}
        onChange={e => {
          if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
            setPath(config, path, e.target.value);
            onChange();
          }
        }}
      />
    </div>
  );
}

interface RangeProps {
  config: SiteConfig;
  path: Path;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: () => void;
}

export function Range({ config, path, min, max, step = 1, suffix = '', onChange }: RangeProps) {
  const val = (getPath(config, path) as number) ?? min;
  return (
    <div className="cr-range-row">
      <input
        type="range"
        className="cr-range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={e => { setPath(config, path, parseFloat(e.target.value)); onChange(); }}
      />
      <span className="cr-range-value">{val}{suffix}</span>
    </div>
  );
}

interface SelectProps {
  config: SiteConfig;
  path: Path;
  options: { value: string; label: string }[];
  onChange: () => void;
}

export function Select({ config, path, options, onChange }: SelectProps) {
  const val = (getPath(config, path) as string) ?? '';
  return (
    <select
      className="cr-select"
      value={val}
      onChange={e => { setPath(config, path, e.target.value); onChange(); }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export { getPath, setPath };
