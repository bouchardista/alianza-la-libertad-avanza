export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const config = useRuntimeConfig()
  
  try {
    // Por ahora mantenemos la simulación mientras configuramos Supabase
    // Aquí iría la lógica real con Supabase Auth
    if (email === 'admin@alianza.com' && password === 'admin123') {
      return {
        user: {
          id: '1',
          email: 'admin@alianza.com',
          role: 'admin',
          name: 'Administrador'
        }
      }
    } else if (email === 'editor@alianza.com' && password === 'editor123') {
      return {
        user: {
          id: '2',
          email: 'editor@alianza.com',
          role: 'editor',
          name: 'Editor'
        }
      }
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales incorrectas'
      })
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error en el servidor de autenticación'
    })
  }
})
