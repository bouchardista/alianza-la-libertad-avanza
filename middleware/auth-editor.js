export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  // Si no hay usuario, redirigir al login
  if (!user.value) {
    return navigateTo('/login')
  }
  
  // Solo editores y admins pueden acceder
  if (user.value.role !== 'editor' && user.value.role !== 'admin') {
    return navigateTo('/login')
  }
})
