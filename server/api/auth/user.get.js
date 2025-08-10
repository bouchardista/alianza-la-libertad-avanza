export default defineEventHandler(async (event) => {
  // Por ahora simulamos obtener el usuario
  // Aquí iría la lógica real con Supabase
  const token = getHeader(event, 'authorization')
  
  if (!token) {
    return {
      user: null
    }
  }

  // Simulamos un usuario autenticado
  return {
    user: {
      id: '1',
      email: 'admin@alianza.com',
      role: 'admin',
      name: 'Administrador'
    }
  }
})
