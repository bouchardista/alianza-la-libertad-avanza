export default defineEventHandler(async (event) => {
  // Por ahora simulamos el logout
  // Aquí iría la lógica real con Supabase
  return {
    success: true,
    message: 'Sesión cerrada exitosamente'
  }
})
