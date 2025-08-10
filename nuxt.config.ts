export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', 'nuxt-icon', '@nuxtjs/supabase'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
      ]
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    }
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  content: {
    highlight: {
      theme: 'github-dark'
    }
  }
})
