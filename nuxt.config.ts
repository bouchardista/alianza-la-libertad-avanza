export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', 'nuxt-icon', '@nuxtjs/supabase'],
  css: ['~/assets/css/global.css'],
  vite: {
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp']
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/icon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap' }
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
    supabaseKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    googleDriveServiceAccountJson: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON,
    googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '1f4rDQskrOA94xGiT2R-bTsqVLtjq_5df',
    
    // Variables públicas (disponibles en el cliente)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY
    }
  },
  content: {
    highlight: {
      theme: 'github-dark'
    }
  }
})
