import { isValidElement, type CSSProperties, type ElementType, type ReactNode } from 'react';
import type { TextEffect, TextMotion, TextTreatmentSlot, TypographySystemConfig } from '../../types/typographyConfig';
import { normalizeTypographySystem } from '../../utils/textEffects';

type SplitMode = 'none' | 'words' | 'lines';

interface TextTreatmentProps {
  as?: ElementType;
  slot: TextTreatmentSlot;
  config?: TypographySystemConfig;
  effect?: TextEffect;
  motion?: TextMotion;
  split?: SplitMode;
  visibilityMode?: 'atmospheric' | 'direct';
  className?: string;
  children: ReactNode;
}

function nodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return '';
}

function renderSplitText(text: string, split: SplitMode) {
  if (split === 'none') return text;

  const units = text.split(/\s+/).filter(Boolean);
  return units.map((unit, index) => {
    const style = { '--type-index': index } as CSSProperties;
    if (split === 'lines') {
      return (
        <span className="type-line" style={style} key={`${unit}-${index}`}>
          {unit}
        </span>
      );
    }

    return (
      <span className="type-word-wrap" key={`${unit}-${index}`}>
        <span className="type-word" style={style}>{unit}</span>
        {index < units.length - 1 ? ' ' : ''}
      </span>
    );
  });
}

export default function TextTreatment({
  as,
  slot,
  config,
  effect,
  motion,
  split = 'none',
  visibilityMode,
  className = '',
  children,
}: TextTreatmentProps) {
  const Component = as ?? 'span';
  const system = normalizeTypographySystem(config);
  const treatment = system.treatments[slot];
  const text = nodeText(children).trim();
  const resolvedEffect = effect ?? treatment.effect;
  const resolvedMotion = motion ?? treatment.motion;
  const style = {
    '--type-treatment-intensity': treatment.intensity,
    '--type-treatment-glow': treatment.glow,
    '--type-treatment-outline': treatment.outline,
  } as CSSProperties;

  const classes = [
    'text-treatment',
    `text-treatment-${slot}`,
    `text-effect-${resolvedEffect}`,
    `text-motion-${resolvedMotion}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={classes}
      data-text={text}
      data-effect={resolvedEffect}
      data-motion={resolvedMotion}
      data-slot={slot}
      data-texture={treatment.texture}
      data-atmospheric={visibilityMode === 'atmospheric' ? '' : undefined}
      data-direct={visibilityMode === 'direct' ? '' : undefined}
      aria-label={split !== 'none' ? text : undefined}
      style={style}
    >
      {typeof children === 'string' && split !== 'none' ? renderSplitText(children, split) : children}
    </Component>
  );
}
