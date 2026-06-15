import { useEffect, useState, useRef } from 'react';

interface RotatingWordProps {
  words: string[];
  /** Duration each word is visible, in ms. Default: 2400 */
  interval?: number;
  className?: string;
}

/**
 * RotatingWord — Layer 3 (Signature)
 * 
 * Cycles through a list of words with a controlled crossfade.
 * Only the word itself changes; surrounding sentence stays static.
 * 
 * Rules:
 * - Maximum ONE instance on the entire homepage
 * - Slow transitions (crossfade with subtle translateY)
 * - Respects prefers-reduced-motion (shows first word, no animation)
 * - Adapts timing via CSS custom property --rotating-word-interval
 */
export default function RotatingWord({
  words,
  interval = 2400,
  className = '',
}: RotatingWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reducedMotion.current || words.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);

      // After exit animation completes, switch word and enter
      const switchTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsTransitioning(false);
      }, 400); // match CSS transition duration

      return () => clearTimeout(switchTimer);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  const word = words[currentIndex] || words[0];

  return (
    <span
      className={`rotating-word-container ${className}`.trim()}
      aria-label={words.join(', ')}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={`rotating-word ${isTransitioning ? 'is-exiting' : 'is-entering'}`}
        aria-hidden="true"
      >
        {word}
      </span>
    </span>
  );
}
