export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')
  
  if (!token) {
    return {
      user: null
    }
  }

  try {
    // Usar el cliente de Supabase del módulo
    const { supabase } = event.context
    
    // Obtener usuario actual
    const { data: { user }, error } = await supabase.auth.getUser(token.replace('Bearer ', ''))
    
    if (error || !user) {
      return {
        user: null
      }
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
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: profile?.role || 'editor',
        name: profile?.name || 'Usuario'
      }
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return {
      user: null
    }
  }
})
