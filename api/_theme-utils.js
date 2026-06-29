import { getBuiltInTheme } from './generated-built-in-themes.js';

const BOOTSTRAP_COLLECTION = 'portfolioBootstrap';
const CONFIG_COLLECTION = 'portfolioConfig';
const DOC_ID = 'main';

const REMOTE_CACHE_KEY = 'aryan_theme_engine_remote_cache';
const ACTIVE_THEME_KEY = 'aryan_theme_engine_active_theme_id';
const CUSTOM_THEMES_KEY = 'aryan_theme_engine_custom_themes';
const SITE_CONFIG_KEY = 'aryan_identity_site_config';

const PORTRAIT_BY_THEME = {
  'nocturnal-signal': '/assets/filterimages/nocturnal-signal.webp',
  'soft-trace-luxury': '/assets/filterimages/soft-trace-luxury.webp',
  'quantum-rain': '/assets/filterimages/quantum-rain.webp',
  'noir-operating-system': '/assets/filterimages/noir-operating-system.webp',
  'skyline-terminal': '/assets/filterimages/skyline-terminal.webp',
  'editorial-cybernetic': '/assets/filterimages/editorial-cybernetic.webp',
  'obsidian-lab': '/assets/filterimages/obsidian-lab.webp',
  'blue-hour-cinema': '/assets/filterimages/blue-hour-cinema.webp',
  'proof-archive': '/assets/filterimages/proof-archive.webp',
  'cosmic-debug': '/assets/filterimages/cosmic-debug.webp',
};

const CACHE_HEADERS = {
  'content-type': 'application/javascript; charset=utf-8',
  'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function nowIso() {
  return new Date().toISOString();
}

function envValue(env, ...keys) {
  for (const key of keys) {
    const value = env?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function stripUndefined(value) {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)]),
    );
  }
  return value;
}

async function getRedisValue(key, env = process.env) {
  const url = envValue(env, 'UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL', 'VITE_UPSTASH_REDIS_REST_URL');
  const token = envValue(env, 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN', 'VITE_UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) {
    return null;
  }
  const cleanUrl = url.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Redis read failed (${response.status}): ${text.slice(0, 180)}`);
  }
  const result = await response.json();
  if (!result || result.result === undefined || result.result === null) return null;
  return typeof result.result === 'string' ? JSON.parse(result.result) : result.result;
}

async function setRedisValue(key, value, env = process.env) {
  const url = envValue(env, 'UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL', 'VITE_UPSTASH_REDIS_REST_URL');
  const token = envValue(env, 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN', 'VITE_UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) {
    throw new Error('Upstash Redis environment variables are missing');
  }
  const cleanUrl = url.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Redis write failed (${response.status}): ${text.slice(0, 180)}`);
  }
  return true;
}

function getDefaultSnapshot() {
  const defaultTheme = getBuiltInTheme('nocturnal-signal') || getBuiltInTheme('quantum-rain');
  const state = {
    activeThemeId: defaultTheme.id,
    customThemes: [],
    themeOverrides: {},
    updatedAt: new Date().toISOString(),
    version: 1,
  };
  return createSnapshot({
    state,
    activeTheme: defaultTheme,
    source: 'default',
  });
}

function themeModeFor(activeThemeId, customThemes) {
  return customThemes.some(theme => theme?.id === activeThemeId) ? 'custom' : 'built-in';
}

function hasThemeShape(theme) {
  return isObject(theme)
    && typeof theme.id === 'string'
    && isObject(theme.colors)
    && typeof theme.colors.bg === 'string'
    && isObject(theme.typography)
    && isObject(theme.background)
    && isObject(theme.motion)
    && isObject(theme.layout);
}

function normalizeCustomThemes(customThemes) {
  return Array.isArray(customThemes)
    ? customThemes.filter(hasThemeShape)
    : [];
}

function normalizeRemoteState(raw, activeTheme) {
  const data = isObject(raw) ? raw : {};
  const customThemes = normalizeCustomThemes(data.customThemes);
  const activeThemeId = typeof data.activeThemeId === 'string'
    ? data.activeThemeId
    : activeTheme?.id;

  if (!activeThemeId) {
    throw new Error('Theme bootstrap snapshot is missing activeThemeId');
  }

  return {
    activeThemeId,
    themeMode: data.themeMode === 'custom' ? 'custom' : themeModeFor(activeThemeId, customThemes),
    customThemes,
    themeOverrides: isObject(data.themeOverrides) ? data.themeOverrides : {},
    typographySettings: data.typographySettings ?? activeTheme?.typography ?? null,
    typographySystem: data.typographySystem ?? activeTheme?.typographySystem ?? null,
    backgroundSettings: data.backgroundSettings ?? activeTheme?.background ?? null,
    motionSettings: data.motionSettings ?? activeTheme?.motion ?? null,
    siteConfig: isObject(data.siteConfig) ? data.siteConfig : null,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : nowIso(),
    updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
    version: typeof data.version === 'number' ? data.version : Number(data.version ?? 1) || 1,
  };
}

function resolveActiveThemeFromDocument(data) {
  if (hasThemeShape(data.activeTheme)) return data.activeTheme;
  if (hasThemeShape(data.activeThemeSnapshot)) return data.activeThemeSnapshot;
  if (hasThemeShape(data.theme)) return data.theme;

  const state = isObject(data.remoteState) ? data.remoteState : data;
  const customThemes = normalizeCustomThemes(state.customThemes);
  const customTheme = customThemes.find(theme => theme.id === state.activeThemeId);
  if (customTheme) return customTheme;

  const builtInTheme = typeof state.activeThemeId === 'string' ? getBuiltInTheme(state.activeThemeId) : null;
  if (!builtInTheme) return null;

  return {
    ...builtInTheme,
    typography: {
      ...builtInTheme.typography,
      ...(isObject(state.typographySettings) ? state.typographySettings : {}),
    },
    typographySystem: isObject(state.typographySystem)
      ? state.typographySystem
      : builtInTheme.typographySystem,
    background: {
      ...builtInTheme.background,
      ...(isObject(state.backgroundSettings) ? state.backgroundSettings : {}),
    },
    motion: {
      ...builtInTheme.motion,
      ...(isObject(state.motionSettings) ? state.motionSettings : {}),
    },
  };
}

function resolvePortraitSrc(snapshot) {
  const configuredPortrait = snapshot.siteConfig?.portrait?.src
    || snapshot.siteConfig?.assets?.profileImage
    || '';
  return snapshot.portraitSrc
    || configuredPortrait
    || PORTRAIT_BY_THEME[snapshot.activeThemeId]
    || '/assets/filterimages/nocturnal-signal.webp';
}

function createSnapshot({ state, activeTheme, source, siteConfig, portraitSrc }) {
  if (!hasThemeShape(activeTheme)) {
    throw new Error('Theme bootstrap snapshot is missing a complete activeTheme');
  }

  const normalizedState = normalizeRemoteState(
    {
      ...state,
      activeThemeId: state?.activeThemeId ?? activeTheme.id,
      siteConfig: siteConfig ?? state?.siteConfig ?? null,
    },
    activeTheme,
  );

  let customThemes = normalizeCustomThemes(normalizedState.customThemes);
  if (activeTheme.source === 'custom' && !customThemes.some(theme => theme.id === activeTheme.id)) {
    customThemes = [...customThemes, activeTheme];
  }

  const remoteState = {
    ...normalizedState,
    activeThemeId: activeTheme.id,
    themeMode: themeModeFor(activeTheme.id, customThemes),
    customThemes,
    siteConfig: siteConfig ?? normalizedState.siteConfig,
  };

  const snapshot = {
    version: remoteState.version,
    updatedAt: remoteState.updatedAt,
    activeThemeId: activeTheme.id,
    activeTheme,
    customThemes,
    siteConfig: remoteState.siteConfig,
    source,
    portraitSrc: portraitSrc || '',
    remoteState,
  };

  snapshot.portraitSrc = resolvePortraitSrc(snapshot);
  return snapshot;
}

function snapshotFromDocument(data, source) {
  if (!isObject(data)) return null;

  if (isObject(data.remoteState) && hasThemeShape(data.activeTheme)) {
    return createSnapshot({
      state: data.remoteState,
      activeTheme: data.activeTheme,
      source: data.source || source,
      siteConfig: isObject(data.siteConfig) ? data.siteConfig : data.remoteState.siteConfig,
      portraitSrc: typeof data.portraitSrc === 'string' ? data.portraitSrc : '',
    });
  }

  const activeTheme = resolveActiveThemeFromDocument(data);
  if (!activeTheme) {
    throw new Error('Remote theme state does not include a resolvable activeTheme snapshot');
  }

  const state = isObject(data.state) ? data.state : data;
  return createSnapshot({
    state,
    activeTheme,
    source,
    siteConfig: isObject(data.siteConfig) ? data.siteConfig : state.siteConfig,
    portraitSrc: typeof data.portraitSrc === 'string' ? data.portraitSrc : '',
  });
}

export async function readThemeBootstrapSnapshot(env = process.env) {
  const bootstrap = await getRedisValue('portfolioBootstrap:main', env);
  if (bootstrap) return snapshotFromDocument(bootstrap, 'server');

  const legacy = await getRedisValue('portfolioConfig:main', env);
  if (legacy) return snapshotFromDocument(legacy, 'legacy');

  return getDefaultSnapshot();
}

export async function readThemeConfigSnapshot(env = process.env) {
  const config = await getRedisValue('portfolioConfig:main', env);
  if (config) return config;

  const defaultSnap = getDefaultSnapshot();
  return defaultSnap.remoteState;
}

function escapeForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildThemeBootstrapScript(snapshot, errorMessage = '') {
  return `;(() => {
  const SERVER_SNAPSHOT = ${escapeForScript(snapshot)};
  const SERVER_ERROR = ${escapeForScript(errorMessage)};
  const REMOTE_CACHE_KEY = ${escapeForScript(REMOTE_CACHE_KEY)};
  const ACTIVE_THEME_KEY = ${escapeForScript(ACTIVE_THEME_KEY)};
  const CUSTOM_THEMES_KEY = ${escapeForScript(CUSTOM_THEMES_KEY)};
  const SITE_CONFIG_KEY = ${escapeForScript(SITE_CONFIG_KEY)};

  const root = document.documentElement;
  const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const setVar = (name, value) => {
    if (value !== undefined && value !== null && value !== '') root.style.setProperty(name, String(value));
  };
  const colorMix = (a, b, pct) => 'color-mix(in srgb, ' + a + ' ' + Math.round(pct * 100) + '%, ' + b + ')';
  const pct = value => typeof value === 'number' ? Math.round(value * 100) + '%' : undefined;

  function validTheme(theme) {
    return isObject(theme)
      && typeof theme.id === 'string'
      && isObject(theme.colors)
      && typeof theme.colors.bg === 'string'
      && isObject(theme.typography)
      && isObject(theme.background)
      && isObject(theme.motion)
      && isObject(theme.layout);
  }

  function validSnapshot(snapshot) {
    return isObject(snapshot)
      && validTheme(snapshot.activeTheme)
      && typeof snapshot.activeThemeId === 'string'
      && isObject(snapshot.remoteState);
  }

  function snapshotFromCache() {
    try {
      const raw = localStorage.getItem(REMOTE_CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached || !validTheme(cached.activeTheme) || !isObject(cached.state)) return null;
      const state = cached.state;
      return {
        version: typeof state.version === 'number' ? state.version : 1,
        updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : new Date().toISOString(),
        activeThemeId: cached.activeTheme.id,
        activeTheme: cached.activeTheme,
        customThemes: Array.isArray(state.customThemes) ? state.customThemes : [],
        siteConfig: isObject(state.siteConfig) ? state.siteConfig : null,
        source: 'cache',
        portraitSrc: cached.portraitSrc || state.siteConfig?.portrait?.src || state.siteConfig?.assets?.profileImage || '',
        remoteState: state,
      };
    } catch {
      return null;
    }
  }

  function writeStorage(snapshot) {
    try {
      const state = {
        ...snapshot.remoteState,
        activeThemeId: snapshot.activeThemeId,
        customThemes: Array.isArray(snapshot.customThemes) ? snapshot.customThemes : [],
        siteConfig: snapshot.siteConfig ?? snapshot.remoteState.siteConfig ?? null,
      };
      localStorage.setItem(REMOTE_CACHE_KEY, JSON.stringify({
        state,
        activeTheme: snapshot.activeTheme,
        cachedAt: new Date().toISOString(),
        portraitSrc: snapshot.portraitSrc || '',
      }));
      localStorage.setItem(ACTIVE_THEME_KEY, snapshot.activeThemeId);
      localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(state.customThemes));
      if (state.siteConfig) localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(state.siteConfig));
    } catch {
      /* Storage is an optimization only. */
    }
  }

  function applyTypographySystem(theme) {
    const system = theme.typographySystem || {};
    const controls = system.controls || {};
    root.dataset.typePreset = String(system.presetName || 'theme').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    root.dataset.typeReadingMode = controls.readingMode || controls.reducedMotionBehavior === 'reading-mode' ? 'true' : 'false';
    root.dataset.typeGlitch = controls.glitchEnabled ? 'true' : 'false';
    root.dataset.typePath = controls.pathTextEnabled ? 'true' : 'false';
    root.dataset.typeReducedMotion = controls.reducedMotionBehavior || 'respect-system';
    root.dataset.typeCase = controls.caseBehavior || theme.typography?.sectionLabelStyle || 'uppercase';
    setVar('--type-animation-intensity', controls.animationIntensity ?? 0.5);
    setVar('--type-glow-opacity', controls.glowIntensity ?? 0.12);
    setVar('--type-glow-opacity-pct', pct(controls.glowIntensity ?? 0.12));
    setVar('--type-outline-width', (controls.outlineThickness ?? 1) + 'px');
    setVar('--type-outline-opacity', controls.strokeOpacity ?? 0.26);
    setVar('--type-outline-opacity-pct', pct(controls.strokeOpacity ?? 0.26));
    setVar('--type-mask-opacity', controls.maskedTextureOpacity ?? 0.22);
    setVar('--type-grain-opacity', controls.grainAmount ?? 0.08);
    setVar('--type-reveal-duration', (controls.revealDuration ?? 460) + 'ms');
    setVar('--type-stagger-delay', (controls.kineticStaggerDelay ?? 54) + 'ms');
    setVar('--type-letter-spacing', controls.letterSpacing || '0');
    setVar('--type-line-height', controls.lineHeight ?? 1.6);
    setVar('--type-heading-scale', controls.headingScale ?? 1);
    setVar('--type-label-transform', controls.caseBehavior === 'none' ? 'none' : (controls.caseBehavior || theme.typography?.sectionLabelStyle || 'uppercase'));
    setVar('--type-shadow-depth', Math.round((controls.glowIntensity ?? 0.12) * 90) + 'px');
    setVar('--type-distortion-intensity', controls.animationIntensity ?? 0.5);
    setVar('--type-gradient-start', theme.colors.text);
    setVar('--type-gradient-mid', theme.colors.accentSecondary);
    setVar('--type-gradient-end', theme.colors.accent);
  }

  function applyTheme(theme) {
    const c = theme.colors || {};
    const t = theme.typography || {};
    const s = theme.spacing || {};
    const r = theme.radius || {};
    const borders = theme.borders || {};
    const e = theme.elevation || {};
    const b = theme.background || {};
    const g = theme.glow || {};
    const m = theme.motion || {};
    const comp = theme.components || {};
    const layout = theme.layout || {};
    const icons = theme.icons || {};

    root.dataset.themeId = theme.id;
    root.dataset.themeBackground = b.type || 'trace-grid';
    root.dataset.themeDensity = layout.density || s.density || 'cinematic';
    root.dataset.themeCard = comp.cardStyle || 'glass';
    root.dataset.themeMotion = m.personality || 'restrained';
    root.dataset.themeTransitionStyle = m.transitionStyle || 'crossfade';
    root.classList.remove('theme-transitioning');

    setVar('--color-bg', c.bg);
    setVar('--color-bg-secondary', c.bgSecondary);
    setVar('--color-surface', c.surface);
    setVar('--color-surface-elevated', c.surfaceElevated);
    setVar('--color-text', c.text);
    setVar('--color-text-secondary', c.textSecondary);
    setVar('--color-text-muted', c.textMuted);
    setVar('--color-accent', c.accent);
    setVar('--color-accent-secondary', c.accentSecondary);
    setVar('--color-accent-emotional', c.accentEmotional);
    setVar('--color-accent-proof', c.accentProof);
    setVar('--color-border', c.border);
    setVar('--color-border-subtle', c.borderSubtle);
    setVar('--color-border-strong', c.borderStrong);
    setVar('--color-glow', c.glow);
    setVar('--color-warning', c.warning);
    setVar('--color-success', c.success);
    setVar('--surface-base', c.bg);
    setVar('--surface-card', c.surface || c.bgSecondary);
    setVar('--surface-raised', c.surfaceElevated || c.bgSecondary);
    setVar('--text-primary', c.text);
    setVar('--text-secondary', c.textSecondary);
    setVar('--text-muted', c.textMuted);
    setVar('--accent-primary', c.accent);
    setVar('--accent-secondary', c.accentSecondary);
    setVar('--accent-emotional', c.accentEmotional);
    setVar('--accent-proof', c.accentProof);
    setVar('--line-default', c.border);
    setVar('--line-subtle', c.borderSubtle);
    setVar('--line-strong', c.borderStrong);

    setVar('--font-display', t.displayFont);
    setVar('--font-body', t.bodyFont);
    setVar('--font-mono', t.monoFont);
    setVar('--body-line-height', t.lineHeight);
    setVar('--heading-weight', t.headingWeight);
    setVar('--body-weight', t.bodyWeight);
    setVar('--letter-spacing', t.letterSpacing);
    setVar('--heading-scale', t.headingScale);
    setVar('--type-xs', t.typeXs);
    setVar('--type-sm', t.typeSm);
    setVar('--type-base', t.typeBase);
    setVar('--type-md', t.typeMd);
    setVar('--type-lg', t.typeLg);
    setVar('--type-xl', t.typeXl);
    setVar('--type-2xl', t.type2xl);
    setVar('--type-display', t.typeDisplay);
    applyTypographySystem(theme);

    setVar('--space-section-y', s.sectionY);
    setVar('--space-container-x', s.containerX);
    setVar('--space-card-padding', s.cardPadding);
    setVar('--space-grid-gap', s.gridGap);
    if (s.baseUnit !== undefined) setVar('--space-base-unit', s.baseUnit + 'px');
    setVar('--radius-1', r.sm);
    setVar('--radius-2', r.md);
    setVar('--radius-card', r.card);
    setVar('--radius-button', r.button);
    setVar('--radius-pill', r.pill);
    setVar('--border-hairline', borders.hairline);
    setVar('--border-default', borders.default);
    setVar('--border-strong', borders.strong);
    setVar('--border-divider-opacity', borders.dividerOpacity);
    setVar('--shadow-ambient', e.ambient);
    setVar('--shadow-raised', e.raised);
    setVar('--shadow-glow', e.glow);
    setVar('--shadow-inset', e.inset);
    setVar('--shadow-card', e.card);

    if (b.dotSize !== undefined) setVar('--background-dot-size', b.dotSize + 'px');
    if (b.dotSpacing !== undefined) setVar('--background-dot-spacing', b.dotSpacing + 'px');
    setVar('--background-dot-opacity', b.dotOpacity);
    setVar('--background-dot-opacity-pct', pct(b.dotOpacity));
    setVar('--background-dot-reveal-opacity', b.dotRevealOpacity);
    setVar('--background-dot-field-opacity', b.dotFieldOpacity);
    setVar('--background-radial-glow-color', b.radialGlowColor);
    setVar('--background-radial-glow-opacity', b.radialGlowOpacity);
    setVar('--background-radial-glow-opacity-pct', pct(b.radialGlowOpacity));
    if (b.radialGlowSize !== undefined) setVar('--background-radial-glow-size', b.radialGlowSize + '%');
    if (b.radialGlowBlur !== undefined) setVar('--background-radial-glow-blur', b.radialGlowBlur + 'px');
    setVar('--background-radial-glow-color-2', b.radialGlowColor2);
    setVar('--background-radial-glow-opacity-2', b.radialGlowOpacity2);
    setVar('--background-radial-glow-opacity-2-pct', pct(b.radialGlowOpacity2));
    setVar('--background-noise-opacity', b.noiseOpacity);
    setVar('--background-vignette-opacity', b.vignetteOpacity);
    if (b.animationSpeed !== undefined) setVar('--background-animation-speed', b.animationSpeed + 's');
    setVar('--background-animation-intensity', b.animationIntensity);
    setVar('--background-scanline-opacity', b.scanlineOpacity);
    setVar('--background-skyline-opacity', b.skylineOpacity);
    setVar('--background-texture-opacity', b.textureOpacity);

    setVar('--glow-primary', g.primary);
    setVar('--glow-secondary', g.secondary);
    setVar('--glow-intensity', g.intensity);
    setVar('--glow-blur', g.blur);
    setVar('--glow-spread', g.spread);
    if (m.hoverDuration !== undefined) setVar('--duration-fast', m.hoverDuration + 'ms');
    if (m.transitionDuration !== undefined) setVar('--duration-standard', m.transitionDuration + 'ms');
    if (m.complexDuration !== undefined) setVar('--duration-slow', m.complexDuration + 'ms');
    if (m.hoverDuration !== undefined) setVar('--duration-ui', Math.min(Math.max(m.hoverDuration, 100), 160) + 'ms');
    if (m.transitionDuration !== undefined) setVar('--duration-panel', Math.min(Math.max(m.transitionDuration + 80, 220), 320) + 'ms');
    if (m.complexDuration !== undefined) setVar('--duration-cinematic', Math.min(Math.max(m.complexDuration, 360), 520) + 'ms');
    if (m.revealDuration !== undefined) setVar('--motion-reveal-duration', m.revealDuration + 'ms');
    setVar('--ease-enter', m.easingEnter);
    setVar('--ease-exit', m.easingExit);
    setVar('--ease-standard', m.easingState);
    setVar('--ease-productive', m.easingState);
    setVar('--ease-expressive', m.easingEnter);
    setVar('--motion-parallax-intensity', m.parallaxIntensity);
    setVar('--motion-ambient-intensity', m.ambientMotionIntensity);

    setVar('--component-card-bg', comp.cardBackground);
    setVar('--component-card-border', comp.cardBorder);
    setVar('--component-card-hover-bg', comp.cardHoverBackground);
    setVar('--component-button-bg', comp.buttonBackground);
    setVar('--component-button-border', comp.buttonBorder);
    setVar('--component-nav-bg', comp.navBackground);
    if (c.surface && c.bg) setVar('--surface-flat', colorMix(c.surface, c.bg, 0.5));
    if (c.surfaceElevated && c.bg) setVar('--surface-floating', colorMix(c.surfaceElevated, c.bg, 0.78));
    if (c.borderStrong && c.bg) setVar('--panel-border', colorMix(c.borderStrong, c.bg, 0.62));
    if (c.accentSecondary && c.bg) setVar('--focus-ring', '0 0 0 1px ' + c.bg + ', 0 0 0 3px color-mix(in srgb, ' + c.accentSecondary + ' 70%, transparent)');
    if (c.glow) setVar('--hover-glow', '0 0 24px color-mix(in srgb, ' + c.glow + ' 18%, transparent)');
    setVar('--press-scale', 0.985);
    setVar('--status-success', c.success);
    setVar('--status-warning', c.warning);
    setVar('--status-error', c.accentProof);
    setVar('--icon-color', icons.color || c.textSecondary);
    setVar('--icon-muted', icons.muted || c.textMuted);
    setVar('--icon-accent', icons.accent || c.accentSecondary);
    setVar('--icon-success', c.success);
    setVar('--icon-warning', c.warning);
    setVar('--icon-error', c.accentProof);
    setVar('--icon-stroke', icons.strokeWidth ?? 1.8);
    setVar('--icon-hover-glow', '0 0 16px color-mix(in srgb, ' + (icons.accent || c.accentSecondary) + ' 24%, transparent)');
    setVar('--section-icon-optical-offset', 'clamp(6px, 0.85vw, 10px)');
    setVar('--container', layout.maxContentWidth);
    if (layout.panelBlur !== undefined) setVar('--layout-panel-blur', layout.panelBlur + 'px');
    setVar('--header-height', layout.headerHeight);
    setVar('--layout-grid-gap', layout.gridGap);

    if (c.bg && c.bgSecondary) setVar('--admin-bg', colorMix(c.bg, c.bgSecondary, 0.84));
    if (c.surface && c.bg) setVar('--admin-panel', colorMix(c.surface, c.bg, 0.72));
    if (c.surfaceElevated && c.bg) setVar('--admin-panel-strong', colorMix(c.surfaceElevated, c.bg, 0.76));
    if (c.borderStrong && c.bg) setVar('--admin-border', colorMix(c.borderStrong, c.bg, 0.55));
    if (c.border && c.bg) setVar('--admin-border-soft', colorMix(c.border, c.bg, 0.48));
    setVar('--admin-text', c.text);
    if (c.textMuted && c.textSecondary) setVar('--admin-muted', colorMix(c.textMuted, c.textSecondary, 0.62));
    setVar('--admin-accent', c.accentSecondary);
    setVar('--admin-accent-2', c.accent);
    setVar('--admin-proof', c.accentProof);
    if (c.glow) setVar('--admin-glow', 'color-mix(in srgb, ' + c.glow + ' 18%, transparent)');
    setVar('--cr-bg', 'var(--admin-bg)');
    setVar('--cr-bg-2', 'var(--admin-panel)');
    setVar('--cr-bg-3', 'var(--admin-panel-strong)');
    if (c.surfaceElevated && c.accent) setVar('--cr-bg-4', colorMix(c.surfaceElevated, c.accent, 0.82));
    setVar('--cr-text', 'var(--admin-text)');
    setVar('--cr-text-2', c.textSecondary);
    setVar('--cr-text-3', 'var(--admin-muted)');
    setVar('--cr-accent', c.accent);
    setVar('--cr-accent-cyan', c.accentSecondary);
    if (c.accentSecondary) setVar('--cr-accent-glow', 'color-mix(in srgb, ' + c.accentSecondary + ' 10%, transparent)');
    setVar('--cr-border', 'var(--admin-border-soft)');
    setVar('--cr-border-2', 'var(--admin-border)');
    setVar('--cr-border-focus', c.accentSecondary);
    setVar('--cr-success', c.success);
    setVar('--cr-warning', c.warning);
    setVar('--cr-danger', c.accentProof);
    if (c.accentProof) setVar('--cr-danger-bg', 'color-mix(in srgb, ' + c.accentProof + ' 10%, transparent)');
    setVar('--cr-status-success', c.success);
    setVar('--cr-status-warning', c.warning);
    setVar('--cr-status-error', c.accentProof);
    if (c.accentSecondary && c.bg) setVar('--cr-focus-ring', '0 0 0 1px ' + c.bg + ', 0 0 0 3px color-mix(in srgb, ' + c.accentSecondary + ' 58%, transparent)');
    setVar('--cr-font-body', t.bodyFont);
    setVar('--cr-font-mono', t.monoFont);
    setVar('--cr-font-display', t.displayFont);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && c.bg) metaTheme.setAttribute('content', c.bg);
  }

  function fail(reason) {
    window.__ARYAN_THEME_BOOTSTRAP_ERROR__ = reason || SERVER_ERROR || 'Theme bootstrap failed';
    try {
      const cached = snapshotFromCache();
      if (cached && validSnapshot(cached)) {
        applyTheme(cached.activeTheme);
        window.__ARYAN_THEME_BOOTSTRAP__ = cached;
        writeStorage(cached);
        root.dataset.themeReady = 'true';
        root.dataset.themeSource = 'cache-fallback';
        return;
      }
    } catch (e) {
      /* Fallback failed, continue to basic recovery */
    }
    root.dataset.themeReady = 'true';
    root.dataset.themeSource = 'fallback';
  }

  function getNewerSnapshot(server, cache) {
    if (!server && !cache) return null;
    if (!server) return cache;
    if (!cache) return server;
    const serverVer = Number(server.version || 0);
    const cacheVer = Number(cache.version || 0);
    if (cacheVer !== serverVer) {
      return cacheVer > serverVer ? cache : server;
    }
    return server;
  }

  try {
    const serverSnap = validSnapshot(SERVER_SNAPSHOT) ? SERVER_SNAPSHOT : null;
    const cacheSnap = snapshotFromCache();
    const snapshot = getNewerSnapshot(serverSnap, cacheSnap);
    if (!snapshot || !validSnapshot(snapshot)) {
      fail(SERVER_ERROR || 'No valid server or cache theme snapshot was available');
      return;
    }
    applyTheme(snapshot.activeTheme);
    window.__ARYAN_THEME_BOOTSTRAP__ = snapshot;
    writeStorage(snapshot);
    root.dataset.themeReady = 'true';
    root.dataset.themeSource = snapshot.source || 'server';
  } catch (error) {
    fail(error && error.message ? error.message : String(error));
  }
})();`;
}

export async function createThemeBootstrapScript(env = process.env) {
  try {
    const snapshot = await readThemeBootstrapSnapshot(env);
    return buildThemeBootstrapScript(snapshot, snapshot ? '' : 'No theme bootstrap snapshot exists');
  } catch (error) {
    return buildThemeBootstrapScript(null, error instanceof Error ? error.message : String(error));
  }
}

export function themeBootstrapHeaders() {
  return { ...CACHE_HEADERS };
}

function getHeader(headers, name) {
  if (!headers) return '';
  if (typeof headers.get === 'function') return headers.get(name) || '';
  const lower = name.toLowerCase();
  return headers[name] || headers[lower] || '';
}

function parseCookieValue(cookieHeader, name) {
  return String(cookieHeader || '')
    .split(';')
    .map(entry => entry.trim())
    .find(entry => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1) || '';
}

function assertPublishAllowed(headers, env = process.env) {
  const secret = envValue(env, 'THEME_PUBLISH_SECRET');
  if (!secret) {
    if (envValue(env, 'VERCEL_ENV') === 'production') {
      const error = new Error('Theme publish secret is not configured');
      error.status = 503;
      throw error;
    }
    return;
  }

  const auth = getHeader(headers, 'authorization');
  const bearer = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  const headerSecret = getHeader(headers, 'x-theme-publish-secret');
  const cookieSecret = parseCookieValue(getHeader(headers, 'cookie'), 'theme_publish_secret');
  const provided = headerSecret || bearer || cookieSecret;

  if (provided !== secret) {
    const error = new Error('Unauthorized theme publish request');
    error.status = 401;
    throw error;
  }
}



export function createSnapshotForPublish(state, activeTheme) {
  const updatedState = {
    ...(isObject(state) ? state : {}),
    activeThemeId: activeTheme?.id,
    updatedAt: nowIso(),
    version: Number(state?.version ?? 0) || 1,
  };
  return createSnapshot({
    state: updatedState,
    activeTheme,
    source: 'server',
    siteConfig: isObject(updatedState.siteConfig) ? updatedState.siteConfig : null,
  });
}

export async function publishThemeSnapshot(payload, headers, env = process.env) {
  assertPublishAllowed(headers, env);
  const body = typeof payload === 'string' ? JSON.parse(payload || '{}') : payload;
  const state = body?.state;
  const activeTheme = body?.activeTheme;
  const snapshot = createSnapshotForPublish(state, activeTheme);

  await setRedisValue('portfolioConfig:main', stripUndefined(snapshot.remoteState), env);
  await setRedisValue('portfolioBootstrap:main', stripUndefined(snapshot), env);

  return snapshot;
}

export function jsonPayload(status, body) {
  return {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

export async function handleThemePublish(payload, headers, env = process.env) {
  try {
    const snapshot = await publishThemeSnapshot(payload, headers, env);
    return jsonPayload(200, { ok: true, snapshot, state: snapshot.remoteState });
  } catch (error) {
    const status = typeof error?.status === 'number' ? error.status : 500;
    return jsonPayload(status, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
