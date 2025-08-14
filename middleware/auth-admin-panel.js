export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const client = useSupabaseClient()
    
    // Verificar si el usuario está autenticado
    const { data: { user }, error: authError } = await client.auth.getUser()
    
    if (authError || !user) {
      console.log('Usuario no autenticado, redirigiendo a login administrativo')
      return navigateTo('/admin/secure-login')
    }
    
    // Verificar que tenga rol de admin
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile || profile.role !== 'admin') {
      console.log('Usuario no es admin, redirigiendo a login administrativo')
      return navigateTo('/admin/secure-login')
    }
    
    console.log('Usuario autenticado y es admin, permitiendo acceso')
    
  } catch (error) {
    console.error('Error en middleware auth-admin-panel:', error)
    return navigateTo('/admin/secure-login')
  }
})
