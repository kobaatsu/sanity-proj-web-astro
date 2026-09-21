// @ts-check

import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'astro/config'
import {loadEnv} from 'vite'

import sanity from '@sanity/astro'

const {PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET} = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
)

// GitHub Pages (Project Pages) はサブパス配信になるため、CI上のビルドでのみ base を付与する。
// ローカルの dev/build/preview は従来通りルート ("/") のままにし、開発体験に影響を与えない。
const isCI = process.env.CI === 'true'

// https://astro.build/config
export default defineConfig({
  site: 'https://kobaatsu.github.io',
  ...(isCI && {base: '/sanity-proj-web-astro'}),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false, // False for static builds
    }),
  ],
})
