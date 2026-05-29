import type { ReducedMotionBehavior } from '../types/typographyConfig';

export function shouldReduceTypographyMotion(behavior: ReducedMotionBehavior, prefersReduced: boolean): boolean {
  if (behavior === 'force-reduced' || behavior === 'reading-mode') return true;
  return prefersReduced;
}

export function clampNumber(value: number | undefined, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function toMs(value: number | undefined, fallback: number): string {
  return `${clampNumber(value, 0, 2000, fallback)}ms`;
}
