export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    // Crear cliente de Supabase para el servidor
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
    
    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error al cerrar sesión:', error)
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    }
  } catch (error) {
    console.error('Error general en logout:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al cerrar sesión'
    })
  }
})
