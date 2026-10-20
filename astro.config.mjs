// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://nico.collin.app',
  fonts: [
    {
      name: 'IBM Plex Sans',
      cssVariable: '--nc-font-plex-sans',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
    {
      name: 'IBM Plex Mono',
      cssVariable: '--nc-font-plex-mono',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
    {
      name: 'Archivo',
      cssVariable: '--nc-font-archivo',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
    {
      name: 'Archivo Black',
      cssVariable: '--nc-font-archivo-black',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
  ],
});
