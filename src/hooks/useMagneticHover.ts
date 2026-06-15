import { useEffect, useRef } from 'react';

interface UseMagneticHoverOptions {
  /** Distance (in px) within which the cursor pulls the element. Default: 60 */
  radius?: number;
  /** Strength of the magnetic attraction (0 to 1). Default: 0.35 */
  strength?: number;
}

/**
 * A custom hook to make elements magnetic towards the mouse cursor.
 * Specifically optimized for high-value call-to-actions in the Hero.
 * Automatically disabled on touch devices or if prefers-reduced-motion is enabled.
 */
export function useMagneticHover<T extends HTMLElement = HTMLElement>(
  options: UseMagneticHoverOptions = {}
) {
  const { radius = 60, strength = 0.35 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Detect touch-only devices and users who prefer reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouch || prefersReduced) {
      return;
    }

    let isHovered = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId: number | null = null;

    const update = () => {
      // Smooth interpolation (spring feel)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      // Stop tracking if element is released and returns to center
      if (!isHovered && Math.abs(currentX) < 0.05 && Math.abs(currentY) < 0.05) {
        el.style.transform = '';
        frameId = null;
        return;
      }

      frameId = requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - elCenterX;
      const deltaY = e.clientY - elCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < radius) {
        isHovered = true;
        // Scale down the drag to create a gentle pull rather than an exact follow
        targetX = deltaX * strength;
        targetY = deltaY * strength;

        if (frameId === null) {
          frameId = requestAnimationFrame(update);
        }
      } else if (isHovered) {
        handleMouseLeave();
      }
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      if (frameId === null) {
        frameId = requestAnimationFrame(update);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [radius, strength]);

  return ref;
}
