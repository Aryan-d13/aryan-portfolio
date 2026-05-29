import { useId } from 'react';

export default function PathText({ enabled, text }: { enabled: boolean; text: string }) {
  const id = `path-text-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  if (!enabled) return null;

  return (
    <svg className="path-text-badge" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <text>
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
      <circle cx="60" cy="60" r="31" />
      <line x1="44" y1="60" x2="76" y2="60" />
    </svg>
  );
}
