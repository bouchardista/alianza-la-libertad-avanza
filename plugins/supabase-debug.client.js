export default defineNuxtPlugin(() => {
  console.log('🔧 Plugin de Supabase debug cargándose...')
  
  const { $supabase } = useNuxtApp()
  console.log('📊 Cliente de Supabase disponible:', !!$supabase)
  console.log('🔍 Tipo de $supabase:', typeof $supabase)
  console.log('🔍 $supabase completo:', $supabase)
  
  if ($supabase) {
    console.log('✅ Cliente de Supabase inicializado correctamente')
    console.log('🔍 Métodos disponibles:', Object.keys($supabase))
    
    // Verificar la estructura correcta
    if ($supabase.client) {
      console.log('🔍 Client disponible:', !!$supabase.client)
      console.log('🔍 Auth disponible:', !!$supabase.client.auth)
      if ($supabase.client.auth) {
        console.log('🔍 Métodos de auth:', Object.keys($supabase.client.auth))
      }
    } else {
      console.log('🔍 Auth disponible:', !!$supabase.auth)
      if ($supabase.auth) {
        console.log('🔍 Métodos de auth:', Object.keys($supabase.auth))
      }
    }
  } else {
    console.error('❌ Cliente de Supabase no disponible en el plugin')
  }
})
