export default defineEventHandler(async (event) => {
  try {
    // Usar el cliente de Supabase del módulo
    const { supabase } = event.context
    
    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
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
    console.error('Error al cerrar sesión:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al cerrar sesión'
    })
  }
})
