import type { ReactNode } from 'react';

export const iconRegistry = {
  signal: (
    <>
      <path d="M5 12a7 7 0 0 1 14 0" />
      <path d="M8 12a4 4 0 0 1 8 0" />
      <path d="M12 12h.01" />
      <path d="M12 16v3" />
    </>
  ),
  trace: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 6h4a4 4 0 0 1 4 4v6" />
      <path d="M6 8v10" />
    </>
  ),
  system: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="9" y="14" width="6" height="6" rx="1.5" />
      <path d="M10 7h4" />
      <path d="M12 10v4" />
    </>
  ),
  proof: (
    <>
      <path d="M12 3 5 6v5c0 4.4 2.7 8.4 7 10 4.3-1.6 7-5.6 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  code: (
    <>
      <path d="m9 18-6-6 6-6" />
      <path d="m15 6 6 6-6 6" />
    </>
  ),
  cloud: (
    <>
      <path d="M17.5 18H8a4 4 0 1 1 .8-7.9A5.5 5.5 0 0 1 19 12.5a2.8 2.8 0 0 1-1.5 5.5Z" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
    </>
  ),
  media: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 5v14" />
      <path d="m12 10 4 2-4 2v-4Z" />
    </>
  ),
  terminal: (
    <>
      <path d="m5 7 5 5-5 5" />
      <path d="M12 17h7" />
    </>
  ),
  archive: (
    <>
      <rect x="4" y="4" width="16" height="5" rx="1" />
      <path d="M6 9v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9" />
      <path d="M10 13h4" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3 13.5 9 20 12l-6.5 3L12 21l-1.5-6L4 12l6.5-3L12 3Z" />
    </>
  ),
  command: (
    <>
      <path d="M9 9H6.5A2.5 2.5 0 1 1 9 6.5V9Z" />
      <path d="M15 9h2.5A2.5 2.5 0 1 0 15 6.5V9Z" />
      <path d="M9 15H6.5A2.5 2.5 0 1 0 9 17.5V15Z" />
      <path d="M15 15h2.5A2.5 2.5 0 1 1 15 17.5V15Z" />
      <path d="M9 9h6v6H9z" />
    </>
  ),
  externalLink: (
    <>
      <path d="M14 4h6v6" />
      <path d="m10 14 10-10" />
      <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
    </>
  ),
  mail: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m4 8 8 6 8-6" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  github: (
    <>
      <path d="M9 19c-4 1.2-4-2-5.6-2.4" />
      <path d="M15 22v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.4 5.6-6A4.7 4.7 0 0 0 18.5 7a4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.8 11.8 0 0 0-6 0C6.6 3.5 5.6 3.8 5.6 3.8A4.3 4.3 0 0 0 5.5 7a4.7 4.7 0 0 0-1.3 3.3c0 4.6 2.9 5.7 5.6 6a3 3 0 0 0-.8 2.3V22" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 11v5" />
      <path d="M8 8h.01" />
      <path d="M12 16v-5" />
      <path d="M12 13a2 2 0 0 1 4 0v3" />
    </>
  ),
  resume: (
    <>
      <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 20h14" />
    </>
  ),
  upload: (
    <>
      <path d="M12 20V10" />
      <path d="m8 14 4-4 4 4" />
      <path d="M5 4h14" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V6a2 2 0 0 1 2-2h10" />
    </>
  ),
  save: (
    <>
      <path d="M5 4h12l2 2v14H5V4Z" />
      <path d="M8 4v6h8" />
      <path d="M8 18h8" />
    </>
  ),
  sync: (
    <>
      <path d="M20 12a8 8 0 0 1-14.2 5" />
      <path d="M4 12a8 8 0 0 1 14.2-5" />
      <path d="M18 3v4h-4" />
      <path d="M6 21v-4h4" />
    </>
  ),
  success: (
    <>
      <path d="m5 13 4 4L19 7" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3 21 20H3L12 3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
  loading: (
    <>
      <path d="M21 12a9 9 0 0 1-9 9" />
      <path d="M3 12a9 9 0 0 1 9-9" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13 7 4 4" />
    </>
  ),
  reset: (
    <>
      <path d="M4 7v5h5" />
      <path d="M20 17a8 8 0 0 1-13.7-5L4 12" />
      <path d="M20 7v5h-5" />
      <path d="M4 17a8 8 0 0 1 13.7-5L20 12" />
    </>
  ),
  import: (
    <>
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 21h14" />
    </>
  ),
  export: (
    <>
      <path d="M12 21V9" />
      <path d="m8 13 4-4 4 4" />
      <path d="M5 3h14" />
    </>
  ),
  theme: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.4-3.4l-.3-.3a2 2 0 0 1 1.4-3.4H18a3 3 0 0 0 3-3 8 8 0 0 0-9-7.9Z" />
      <circle cx="7.5" cy="10" r=".5" />
      <circle cx="10" cy="7.5" r=".5" />
      <circle cx="14" cy="7.5" r=".5" />
    </>
  ),
  palette: (
    <>
      <circle cx="7" cy="8" r="1" />
      <circle cx="12" cy="6.5" r="1" />
      <circle cx="17" cy="9" r="1" />
      <path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-.8a2 2 0 0 1-2-2c0-1.3 1-2 2.2-2H15a6 6 0 0 0 0-12h-3Z" />
    </>
  ),
  typography: (
    <>
      <path d="M4 6V4h16v2" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </>
  ),
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m4 16 4-4 4 4 2-2 6 6" />
    </>
  ),
  motion: (
    <>
      <path d="M4 12h4l2-6 4 12 2-6h4" />
    </>
  ),
  settings: (
    <>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M4.9 4.9 7 7" />
      <path d="m17 17 2.1 2.1" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7.4-2" />
    </>
  ),
  chevron: (
    <>
      <path d="m9 6 6 6-6 6" />
    </>
  ),
  expand: (
    <>
      <path d="M8 3H3v5" />
      <path d="M16 3h5v5" />
      <path d="M21 16v5h-5" />
      <path d="M3 16v5h5" />
    </>
  ),
  collapse: (
    <>
      <path d="M8 3v5H3" />
      <path d="M16 3v5h5" />
      <path d="M21 16h-5v5" />
      <path d="M3 16h5v5" />
    </>
  ),
  problem: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.8 2.8 0 1 1 4.2 2.4c-1 .6-1.7 1.2-1.7 2.6" />
      <path d="M12 17h.01" />
    </>
  ),
  flow: (
    <>
      <rect x="3" y="5" width="5" height="5" rx="1" />
      <rect x="16" y="5" width="5" height="5" rx="1" />
      <rect x="9.5" y="14" width="5" height="5" rx="1" />
      <path d="M8 7.5h8" />
      <path d="M12 10v4" />
    </>
  ),
  stack: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>
  ),
  status: (
    <>
      <path d="M4 12h4l2-7 4 14 2-7h4" />
    </>
  ),
  story: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </>
  ),
  certificate: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="m9 13-1 8 4-2 4 2-1-8" />
      <path d="m9.5 8 1.5 1.5L14.5 6" />
    </>
  ),
  work: (
    <>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7V5h6v2" />
      <path d="M4 12h16" />
    </>
  ),
  current: (
    <>
      <path d="M12 3 15 9l6 .8-4.5 4.4 1 6.3L12 17.5 6.5 20.5l1-6.3L3 9.8 9 9l3-6Z" />
    </>
  ),
  log: (
    <>
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
      <path d="M4 6h.01" />
      <path d="M4 12h.01" />
      <path d="M4 18h.01" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M3 10h18" />
    </>
  ),
  colors: (
    <>
      <path d="M7 21h10" />
      <path d="M12 3v12" />
      <path d="M8 7h8" />
      <path d="M7 15h10" />
    </>
  ),
  background: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </>
  ),
  seo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  assets: (
    <>
      <path d="M4 7a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
    </>
  ),
  json: (
    <>
      <path d="M8 4H6a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-2" />
    </>
  ),
  delete: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  duplicate: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 16V7a2 2 0 0 1 2-2h9" />
      <path d="M13.5 11v5" />
      <path d="M11 13.5h5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
} as const satisfies Record<string, ReactNode>;

export type IconName = keyof typeof iconRegistry;

export const sectionIconMap: Record<string, IconName> = {
  hero: 'signal',
  statement: 'trace',
  'signal-profile': 'signal',
  projects: 'archive',
  proof: 'proof',
  'anti-patterns': 'warning',
  stack: 'stack',
  'field-notes': 'log',
  philosophy: 'spark',
  'operating-manual': 'person',
  human: 'person',
  timeline: 'log',
  contact: 'mail',
};

export const navIconMap: Record<string, IconName> = {
  '#systems-built': 'archive',
  '#proof-layer': 'proof',
  '#stack': 'stack',
  '#open-channel': 'mail',
};

export const projectTabIconMap: Record<string, IconName> = {
  problem: 'problem',
  system: 'flow',
  stack: 'stack',
  proof: 'proof',
  shows: 'spark',
};

export const proofIconMap: Record<string, IconName> = {
  idempotency: 'sync',
  observability: 'status',
  'render-parity': 'media',
  'state-machines': 'flow',
  'golden-threads': 'trace',
  'tests-before-code': 'proof',
  queues: 'database',
  'health-probes': 'status',
};

export const skillIconMap: Record<string, IconName> = {
  interface: 'layout',
  backend: 'code',
  'cloud-infra': 'cloud',
  'media-systems': 'media',
  'ai-systems': 'ai',
  reliability: 'proof',
};

export const timelineIconMap: Record<string, IconName> = {
  certification: 'certificate',
  work: 'work',
  systems: 'system',
  identity: 'signal',
};

export const controlNavIconMap: Record<string, IconName> = {
  identity: 'person',
  sections: 'layout',
  projects: 'archive',
  'identity-layer': 'signal',
  overview: 'terminal',
  'lab-modules': 'database',
  proof: 'proof',
  skills: 'stack',
  philosophy: 'spark',
  human: 'person',
  timeline: 'log',
  contact: 'mail',
  theme: 'theme',
  portrait: 'image',
  typography: 'typography',
  colors: 'palette',
  background: 'background',
  motion: 'motion',
  layout: 'layout',
  seo: 'seo',
  assets: 'assets',
  json: 'json',
};

export const controlGroupIconMap: Record<string, IconName> = {
  Lab: 'terminal',
  Content: 'archive',
  Design: 'palette',
  System: 'database',
};

export function resolveIconName(name: string | undefined, fallback: IconName = 'trace'): IconName {
  return name && name in iconRegistry ? name as IconName : fallback;
}
