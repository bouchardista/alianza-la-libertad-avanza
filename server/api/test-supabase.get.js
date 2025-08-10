export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  return {
    supabaseUrl: config.public.supabaseUrl ? '✅ Configurado' : '❌ No configurado',
    supabaseKey: config.public.supabaseKey ? '✅ Configurado' : '❌ No configurado',
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Presente' : '❌ Faltante',
      SUPABASE_KEY: process.env.SUPABASE_KEY ? '✅ Presente' : '❌ Faltante'
    }
  }
})
