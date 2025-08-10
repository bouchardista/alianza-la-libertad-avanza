export const useAuth = () => {
  const user = useState('user', () => null)
  const loading = useState('auth-loading', () => false)

  const signIn = async (email, password) => {
    loading.value = true
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      console.log('🔍 Respuesta del servidor:', response)
      
      if (response && response.user) {
        user.value = response.user
        return { success: true, user: response.user }
      } else {
        console.error('❌ Respuesta inválida del servidor:', response)
        return { success: false, error: 'Respuesta inválida del servidor' }
      }
    } catch (error) {
      console.error('❌ Error en signIn:', error)
      return { success: false, error: error.message || 'Error al iniciar sesión' }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      const response = await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      return { success: true }
    } catch (error) {
      console.error('❌ Error en signOut:', error)
      return { success: false, error: error.message }
    }
  }

  const checkAuth = async () => {
    try {
      const response = await $fetch('/api/auth/user')
      if (response && response.user) {
        user.value = response.user
        return response.user
      } else {
        user.value = null
        return null
      }
    } catch (error) {
      console.error('❌ Error en checkAuth:', error)
      user.value = null
      return null
    }
  }

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user.value?.role === role
  }

  // Función para verificar si el usuario es admin
  const isAdmin = () => {
    return hasRole('admin')
  }

  // Función para verificar si el usuario es editor
  const isEditor = () => {
    return hasRole('editor') || hasRole('admin')
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    signIn,
    signOut,
    checkAuth,
    hasRole,
    isAdmin,
    isEditor
  }
}
