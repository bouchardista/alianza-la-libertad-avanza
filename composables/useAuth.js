export const useAuth = () => {
  const user = useState('user', () => null)
  const loading = useState('auth-loading', () => false)

  const getSupabase = () => {
    try {
      console.log('🔍 Intentando obtener cliente de Supabase...')
      const { $supabase } = useNuxtApp()
      console.log('🔍 $supabase obtenido:', !!$supabase)
      console.log('🔍 Tipo de $supabase:', typeof $supabase)
      
      if (!$supabase) {
        console.error('❌ Cliente de Supabase no disponible')
        return null
      }
      
      console.log('🔍 Auth disponible:', !!$supabase.auth)
      if ($supabase.auth) {
        console.log('🔍 Métodos de auth:', Object.keys($supabase.auth))
      }
      
      return $supabase
    } catch (error) {
      console.error('❌ Error obteniendo cliente de Supabase:', error)
      return null
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    try {
      console.log('🚀 Iniciando login con Supabase...')
      
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      console.log('📊 Respuesta de Supabase:', { data, error })
      
      if (error) {
        console.error('❌ Error de autenticación:', error)
        return { success: false, error: error.message }
      }
      
      if (!data || !data.user) {
        console.error('❌ No se recibió usuario en la respuesta')
        return { success: false, error: 'Respuesta inválida del servidor de autenticación' }
      }
      
      console.log('✅ Usuario autenticado:', data.user.id)
      
      // Obtener información adicional del perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', data.user.id)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('⚠️ Error al obtener perfil:', profileError)
      }
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'editor',
        name: profile?.name || 'Usuario'
      }
      
      user.value = userData
      console.log('🎉 Usuario final:', userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Error en signIn:', error)
      return { success: false, error: error.message || 'Error al iniciar sesión' }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión...')
      
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Error al cerrar sesión:', error)
        return { success: false, error: error.message }
      }
      
      user.value = null
      console.log('✅ Sesión cerrada exitosamente')
      return { success: true }
    } catch (error) {
      console.error('❌ Error en signOut:', error)
      return { success: false, error: error.message }
    }
  }

  const checkAuth = async () => {
    try {
      console.log('🔍 Verificando autenticación...')
      
      const supabase = getSupabase()
      if (!supabase) {
        console.log('❌ Cliente de Supabase no disponible')
        return null
      }
      
      const { data: { user }, error } = await supabase.auth.getUser()
      
      console.log('📊 Respuesta de Supabase auth:', { user, error })
      
      if (error || !user) {
        user.value = null
        console.log('❌ No hay usuario autenticado')
        return null
      }
      
      // Obtener información adicional del perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', user.id)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error al obtener perfil:', profileError)
      }
      
      const userData = {
        id: user.id,
        email: user.email,
        role: profile?.role || 'editor',
        name: profile?.name || 'Usuario'
      }
      
      user.value = userData
      console.log('✅ Usuario verificado:', userData)
      return userData
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
