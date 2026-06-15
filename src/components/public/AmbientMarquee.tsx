import React from 'react';

interface AmbientMarqueeProps {
  items: string[];
}

/**
 * AmbientMarquee is a pure CSS-driven marquee for secondary background content.
 * Follows the 20% polished budget (calm background life).
 * Edge-masked, non-essential, and fully respects prefers-reduced-motion.
 */
export default function AmbientMarquee({ items }: AmbientMarqueeProps) {
  const uniqueItems = Array.from(new Set(items.map(s => s.trim()).filter(Boolean)));
  
  if (uniqueItems.length === 0) return null;

  // Duplicate items twice to ensure smooth, seamless looping on wide displays
  const trackItems = [...uniqueItems, ...uniqueItems, ...uniqueItems];

  return (
    <div className="ambient-marquee-container" aria-hidden="true">
      <div className="ambient-marquee-track">
        {trackItems.map((item, idx) => (
          <span key={`${item}-${idx}`} className="ambient-marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
