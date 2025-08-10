export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, content, type, category, firmante, date } = body

  try {
    // Por ahora simulamos la creación
    // Aquí iría la lógica real con Supabase
    const newPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      type,
      category,
      firmante: firmante || 'Alianza La Libertad Avanza',
      date: date || new Date().toISOString().split('T')[0],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Aquí guardaríamos en Supabase
    // const { data, error } = await supabase
    //   .from('posts')
    //   .insert([newPost])
    //   .select()

    return newPost
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al crear la publicación'
    })
  }
})
