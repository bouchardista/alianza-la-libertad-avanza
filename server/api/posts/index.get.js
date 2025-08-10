export default defineEventHandler(async (event) => {
  try {
    // Por ahora usamos @nuxt/content mientras migramos a Supabase
    const posts = await queryContent('/posts').sort({ date: -1 }).find()
    
    return posts.map(post => ({
      id: post._path,
      title: post.title,
      content: post.body,
      type: post.type,
      category: post.category,
      firmante: post.firmante,
      date: post.date,
      status: 'published',
      created_at: post._file?.created_at || new Date().toISOString(),
      updated_at: post._file?.updated_at || new Date().toISOString()
    }))
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener las publicaciones'
    })
  }
})
