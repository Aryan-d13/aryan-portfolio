import type { SiteConfig } from '../types/siteConfig';

export function validateConfig(config: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const c = config as Record<string, unknown>;

  if (!c || typeof c !== 'object') return { valid: false, errors: ['Config must be an object'] };

  const identity = c.identity as Record<string, unknown> | undefined;
  if (identity) {
    if (typeof identity.name !== 'string' || !identity.name.trim()) errors.push('identity.name is required');
    if (identity.email && typeof identity.email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email)) errors.push('identity.email must be valid');
    if (identity.roleLines && !Array.isArray(identity.roleLines)) errors.push('identity.roleLines must be an array');
  } else { errors.push('identity section is required'); }

  if (c.sections) {
    if (!Array.isArray(c.sections)) { errors.push('sections must be an array'); }
    else {
      const ids = new Set<string>();
      (c.sections as Array<Record<string, unknown>>).forEach((s, i) => {
        if (!s.id) errors.push(`sections[${i}].id is required`);
        if (ids.has(s.id as string)) errors.push(`Duplicate section id: ${s.id}`);
        ids.add(s.id as string);
      });
    }
  }

  if (c.projects) {
    if (!Array.isArray(c.projects)) { errors.push('projects must be an array'); }
    else {
      (c.projects as Array<Record<string, unknown>>).forEach((p, i) => {
        if (!p.name || !(p.name as string).trim()) errors.push(`projects[${i}].name is required`);
        if (!p.id || !(p.id as string).trim()) errors.push(`projects[${i}].id is required`);
      });
    }
  }

  const colors = c.colors as Record<string, string> | undefined;
  if (colors) {
    Object.entries(colors).forEach(([key, val]) => {
      if (val && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val) && val !== '') {
        errors.push(`colors.${key} must be a valid hex color (got: ${val})`);
      }
    });
  }

  const typo = c.typography as Record<string, unknown> | undefined;
  if (typo) {
    if (typo.lineHeight !== undefined && (typeof typo.lineHeight !== 'number' || typo.lineHeight < 0.5 || typo.lineHeight > 4))
      errors.push('typography.lineHeight must be between 0.5 and 4');
    if (typo.headingWeight !== undefined && (typeof typo.headingWeight !== 'number' || typo.headingWeight < 100 || typo.headingWeight > 900))
      errors.push('typography.headingWeight must be between 100 and 900');
  }

  const seo = c.seo as Record<string, unknown> | undefined;
  if (seo && (!seo.pageTitle || !(seo.pageTitle as string).trim())) errors.push('seo.pageTitle is required');

  const portrait = c.portrait as Record<string, unknown> | undefined;
  if (portrait) {
    if (typeof portrait.enabled !== 'boolean') errors.push('portrait.enabled must be a boolean');
    if (typeof portrait.src !== 'string' || !portrait.src.trim()) errors.push('portrait.src is required');
    if (typeof portrait.alt !== 'string') errors.push('portrait.alt must be a string');
    if (portrait.metadata && !Array.isArray(portrait.metadata)) errors.push('portrait.metadata must be an array');
  } else {
    errors.push('portrait section is required');
  }

  const loader = c.loader as Record<string, unknown> | undefined;
  if (loader) {
    if (typeof loader.enabled !== 'boolean') errors.push('loader.enabled must be a boolean');
    if (typeof loader.minimumDuration !== 'number') errors.push('loader.minimumDuration must be a number');
    if (typeof loader.maxWaitTime !== 'number') errors.push('loader.maxWaitTime must be a number');
    if (loader.style !== 'trace-boot' && loader.style !== 'minimal' && loader.style !== 'console') {
      errors.push("loader.style must be 'trace-boot', 'minimal', or 'console'");
    }
    if (typeof loader.statusVisible !== 'boolean') errors.push('loader.statusVisible must be a boolean');
    if (typeof loader.traceVisible !== 'boolean') errors.push('loader.traceVisible must be a boolean');
    if (typeof loader.themeAware !== 'boolean') errors.push('loader.themeAware must be a boolean');
  }

  return { valid: errors.length === 0, errors };
}

export function validateJsonConfig(jsonString: string): { valid: boolean; errors: string[]; parsed: SiteConfig | null } {
  let parsed: SiteConfig | null = null;
  try { parsed = JSON.parse(jsonString); } catch (e) {
    return { valid: false, errors: [`Invalid JSON: ${(e as Error).message}`], parsed: null };
  }
  const result = validateConfig(parsed);
  return { ...result, parsed };
}

export function mergeConfig<T extends Record<string, unknown>>(base: T, partial: Partial<T>): T {
  const result = JSON.parse(JSON.stringify(base)) as T;
  for (const key of Object.keys(partial) as Array<keyof T>) {
    const pv = partial[key];
    const rv = result[key];
    if (pv !== null && typeof pv === 'object' && !Array.isArray(pv) && rv && typeof rv === 'object' && !Array.isArray(rv)) {
      (result as Record<string, unknown>)[key as string] = mergeConfig(rv as Record<string, unknown>, pv as Record<string, unknown>);
    } else {
      (result as Record<string, unknown>)[key as string] = JSON.parse(JSON.stringify(pv));
    }
  }
  return result;
}
