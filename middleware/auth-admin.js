export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth()
  
  // Si no hay usuario, intentar verificar autenticación
  if (!user.value) {
    const currentUser = await checkAuth()
    
    if (!currentUser) {
      return navigateTo('/login')
    }
  }
  
  // Si el usuario no es admin, redirigir al editor
  if (user.value && user.value.role !== 'admin') {
    return navigateTo('/editor')
  }
})
