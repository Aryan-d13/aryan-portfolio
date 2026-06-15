/// <reference types="vite/client" />

import type { ThemeBootstrapSnapshot } from './types/themeBootstrap';

declare global {
  interface Window {
    __ARYAN_THEME_BOOTSTRAP__?: ThemeBootstrapSnapshot;
    __ARYAN_THEME_BOOTSTRAP_ERROR__?: string;
  }
}

export {};
