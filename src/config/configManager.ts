import type { SiteConfig } from '../types/siteConfig';
import { getDefaultConfig } from './siteConfig';
import { validateConfig, validateJsonConfig, mergeConfig } from './configSchema';
import { applyTypographyVars } from '../utils/textEffects';

const STORAGE_KEY = 'aryan_identity_site_config';
const DRAFT_KEY = 'aryan_identity_site_config_draft';

export function normalizeSiteConfig(config: SiteConfig): SiteConfig {
  const defaults = getDefaultConfig();
  const normalized = mergeConfig(
    defaults as unknown as Record<string, unknown>,
    config as unknown as Record<string, unknown>,
  ) as unknown as SiteConfig;

  const identitySectionIds = new Set(['signal-profile', 'anti-patterns', 'field-notes', 'operating-manual']);
  const configuredSections = Array.isArray(normalized.sections) ? normalized.sections : [];
  const hasIdentitySections = configuredSections.some(section => identitySectionIds.has(section.id));

  if (!hasIdentitySections) {
    configuredSections.forEach(section => {
      const defaultSection = defaults.sections.find(candidate => candidate.id === section.id);
      if (defaultSection) section.order = defaultSection.order;
    });
  }

  normalized.sections = [
    ...configuredSections,
    ...defaults.sections
      .filter(section => !configuredSections.some(candidate => candidate.id === section.id))
      .map(section => JSON.parse(JSON.stringify(section))),
  ];

  normalized.projects = normalized.projects.map(project => {
    if (project.proofDrawer) return project;
    const defaultProject = defaults.projects.find(candidate => candidate.id === project.id) ?? defaults.projects[0];
    return {
      ...project,
      proofDrawer: JSON.parse(JSON.stringify(defaultProject.proofDrawer)),
    };
  });

  return normalized;
}

export function loadConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeSiteConfig(JSON.parse(raw) as SiteConfig);
    }
  } catch (e) { console.warn('[configManager] Failed to load config:', e); }
  return getDefaultConfig();
}

export function saveConfig(config: SiteConfig): { success: boolean; errors: string[] } {
  const { valid, errors } = validateConfig(config);
  if (!valid) return { success: false, errors };
  try {
    config._lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return { success: true, errors: [] };
  } catch (e) { return { success: false, errors: [`Failed to save: ${(e as Error).message}`] }; }
}

export function saveDraft(config: SiteConfig): void {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(config)); } catch (e) { console.warn('[configManager] Failed to save draft:', e); }
}

export function loadDraft(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return normalizeSiteConfig(JSON.parse(raw) as SiteConfig);
  } catch (e) { console.warn('[configManager] Failed to load draft:', e); }
  return null;
}

export function clearDraft(): void { localStorage.removeItem(DRAFT_KEY); }

export function exportConfig(config: SiteConfig): string { return JSON.stringify(config, null, 2); }

export function importConfig(jsonString: string): { success: boolean; config: SiteConfig | null; errors: string[] } {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return { success: false, config: null, errors: [`Invalid JSON: ${(e as Error).message}`] };
  }

  let finalConfigToValidate: any = parsed;

  if (isCustomContentJson(parsed)) {
    const mappedPartial = mapCustomToSiteConfig(parsed);
    finalConfigToValidate = mergeConfig(getDefaultConfig() as unknown as Record<string, unknown>, mappedPartial as unknown as Record<string, unknown>);
  } else {
    finalConfigToValidate = mergeConfig(getDefaultConfig() as unknown as Record<string, unknown>, parsed as unknown as Record<string, unknown>);
  }

  const { valid, errors } = validateConfig(finalConfigToValidate);
  if (!valid) return { success: false, config: null, errors };

  return { success: true, config: normalizeSiteConfig(finalConfigToValidate as SiteConfig), errors: [] };
}

export function resetToDefaults(): SiteConfig {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DRAFT_KEY);
  return getDefaultConfig();
}

export function applyConfigToCSS(config: SiteConfig): void {
  const root = document.documentElement;
  const colorMap: Record<string, string> = {
    bg: '--surface-base', bgSecondary: '--surface-card', panel: '--surface-raised',
    text: '--text-primary', textSecondary: '--text-secondary', textMuted: '--text-muted',
    accent: '--accent-primary', accentSecondary: '--accent-secondary',
    accentEmotional: '--accent-emotional', accentProof: '--accent-proof',
    border: '--line-default', borderSubtle: '--line-subtle', borderStrong: '--line-strong',
  };
  if (config.colors) {
    for (const [key, cssVar] of Object.entries(colorMap)) {
      const val = config.colors[key as keyof typeof config.colors];
      if (val) root.style.setProperty(cssVar, val);
    }
    root.style.setProperty('--color-bg', config.colors.bg);
    root.style.setProperty('--color-bg-secondary', config.colors.bgSecondary);
    root.style.setProperty('--color-surface', config.colors.bgSecondary);
    root.style.setProperty('--color-surface-elevated', config.colors.panel);
    root.style.setProperty('--color-text', config.colors.text);
    root.style.setProperty('--color-text-secondary', config.colors.textSecondary);
    root.style.setProperty('--color-text-muted', config.colors.textMuted);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-accent-secondary', config.colors.accentSecondary);
    root.style.setProperty('--color-accent-emotional', config.colors.accentEmotional);
    root.style.setProperty('--color-accent-proof', config.colors.accentProof);
    root.style.setProperty('--color-border', config.colors.border);
    root.style.setProperty('--color-border-subtle', config.colors.borderSubtle);
    root.style.setProperty('--color-border-strong', config.colors.borderStrong);
    root.style.setProperty('--color-glow', config.colors.glow);
  }
  if (config.typography) {
    const t = config.typography;
    if (t.displayFont) root.style.setProperty('--font-display', t.displayFont);
    if (t.bodyFont) root.style.setProperty('--font-body', t.bodyFont);
    if (t.monoFont) root.style.setProperty('--font-mono', t.monoFont);
    if (t.typeXs) root.style.setProperty('--type-xs', t.typeXs);
    if (t.typeSm) root.style.setProperty('--type-sm', t.typeSm);
    if (t.typeBase) root.style.setProperty('--type-base', t.typeBase);
    if (t.typeMd) root.style.setProperty('--type-md', t.typeMd);
    if (t.typeLg) root.style.setProperty('--type-lg', t.typeLg);
    if (t.typeXl) root.style.setProperty('--type-xl', t.typeXl);
    if (t.type2xl) root.style.setProperty('--type-2xl', t.type2xl);
    if (t.typeDisplay) root.style.setProperty('--type-display', t.typeDisplay);
    if (t.lineHeight) root.style.setProperty('--body-line-height', String(t.lineHeight));
    if (t.headingWeight) root.style.setProperty('--heading-weight', String(t.headingWeight));
    if (t.bodyWeight) root.style.setProperty('--body-weight', String(t.bodyWeight));
    if (t.letterSpacing) root.style.setProperty('--letter-spacing', t.letterSpacing);
    if (t.headingScale) root.style.setProperty('--heading-scale', String(t.headingScale));
  }
  if (config.typographySystem) {
    applyTypographyVars(root, config.typographySystem, config);
  }
  if (config.background) {
    const b = config.background;
    root.style.setProperty('--background-dot-size', `${b.dotSize}px`);
    root.style.setProperty('--background-dot-spacing', `${b.dotSpacing}px`);
    root.style.setProperty('--background-dot-opacity', String(b.dotOpacity));
    root.style.setProperty('--background-dot-opacity-pct', `${Math.round(b.dotOpacity * 100)}%`);
    root.style.setProperty('--background-dot-reveal-opacity', String(b.dotRevealOpacity));
    root.style.setProperty('--background-dot-field-opacity', String(b.dotFieldOpacity));
    root.style.setProperty('--background-radial-glow-color', b.radialGlowColor);
    root.style.setProperty('--background-radial-glow-opacity', String(b.radialGlowOpacity));
    root.style.setProperty('--background-radial-glow-opacity-pct', `${Math.round(b.radialGlowOpacity * 100)}%`);
    root.style.setProperty('--background-radial-glow-color-2', b.radialGlowColor2);
    root.style.setProperty('--background-radial-glow-opacity-2', String(b.radialGlowOpacity2));
    root.style.setProperty('--background-radial-glow-opacity-2-pct', `${Math.round(b.radialGlowOpacity2 * 100)}%`);
    root.style.setProperty('--background-radial-glow-blur', `${b.radialGlowBlur}px`);
    root.style.setProperty('--background-vignette-opacity', String(b.vignetteOpacity));
    root.style.setProperty('--background-animation-speed', `${b.animationSpeed}s`);
  }
  if (config.layout) {
    if (config.layout.maxContentWidth) root.style.setProperty('--container', config.layout.maxContentWidth);
    if (config.layout.headerHeight) root.style.setProperty('--header-height', config.layout.headerHeight);
    if (config.layout.borderRadius) root.style.setProperty('--radius-1', config.layout.borderRadius);
    if (config.layout.borderRadius) root.style.setProperty('--radius-card', config.layout.borderRadius);
    if (config.layout.borderRadius) root.style.setProperty('--radius-button', config.layout.borderRadius);
    if (config.layout.sectionPaddingTop) root.style.setProperty('--space-section-y', config.layout.sectionPaddingTop);
    if (config.layout.cardPadding) root.style.setProperty('--space-card-padding', config.layout.cardPadding);
    if (config.layout.gridGap) root.style.setProperty('--space-grid-gap', config.layout.gridGap);
    if (config.layout.panelBlur) root.style.setProperty('--layout-panel-blur', `${config.layout.panelBlur}px`);
  }
  if (config.motion) {
    if (config.motion.durationFast) root.style.setProperty('--duration-fast', config.motion.durationFast + 'ms');
    if (config.motion.durationStandard) root.style.setProperty('--duration-standard', config.motion.durationStandard + 'ms');
    if (config.motion.durationSlow) root.style.setProperty('--duration-slow', config.motion.durationSlow + 'ms');
    if (config.motion.revealDuration) root.style.setProperty('--motion-reveal-duration', config.motion.revealDuration + 'ms');
  }
  if (config.seo) {
    if (config.seo.pageTitle) document.title = config.seo.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && config.seo.metaDescription) metaDesc.setAttribute('content', config.seo.metaDescription);
  }
}

export function downloadConfig(config: SiteConfig, filename = 'aryan-identity-config.json'): void {
  const json = exportConfig(config);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readConfigFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function isCustomContentJson(parsed: any): boolean {
  return parsed && typeof parsed === 'object' && (
    'hero' in parsed || 
    'case_files' in parsed || 
    'proof_layer' in parsed ||
    'human_layer' in parsed
  );
}

function mapCustomToSiteConfig(custom: any): Partial<SiteConfig> {
  const partial: Partial<SiteConfig> = {};

  if (custom.hero || custom.meta || custom.contact) {
    partial.identity = {
      name: custom.hero?.brand?.name || 'Aryan Sharma',
      handle: custom.contact?.handle || '@aryanteddys',
      roleLines: custom.hero?.roles || custom.hero?.tags || [
        'AI-native media systems',
        'Full-stack cloud + automation',
        'Proof-first production systems',
      ],
      location: custom.contact?.location || 'India',
      email: custom.contact?.email || 'aryanteddys@gmail.com',
      shortBio: custom.hero?.headline || 'I build AI-native media systems that are cinematic on the surface and traceable underneath.',
      heroStatement: custom.hero?.subheadline || 'AI-native media systems, built like production infrastructure and directed with taste.',
      heroStatementDirect: custom.hero?.subheadline || 'Full-stack engineering for media automation, AI workflows, cloud infra, observability, rendering, and review surfaces.',
      heroKicker: custom.hero?.brand?.label || 'PROOF-FIRST MEDIA SYSTEMS',
      brandSubtitle: 'systems / media / AI',
      brandGlyph: custom.hero?.brand?.initials || 'AS',
      ctaPrimary: {
        text: custom.hero?.cta?.[0]?.label || 'Inspect Case Files',
        href: custom.hero?.cta?.[0]?.href || '#systems-built'
      },
      ctaSecondary: {
        text: custom.hero?.cta?.[1]?.label || 'Email Aryan',
        href: custom.hero?.cta?.[1]?.href || '#open-channel'
      },
      metadata: {
        trace_id: custom.hero?.identity_trace?.trace_id || 'aryan.sharma',
        mode: custom.hero?.identity_trace?.mode || 'builder',
        origin: custom.hero?.identity_trace?.origin || 'India',
        handle: custom.contact?.handle || '@aryanteddys',
        stack: 'full-stack / cloud / ai / media',
        signal: custom.hero?.identity_trace?.signal || 'proof over noise',
      },
      portraitCaption: {
        label: 'visual_id',
        value: custom.hero?.identity_trace?.file || 'identity.trace_file'
      },
      portraitAlt: custom.hero?.identity_trace?.description || 'Aryan Sharma Portrait',
    };

    partial.portrait = {
      enabled: true,
      src: 'assets/aryan-profile.png',
      alt: custom.hero?.identity_trace?.description || 'Aryan Sharma in cold outdoor light wearing winter layers and sunglasses.',
      placement: 'hero',
      variant: 'cinematic-panel',
      aspectRatio: '4 / 5',
      objectPosition: '52% 50%',
      showMetadata: false,
      metadata: [
        { label: 'trace_id', value: custom.hero?.identity_trace?.trace_id || 'aryan.sharma' },
        { label: 'mode', value: custom.hero?.identity_trace?.mode || 'builder' },
        { label: 'origin', value: custom.hero?.identity_trace?.origin || 'India' },
        { label: 'signal', value: custom.hero?.identity_trace?.signal || 'proof over noise' },
      ],
      effects: {
        vignette: 0.34,
        glow: 0.14,
        grain: 0.04,
        hoverLift: false,
        scrollReveal: true,
      }
    };
  }

  // Mapping projects
  if (custom.case_files?.projects) {
    partial.projects = custom.case_files.projects.map((p: any) => ({
      id: p.name ? p.name.toLowerCase().replace(/\s+/g, '-') : 'project',
      name: p.name || 'Project Name',
      caseNumber: p.index || '01',
      type: p.headline || p.type || 'Case study',
      featured: true,
      status: 'active',
      confidenceLabel: 'high',
      storyDescription: [p.summary || '', p.details || p.problem || ''],
      systemDescription: p.details || p.problem || '',
      systemFlow: p.modes ? p.modes.map((m: string) => m.toLowerCase().replace(/\s+/g, '-')) : ['story-mode', 'system-mode'],
      problem: p.problem || '',
      system: p.details || '',
      stack: '',
      proofThemes: '',
      shows: '',
      links: {},
      proofDrawer: JSON.parse(JSON.stringify(getDefaultConfig().projects[0].proofDrawer)),
    }));
  }

  // Mapping proof layer (principles)
  if (custom.proof_layer?.principles) {
    partial.proofCards = custom.proof_layer.principles.map((p: any) => ({
      id: p.title ? p.title.toLowerCase().replace(/\s+/g, '-') : 'principle',
      index: p.index || '01',
      title: p.title || 'Principle Title',
      description: p.description || '',
      accentColor: null,
      visible: true,
      order: 0,
    }));
  }

  // Mapping stack
  if (custom.stack?.categories) {
    partial.skillGroups = custom.stack.categories.map((c: any, idx: number) => ({
      id: c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : 'skill-group',
      name: c.name || 'Category',
      description: c.items ? c.items.join(', ') : '',
      skills: c.items || [],
      displayStyle: 'matrix',
      order: idx,
    }));
  }

  // Mapping philosophy
  if (custom.philosophy?.items) {
    partial.philosophy = custom.philosophy.items.map((text: string, idx: number) => ({
      id: `p${idx + 1}`,
      text,
      intensity: idx === 6 ? 'loud' : 'sharp',
      largeType: true,
      order: idx,
    }));
  }

  // Mapping human layer (interests)
  if (custom.human_layer?.interests) {
    partial.humanLayer = {
      ...getDefaultConfig().humanLayer,
      motifs: custom.human_layer.interests.map((text: string, idx: number) => ({
        id: `m${idx + 1}`,
        text,
        symbol: '',
        visible: true,
        order: idx,
      }))
    };
  }

  // Mapping timeline
  if (custom.timeline?.events) {
    partial.timeline = custom.timeline.events.map((e: any, idx: number) => ({
      id: `t${idx + 1}`,
      date: e.period || '',
      title: e.event || '',
      description: '',
      tags: ['history'],
      visible: true,
      order: idx,
    }));
  }

  // Mapping contact
  if (custom.contact) {
    partial.contact = {
      email: custom.contact.email || 'aryanteddys@gmail.com',
      handle: custom.contact.handle || '@aryanteddys',
      location: custom.contact.location || 'India',
      ctaText: 'Email Aryan',
      ctaLink: custom.contact.links?.[0]?.href || `mailto:${custom.contact.email || 'aryanteddys@gmail.com'}`,
      resumeLink: custom.contact.links?.[1]?.href || 'Aryan_Sharma_Resume.pdf',
      resumeLabel: custom.contact.links?.[1]?.label || 'View Resume',
      githubLink: '',
      linkedinLink: '',
      socialLinks: [],
      customLinks: custom.contact.links?.slice(2).map((l: any) => ({ label: l.label, href: l.href })) || [{ label: 'Inspect Case Files', href: '#systems-built' }],
    };
  }

  // Map sections metadata (section titles/kickers)
  partial.sections = [
    { id: 'trace-begins', sectionId: 'trace_begins', signal: 'cold_boot', proofLevel: 'identity', systemStatus: 'awake', type: 'hero', title: 'Hero', kicker: custom.hero?.brand?.label || 'PROOF-FIRST MEDIA SYSTEMS', visible: true, order: 0, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    { id: 'identity', sectionId: 'not_template_developer', signal: 'anti_template', proofLevel: 'positioning', systemStatus: 'clear', type: 'statement', title: 'Identity Statement', kicker: custom.identity?.section_label || 'IDENTITY', railLabel: 'not_a_template_developer', visible: true, order: 1, animationStyle: 'reveal', backgroundIntensity: 1.0, bodyAtmospheric: custom.identity?.description || '', bodyDirect: custom.identity?.description || '' },
    { id: 'systems-built', sectionId: 'systems_built', signal: 'case_files', proofLevel: 'high', systemStatus: 'inspectable', type: 'projects', title: 'Systems Built', kicker: custom.case_files?.section_label || 'SYSTEMS BUILT', railLabel: 'case_files', heading: custom.case_files?.title || 'Inspectable systems, not project tiles.', descriptionAtmospheric: custom.case_files?.subtitle || 'Each case file shows the problem, system shape, stack, proof themes, and what the build proves.', descriptionDirect: custom.case_files?.description || 'Case files for AI media automation and controlled AI creative production.', visible: true, order: 2, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    { id: 'proof-layer', sectionId: 'proof_layer', signal: 'receipts_not_vibes', proofLevel: 'black_box', systemStatus: 'recording', type: 'proof', title: 'Proof Layer', kicker: custom.proof_layer?.section_label || 'PROOF LAYER', railLabel: 'receipts_not_vibes', heading: custom.proof_layer?.title || 'Reliability rules I build around.', descriptionAtmospheric: custom.proof_layer?.subtitle || 'The principles that keep media and AI systems useful when jobs fail, retry, render, or drift.', descriptionDirect: custom.proof_layer?.description || 'Idempotency, observability, render parity, state machines, golden-thread tracing, and tests.', visible: true, order: 3, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    { id: 'stack', sectionId: 'stack_clusters', signal: 'tools_with_context', proofLevel: 'practical', systemStatus: 'available', type: 'stack', title: 'Stack', kicker: custom.stack?.section_label || 'STACK', railLabel: 'tools_i_think_with', heading: custom.stack?.title || 'Tools grouped by the pressure they solve.', descriptionAtmospheric: custom.stack?.subtitle || 'A stack map organized by system responsibility, not logo collecting.', descriptionDirect: custom.stack?.description || 'Interface, backend, cloud, media, AI, and reliability clusters.', visible: true, order: 4, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    { id: 'philosophy', sectionId: 'operating_principles', signal: 'manifesto', proofLevel: 'values', systemStatus: 'stable', type: 'philosophy', title: 'Philosophy', kicker: custom.philosophy?.section_label || 'PHILOSOPHY', railLabel: 'operating_principles', visible: true, order: 5, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    { id: 'human-layer', sectionId: 'weather_inside_machine', signal: 'human_layer', proofLevel: 'subtle', systemStatus: 'breathing', type: 'human', title: 'Human Layer', kicker: custom.human_layer?.section_label || 'HUMAN LAYER', railLabel: 'weather_inside_machine', heading: custom.human_layer?.title || 'A colder signal, still human.', descriptionAtmospheric: custom.human_layer?.subtitle || 'Night, rain, blue light, sport, fiction, and dry humor. Texture, not a personality maze.', descriptionDirect: custom.human_layer?.description || 'Personal motifs that shape the interface without replacing the proof.', visible: true, order: 6, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    { id: 'build-log', sectionId: 'build_log', signal: 'timeline', proofLevel: 'receipts', systemStatus: 'indexed', type: 'timeline', title: 'Build Log', kicker: custom.timeline?.section_label || 'BUILD LOG', railLabel: 'timeline', heading: custom.timeline?.title || 'Recent build trace.', visible: true, order: 7, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    { id: 'open-channel', sectionId: 'open_channel', signal: 'contact', proofLevel: 'direct', systemStatus: 'listening', type: 'contact', title: 'Contact', kicker: custom.contact?.section_label || 'CONTACT', heading: custom.contact?.description || 'Need an AI media system that has to work in production?', visible: true, order: 8, animationStyle: 'reveal', backgroundIntensity: 1.0 },
  ];

  if (custom.meta) {
    partial.seo = {
      pageTitle: custom.meta.title || 'Aryan Sharma | AI-Native Media Systems',
      metaDescription: custom.hero?.subheadline || 'Aryan Sharma builds AI-native media systems, full-stack cloud automation, and proof-first production interfaces.',
      ogTitle: custom.meta.title || 'Aryan Sharma | AI-Native Media Systems',
      ogDescription: custom.hero?.subheadline || 'AI-native media systems, full-stack cloud automation, and proof-first production interfaces.',
      ogImage: '',
      favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2305070D'/%3E%3Crect x='8' y='8' width='48' height='48' fill='%23101826' stroke='%235DEBFF' stroke-width='2'/%3E%3Ctext x='32' y='38' text-anchor='middle' font-family='monospace' font-size='18' font-weight='700' fill='%235DEBFF'%3EAS%3C/text%3E%3C/svg%3E",
      themeColor: '#05070d',
    };
  }

  return partial;
}
