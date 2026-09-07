import fs from 'fs'
import path from 'path'
import purgecss from '@fullhuman/postcss-purgecss'
import siteConfig from './config/_siteConfig'

const contentDir = path.join(__dirname, 'content')

function slugsIn(sub: string) {
  const dir = path.join(contentDir, sub)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

const prerenderRoutes = [
  ...slugsIn('posts').map((slug) => `/${slug}`),
  ...slugsIn('categories').map((slug) => `/categories/${slug}`)
]

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  ssr: true,

  runtimeConfig: {
    public: {
      // Netlify sets these at build time; DEPLOY_PRIME_URL is the
      // per-deploy URL (correct for branch/PR previews), URL is the
      // canonical production URL. Falls back to the request origin
      // (e.g. localhost) outside Netlify.
      siteUrl: process.env.DEPLOY_PRIME_URL || process.env.URL || '',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: process.env.npm_package_name || '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || ''
        }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [
        {
          src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
          defer: true,
          id: 'netlify-identity-widget-script'
        }
      ]
    }
  },

  css: ['~/assets/scss/styles.scss'],

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    'nuxt-gtag',
    '@nuxt/eslint'
  ],

  image: {
    // The netlify provider's /.netlify/images resizing endpoint only
    // exists on Netlify's actual infrastructure (NETLIFY=true is set
    // there). Locally, fall back to the built-in ipx provider so dev
    // images actually resolve instead of 404ing.
    provider: process.env.NETLIFY ? 'netlify' : 'ipx'
  },

  gtag: {
    enabled: Boolean(siteConfig.googleAnalytics.on && siteConfig.googleAnalytics.id),
    id: siteConfig.googleAnalytics.id
  },

  components: [{ path: '~/components', pathPrefix: false }],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/_vars.scss";'
        }
      },
      postcss:
        process.env.NODE_ENV === 'production'
          ? {
              plugins: [
                purgecss({
                  content: [
                    './pages/**/*.vue',
                    './layouts/**/*.vue',
                    './components/**/*.vue'
                  ],
                  css: ['./assets/scss/styles.scss'],
                  safelist: {
                    standard: [
                      'html',
                      'body',
                      'is-1by1',
                      'is-5by4',
                      'is-4by3',
                      'is-3by2',
                      'is-5by3',
                      'is-16by9',
                      'is-2by1',
                      'is-3by1',
                      'is-4by5',
                      'is-3by4',
                      'is-2by3',
                      'is-3by5',
                      'is-9by16',
                      'nuxt__build_indicator',
                      '__nuxt',
                      'svg',
                      'table',
                      'td',
                      'th',
                      'tr',
                      'tbody',
                      'thead',
                      'tfoot'
                    ],
                    deep: [/theme/, /spinner-position/, /fa/, /table/]
                  }
                })
              ]
            }
          : undefined
    }
  },

  nitro: {
    output: {
      publicDir: path.join(__dirname, 'dist')
    },
    prerender: {
      concurrency: 1,
      routes: prerenderRoutes
    }
  }
})
