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
    // Variables privadas del servidor
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    googleDriveServiceAccountJson: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON,
    googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '1f4rDQskrOA94xGiT2R-bTsqVLtjq_5df',
    
    // Variables públicas (disponibles en el cliente)
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
