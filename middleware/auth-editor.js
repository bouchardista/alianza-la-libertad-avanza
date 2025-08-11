export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth()
  
  // Si no hay usuario, intentar verificar autenticación
  if (!user.value) {
    const currentUser = await checkAuth()
    
    if (!currentUser) {
      return navigateTo('/login')
    }
  }
  
  // Solo editores y admins pueden acceder
  if (user.value && user.value.role !== 'editor' && user.value.role !== 'admin') {
    return navigateTo('/login')
  }
})
