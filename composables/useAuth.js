export const useAuth = () => {
  const user = useState('user', () => null)
  const loading = useState('auth-loading', () => false)

  const getSupabase = () => {
    try {
      const { $supabase } = useNuxtApp()
      if (!$supabase) {
        return null
      }
      return $supabase.client
    } catch (error) {
      return null
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      if (!data || !data.user) {
        return { success: false, error: 'Respuesta inválida del servidor de autenticación' }
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', data.user.id)
        .single()
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'editor',
        name: profile?.name || 'Usuario'
      }
      
      user.value = userData
      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: error.message || 'Error al iniciar sesión' }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      user.value = null
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const checkAuth = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return null
      }
      
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        user.value = null
        return null
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', user.id)
        .single()
      
      const userData = {
        id: user.id,
        email: user.email,
        role: profile?.role || 'editor',
        name: profile?.name || 'Usuario'
      }
      
      user.value = userData
      return userData
    } catch (error) {
      user.value = null
      return null
    }
  }

  const hasRole = (role) => {
    return user.value?.role === role
  }

  const isAdmin = () => {
    return hasRole('admin')
  }

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
