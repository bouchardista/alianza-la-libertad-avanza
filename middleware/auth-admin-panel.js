export default defineNuxtRouteMiddleware(async (to) => {
  const { $supabase } = useNuxtApp()
  
  // Verificar si el usuario está autenticado
  const { data: { user } } = await $supabase.auth.getUser()
  
  if (!user) {
    // Si no está autenticado, redirigir al login administrativo
    return navigateTo('/admin/secure-login')
  }
  
  // Verificar que tenga rol de admin
  const { data: profile } = await $supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    // Si no es admin, redirigir al login administrativo
    return navigateTo('/admin/secure-login')
  }
})
