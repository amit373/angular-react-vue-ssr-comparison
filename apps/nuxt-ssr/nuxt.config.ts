// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css', '../../packages/ui/styles/index.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://jsonplaceholder.typicode.com',
        },
        {
          rel: 'dns-prefetch',
          href: 'https://jsonplaceholder.typicode.com',
        },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
    preset: 'node-server',
    routeRules: {
      '/**': {
        headers: {
          'Cache-Control': 'public, max-age=3600',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      },
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
    },
  },
  experimental: {
    payloadExtraction: false,
  },
});
