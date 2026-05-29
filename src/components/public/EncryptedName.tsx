import { useEffect, useState } from 'react';

interface Props {
  fullName: string;
}

const GLYPHS = [
  '█', '░', '▒', '▓', '▖', '▗', '▘', '▙', '▚', '▛', '▜', '▝', '▞', '▟',
  'X', '$', '_', '*', '+', '&', '?', '#', '@', '0', '1', '7', '3', '9',
  '[', ']', '|', '<', '>', 'Δ', 'Ξ', 'Ω', 'Ψ', 'Φ', 'Γ', 'Σ', 'Θ', 'Λ'
];

export default function EncryptedName({ fullName }: Props) {
  // Gracefully handle splitting
  const parts = fullName.split(' ');
  const firstName = parts[0] || 'Aryan';
  const lastName = parts.slice(1).join(' ') || 'Sharma';

  const [firstNameText, setFirstNameText] = useState('');
  const [lastNameText, setLastNameText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    let active = true;

    // Reset states
    setFirstNameText('');
    setLastNameText('');
    setIsScrambling(false);

    const runSequence = async () => {
      // 1. Typewriter First Name
      for (let i = 1; i <= firstName.length; i++) {
        if (!active) return;
        setFirstNameText(firstName.slice(0, i));
        await new Promise(r => setTimeout(r, 45));
      }

      // Add space between first and last name
      if (!active) return;
      setFirstNameText(firstName + ' ');
      await new Promise(r => setTimeout(r, 50));

      // 2. Typewriter Last Name
      for (let i = 1; i <= lastName.length; i++) {
        if (!active) return;
        setLastNameText(lastName.slice(0, i));
        await new Promise(r => setTimeout(r, 40));
      }

      // 3. Peak Scramble / Hacker Glitch Phase
      if (!active) return;
      setIsScrambling(true);

      const totalGlitchTicks = 16; // peaks chaos duration
      const resolvedIndices = new Set<number>();
      let ticks = 0;

      while (active) {
        ticks++;
        
        let currentScramble = '';
        for (let i = 0; i < lastName.length; i++) {
          if (resolvedIndices.has(i)) {
            currentScramble += lastName[i];
          } else {
            currentScramble += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }

        setLastNameText(currentScramble);
        await new Promise(r => setTimeout(r, 40));

        // After reaching high entropy, resolve index-by-index from left to right
        if (ticks > totalGlitchTicks) {
          const nextIndexToResolve = resolvedIndices.size;
          if (nextIndexToResolve < lastName.length) {
            resolvedIndices.add(nextIndexToResolve);
          } else {
            break;
          }
        }
      }

      if (active) {
        setLastNameText(lastName);
        setIsScrambling(false);
      }
    };

    runSequence();

    return () => {
      active = false;
    };
  }, [fullName, firstName, lastName]);

  return (
    <span className="encrypted-name-wrapper">
      <span className="encrypted-name-first">{firstNameText}</span>
      <span className={`encrypted-name-last${isScrambling ? ' is-scrambling' : ''}`}>
        {lastNameText}
      </span>
    </span>
  );
}
