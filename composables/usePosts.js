export const usePosts = () => {
  const loading = useState('posts-loading', () => false)

  const getSupabase = () => {
    try {
      const { $supabase } = useNuxtApp()
      return $supabase?.client || null
    } catch (error) {
      return null
    }
  }

  const createPost = async (postData) => {
    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' }
      }

      const newPost = {
        title: postData.title,
        content: postData.content,
        type: postData.type || 'comunicado',
        category: postData.category || 'general',
        firmante: postData.firmante || 'Alianza La Libertad Avanza',
        date: postData.date || new Date().toISOString().split('T')[0],
        status: 'published',
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, post: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al crear la publicación' }
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (postId, postData) => {
    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' }
      }

      const updateData = {
        title: postData.title,
        content: postData.content,
        type: postData.type,
        category: postData.category,
        firmante: postData.firmante,
        date: postData.date,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, post: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al actualizar la publicación' }
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (postId) => {
    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' }
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Error al eliminar la publicación' }
    } finally {
      loading.value = false
    }
  }

  const getPosts = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Obtener el rol del usuario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const userRole = profile?.role || 'editor'

      let query = supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false })

      // Si es admin, ver todos los posts (publicados y borradores)
      if (userRole === 'admin') {
        // No filtrar por status
      } else {
        // Si es editor, ver solo sus propios posts (publicados y borradores)
        query = query.eq('author_id', user.id)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, posts: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al obtener las publicaciones' }
    }
  }

  const getPublicPosts = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, posts: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al obtener las publicaciones' }
    }
  }

  const getPost = async (postId) => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, post: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al obtener la publicación' }
    }
  }

  const publishDraft = async (postId) => {
    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' }
      }

      // Verificar que sea admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return { success: false, error: 'Solo los administradores pueden publicar borradores' }
      }

      const { data, error } = await supabase
        .from('posts')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', postId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, post: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al publicar el borrador' }
    } finally {
      loading.value = false
    }
  }

  const requestPublication = async (postId) => {
    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' }
      }

      // Crear solicitud de publicación
      const { data, error } = await supabase
        .from('publish_requests')
        .insert([{
          post_id: postId,
          author_id: user.id,
          status: 'pending'
        }])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, request: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al solicitar publicación' }
    } finally {
      loading.value = false
    }
  }

  const getPublishRequests = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Verificar que sea admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return { success: false, error: 'Solo los administradores pueden ver solicitudes' }
      }

      const { data, error } = await supabase
        .from('publish_requests')
        .select(`
          *,
          posts (*),
          profiles!publish_requests_author_id_fkey (name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, requests: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al obtener solicitudes' }
    }
  }

  const reviewPublishRequest = async (requestId, status, adminNotes = '') => {
    loading.value = true
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' }
      }

      // Verificar que sea admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return { success: false, error: 'Solo los administradores pueden revisar solicitudes' }
      }

      // Actualizar la solicitud
      const { data: request, error: requestError } = await supabase
        .from('publish_requests')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single()

      if (requestError) {
        return { success: false, error: requestError.message }
      }

      // Si se aprueba, publicar el post
      if (status === 'approved') {
        const { error: publishError } = await supabase
          .from('posts')
          .update({ status: 'published', updated_at: new Date().toISOString() })
          .eq('id', request.post_id)

        if (publishError) {
          return { success: false, error: publishError.message }
        }
      }

      return { success: true, request }
    } catch (error) {
      return { success: false, error: error.message || 'Error al revisar solicitud' }
    } finally {
      loading.value = false
    }
  }

  const getPostHistory = async (postId) => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Verificar que sea admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return { success: false, error: 'Solo los administradores pueden ver el historial' }
      }

      const { data, error } = await supabase
        .from('post_history')
        .select(`
          *,
          profiles!post_history_user_id_fkey (name, email)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, history: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al obtener historial' }
    }
  }

  return {
    loading: readonly(loading),
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getPublicPosts,
    getPost,
    publishDraft,
    requestPublication,
    getPublishRequests,
    reviewPublishRequest,
    getPostHistory
  }
}
