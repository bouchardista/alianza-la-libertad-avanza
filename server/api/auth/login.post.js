export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const config = useRuntimeConfig()

  try {
    console.log('🔍 Intentando autenticación para:', email)
    console.log('🔑 Supabase URL:', config.public.supabaseUrl ? '✅ Configurado' : '❌ No configurado')
    console.log('🔑 Supabase Key:', config.public.supabaseKey ? '✅ Configurado' : '❌ No configurado')

    // Crear cliente de Supabase para el servidor
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
    
    // Intentar autenticación con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    console.log('📊 Respuesta de Supabase:', { data, error })
    
    if (error) {
      console.error('❌ Error de autenticación:', error)
      throw createError({
        statusCode: 401,
        statusMessage: error.message
      })
    }
    
    if (!data || !data.user) {
      console.error('❌ No se recibió usuario en la respuesta')
      throw createError({
        statusCode: 500,
        statusMessage: 'Respuesta inválida del servidor de autenticación'
      })
    }
    
    console.log('✅ Usuario autenticado:', data.user.id)
    
    // Obtener información adicional del usuario desde la tabla de perfiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', data.user.id)
      .single()
    
    console.log('📋 Perfil obtenido:', { profile, profileError })
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('⚠️ Error al obtener perfil:', profileError)
    }
    
    const userData = {
      id: data.user.id,
      email: data.user.email,
      role: profile?.role || 'editor',
      name: profile?.name || 'Usuario'
    }
    
    console.log('🎉 Usuario final:', userData)
    
    return {
      user: userData
    }
  } catch (error) {
    console.error('💥 Error general en login:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error en el servidor de autenticación'
    })
  }
})
