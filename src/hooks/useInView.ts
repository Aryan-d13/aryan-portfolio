import { useEffect, useRef, useCallback } from 'react';

/**
 * Minimal Intersection Observer hook for scroll-triggered reveals.
 * 
 * Sets `data-in-view="true"` on the target element when it enters the viewport.
 * Uses `once` mode by default — elements are unobserved after their first reveal.
 * Respects `prefers-reduced-motion` by resolving all elements immediately.
 */

interface UseInViewOptions {
  /** Fraction of element visible before triggering (0–1). Default: 0.15 */
  threshold?: number;
  /** IntersectionObserver rootMargin. Default: '0px 0px -60px 0px' (slight bottom offset) */
  rootMargin?: string;
  /** If true, unobserve after first intersection. Default: true */
  once?: boolean;
}

// Shared observer map — one observer per threshold+rootMargin combo
const observerMap = new Map<string, IntersectionObserver>();
const callbackMap = new Map<Element, (entry: IntersectionObserverEntry) => void>();

function getSharedObserver(threshold: number, rootMargin: string): IntersectionObserver {
  const key = `${threshold}|${rootMargin}`;
  let observer = observerMap.get(key);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cb = callbackMap.get(entry.target);
          cb?.(entry);
        });
      },
      { threshold, rootMargin },
    );
    observerMap.set(key, observer);
  }
  return observer;
}

export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {},
) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion: reveal immediately
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      el.setAttribute('data-in-view', 'true');
      return;
    }

    const observer = getSharedObserver(threshold, rootMargin);

    const handleEntry = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        el.setAttribute('data-in-view', 'true');
        if (once) {
          observer.unobserve(el);
          callbackMap.delete(el);
        }
      } else if (!once) {
        el.removeAttribute('data-in-view');
      }
    };

    callbackMap.set(el, handleEntry);
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      callbackMap.delete(el);
    };
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * Batch version: observe a container's children with stagger indices.
 * Sets `data-in-view="true"` on the container when it enters viewport,
 * which then triggers CSS reveals on children via `[data-stagger-index]`.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {},
) {
  return useInView<T>(options);
}

/**
 * Imperative helper to observe an element outside of React lifecycle.
 * Returns a cleanup function.
 */
export function observeElement(
  el: HTMLElement,
  options: UseInViewOptions = {},
): () => void {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    el.setAttribute('data-in-view', 'true');
    return () => {};
  }

  const observer = getSharedObserver(threshold, rootMargin);

  const handleEntry = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      el.setAttribute('data-in-view', 'true');
      if (once) {
        observer.unobserve(el);
        callbackMap.delete(el);
      }
    } else if (!once) {
      el.removeAttribute('data-in-view');
    }
  };

  callbackMap.set(el, handleEntry);
  observer.observe(el);

  return () => {
    observer.unobserve(el);
    callbackMap.delete(el);
  };
}
