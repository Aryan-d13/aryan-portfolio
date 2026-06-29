import type { ThemeDefinition } from './themeTypes';
import { blueHourCinema } from './themes/blueHourCinema';
import { cosmicDebug } from './themes/cosmicDebug';
import { editorialCybernetic } from './themes/editorialCybernetic';
import { nocturnalSignal } from './themes/nocturnalSignal';
import { noirOperatingSystem } from './themes/noirOperatingSystem';
import { obsidianLab } from './themes/obsidianLab';
import { proofArchive } from './themes/proofArchive';
import { quantumRain } from './themes/quantumRain';
import { skylineTerminal } from './themes/skylineTerminal';
import { softTraceLuxury } from './themes/softTraceLuxury';

export const DEFAULT_THEME_ID = 'proof-archive';

export const builtInThemes: ThemeDefinition[] = Object.freeze([
  nocturnalSignal,
  softTraceLuxury,
  quantumRain,
  noirOperatingSystem,
  skylineTerminal,
  editorialCybernetic,
  obsidianLab,
  blueHourCinema,
  proofArchive,
  cosmicDebug,
]) as ThemeDefinition[];

export const builtInThemeIds = new Set(builtInThemes.map(theme => theme.id));

export function getBuiltInTheme(id: string): ThemeDefinition | undefined {
  return builtInThemes.find(theme => theme.id === id);
}

export function getDefaultTheme(): ThemeDefinition {
  return getBuiltInTheme(DEFAULT_THEME_ID) ?? builtInThemes[0];
}

export function cloneTheme(theme: ThemeDefinition): ThemeDefinition {
  return JSON.parse(JSON.stringify(theme)) as ThemeDefinition;
}

export function getThemeById(id: string, customThemes: ThemeDefinition[] = []): ThemeDefinition | undefined {
  return customThemes.find(theme => theme.id === id) ?? getBuiltInTheme(id);
}

