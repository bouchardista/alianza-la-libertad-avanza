export default defineNuxtPlugin(() => {
  console.log('🔧 Plugin de Supabase debug cargándose...')
  
  const { $supabase } = useNuxtApp()
  console.log('📊 Cliente de Supabase disponible:', !!$supabase)
  
  if ($supabase) {
    console.log('✅ Cliente de Supabase inicializado correctamente')
  } else {
    console.error('❌ Cliente de Supabase no disponible en el plugin')
  }
})
