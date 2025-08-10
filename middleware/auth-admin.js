export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth()
  
  console.log('🔒 Middleware auth-admin ejecutándose...')
  console.log('👤 Usuario actual:', user.value)
  
  // Si no hay usuario, intentar verificar autenticación
  if (!user.value) {
    console.log('🔄 No hay usuario, verificando autenticación...')
    const currentUser = await checkAuth()
    console.log('👤 Usuario verificado:', currentUser)
    
    if (!currentUser) {
      console.log('❌ No hay usuario autenticado, redirigiendo a login')
      return navigateTo('/login')
    }
  }
  
  // Si el usuario no es admin, redirigir al editor
  if (user.value && user.value.role !== 'admin') {
    console.log('⚠️ Usuario no es admin, redirigiendo a editor')
    return navigateTo('/editor')
  }
  
  console.log('✅ Usuario autorizado para admin')
})
