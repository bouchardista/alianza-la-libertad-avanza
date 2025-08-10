export const useAuth = () => {
  const user = useState('user', () => null)
  const loading = useState('auth-loading', () => false)

  const signIn = async (email, password) => {
    loading.value = true
    try {
      const { data, error } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      if (error) throw error
      
      user.value = data.user
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const checkAuth = async () => {
    try {
      const { data } = await $fetch('/api/auth/user')
      user.value = data.user
      return data.user
    } catch (error) {
      user.value = null
      return null
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    signIn,
    signOut,
    checkAuth
  }
}
