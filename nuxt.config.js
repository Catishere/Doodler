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
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

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
      apiKey: 'AIzaSyCaawUSZ7dAHXoElVyuWPDLDATSuHN_JTU',
      authDomain: 'woordler.firebaseapp.com',
      projectId: 'woordler',
      storageBucket: 'woordler.appspot.com',
      messagingSenderId: '1023294061740',
      appId: '1:1023294061740:web:8ea5f3e005c50fde29f309',
      measurementId: 'G-MX85MV6MYP'
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
