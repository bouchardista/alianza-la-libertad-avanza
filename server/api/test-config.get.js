export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  return {
    public: {
      supabaseUrl: config.public.supabaseUrl ? 'DEFINIDO' : 'NO DEFINIDO',
      supabaseKey: config.public.supabaseKey ? 'DEFINIDO' : 'NO DEFINIDO'
    },
    private: {
      supabaseUrl: config.supabaseUrl ? 'DEFINIDO' : 'NO DEFINIDO',
      supabaseKey: config.supabaseKey ? 'DEFINIDO' : 'NO DEFINIDO',
      supabaseServiceRoleKey: config.supabaseServiceRoleKey ? 'DEFINIDO' : 'NO DEFINIDO'
    },
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'DEFINIDO' : 'NO DEFINIDO',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'DEFINIDO' : 'NO DEFINIDO',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'DEFINIDO' : 'NO DEFINIDO'
    }
  }
})
