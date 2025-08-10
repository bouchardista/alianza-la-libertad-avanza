export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  try {
    // Usar el cliente de Supabase del módulo
    const { supabase } = event.context
    
    // Intentar autenticación con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw createError({
        statusCode: 401,
        statusMessage: error.message
      })
    }
    
    // Obtener información adicional del usuario desde la tabla de perfiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', data.user.id)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error al obtener perfil:', profileError)
    }
    
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'editor',
        name: profile?.name || 'Usuario'
      }
    }
  } catch (error) {
    console.error('Error de autenticación:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error en el servidor de autenticación'
    })
  }
})
