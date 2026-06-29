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
 * Cycles through a list of words with a controlled typewriter effect.
 * 
 * Rules:
 * - Maximum ONE instance on the entire homepage
 * - Smooth typing and deleting lifecycle
 * - Respects prefers-reduced-motion
 * - Aligns perfectly on the parent line baseline
 */
export default function RotatingWord({
  words,
  className = '',
}: RotatingWordProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reducedMotion.current || words.length === 0) {
      if (words.length > 0) setDisplayText(words[0]);
      return;
    }

    let timer: number;
    const currentWord = words[wordIndex] || '';

    if (!isDeleting) {
      if (displayText !== currentWord) {
        timer = window.setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 85); // typing speed
      } else {
        timer = window.setTimeout(() => {
          setIsDeleting(true);
        }, 1800); // hold word when typed
      }
    } else {
      if (displayText !== '') {
        timer = window.setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, 45); // deleting speed
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, words]);

  return (
    <span
      className={`rotating-word-container ${className}`.trim()}
      aria-label={words.join(', ')}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="rotating-word typewriter-text" aria-hidden="true">
        {displayText}
      </span>
      {!reducedMotion.current && <span className="typewriter-cursor" aria-hidden="true" />}
    </span>
  );
}
