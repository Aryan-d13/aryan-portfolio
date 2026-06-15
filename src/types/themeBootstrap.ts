import type { RemoteThemeState } from '../services/themeService';
import type { ThemeDefinition } from '../themes/themeTypes';
import type { SiteConfig } from './siteConfig';

export type ThemeBootstrapSource = 'server' | 'cache' | 'legacy';

export interface ThemeBootstrapSnapshot {
  version: number;
  updatedAt: string;
  activeThemeId: string;
  activeTheme: ThemeDefinition;
  customThemes: ThemeDefinition[];
  siteConfig: SiteConfig | null;
  source: ThemeBootstrapSource;
  portraitSrc?: string;
  remoteState: RemoteThemeState;
}
