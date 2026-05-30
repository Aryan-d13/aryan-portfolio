import type { SVGProps } from 'react';
import { iconRegistry, type IconName } from './iconRegistry';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg';
export type IconTone = 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse';
export type IconState = 'idle' | 'active' | 'loading' | 'success' | 'warning' | 'error' | 'disabled';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: IconSize;
  tone?: IconTone;
  state?: IconState;
  decorative?: boolean;
  label?: string;
}

export default function Icon({
  name,
  size = 'sm',
  tone = 'default',
  state = 'idle',
  decorative = true,
  label,
  className = '',
  ...props
}: IconProps) {
  const isDecorative = decorative && !label;
  const content = iconRegistry[name] ?? iconRegistry.spark;

  return (
    <svg
      className={`ui-icon ui-icon-${size}${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="var(--icon-stroke, 1.8)"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={isDecorative ? 'true' : undefined}
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : label}
      focusable="false"
      data-icon-name={name}
      data-tone={tone}
      data-state={state}
      {...props}
    >
      {content}
    </svg>
  );
}

export type { IconName };
