export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  // Si no hay usuario, redirigir al login
  if (!user.value) {
    return navigateTo('/login')
  }
  
  // Si el usuario no es admin, redirigir al editor
  if (user.value.role !== 'admin') {
    return navigateTo('/editor')
  }
})
