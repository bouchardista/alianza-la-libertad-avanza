export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Por ahora simulamos la autenticación
  // Aquí iría la lógica real con Supabase
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
})
