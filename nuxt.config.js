import path from 'path';
import fs from 'fs';
import bootstrap from './.nest/nest.js';

const isDev = process.env.NODE_ENV === 'development';
const isLocal = process.env.LOCAL === 'true';

const config = async () => ({
  srcDir: 'client/',

  loading: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Доодлер',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Сайт за игри с думи'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  server:
    isLocal && !isDev
      ? {
          https: {
            key: fs.readFileSync(
              path.resolve(__dirname, './client/ssl/key.pem')
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, './client/ssl/cert.pem')
            )
          }
        }
      : {},

  // serverMiddleware: isDev
  //   ? []
  //   : isLocal
  //   ? [{ path: '/api', handler: await bootstrap() }]
  //   : ['redirect-ssl', { path: '/api', handler: await bootstrap() }],

  serverMiddleware: isDev
    ? []
    : ['redirect-ssl', { path: '/api', handler: await bootstrap() }],

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/firebase', 'bootstrap-vue/nuxt', '@nuxtjs/axios'],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: isDev,
    baseUrl: isLocal
      ? 'http://localhost:3000'
      : 'https://woordler.herokuapp.com'
  },
  proxy: {
    '/api/': {
      target: 'http://localhost:4000/'
    }
  },
  firebase: {
    config: {
      apiKey: process.env.FB_API_KEY,
      authDomain: process.env.FB_AUTH_DOMAIN,
      projectId: process.env.FB_PROJECT_ID,
      storageBucket: process.env.FB_STORAGE_BUCKET,
      messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
      appId: process.env.FB_APP_ID,
      measurementId: process.env.FB_MEASUREMENT_ID
    },
    services: {
      auth: true,
      firestore: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
});

export default config;
