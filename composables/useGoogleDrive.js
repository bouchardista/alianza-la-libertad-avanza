export const useGoogleDrive = () => {
  const config = useRuntimeConfig()
  
  const getSupabase = () => {
    try {
      // Usar el composable oficial de Supabase
      const client = useSupabaseClient()
      if (client) {
        return client
      }
      
      // Fallback: intentar obtener desde el contexto de Nuxt
      const nuxtApp = useNuxtApp()
      if (nuxtApp.$supabase) {
        return nuxtApp.$supabase
      }
      
      console.error('No se pudo obtener el cliente de Supabase')
      return null
    } catch (error) {
      console.error('Error getting Supabase client:', error)
      return null
    }
  }

  // Función para subir archivo a Google Drive
  const uploadToDrive = async (file, folderId = null) => {
    try {
      console.log('Iniciando subida a Google Drive:', { fileName: file.name, fileSize: file.size, folderId })

      const formData = new FormData()
      formData.append('file', file)
      
      if (folderId) {
        formData.append('folderId', folderId)
      }

      console.log('Enviando archivo a /api/upload-to-drive')

      // Llamada directa al endpoint del servidor
      const response = await $fetch('/api/upload-to-drive', {
        method: 'POST',
        body: formData
      })

      console.log('Respuesta de Google Drive:', response)
      
      // Verificar si la respuesta indica un error
      if (response.success === false) {
        return { success: false, error: response.error }
      }
      
      return { success: true, fileData: response }
    } catch (error) {
      console.error('Error en uploadToDrive:', error)
      return { success: false, error: error.message || 'Error al subir archivo a Google Drive' }
    }
  }

  // Función para obtener archivos adjuntos de un post
  const getPostAttachments = async (postId) => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data, error } = await supabase
        .from('post_attachments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, attachments: data }
    } catch (error) {
      return { success: false, error: error.message || 'Error al obtener archivos adjuntos' }
    }
  }

  // Función para agregar archivo adjunto a un post
  const addAttachment = async (postId, fileData) => {
    try {
      console.log('Agregando archivo adjunto:', { postId, fileData })
      
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      const attachment = {
        post_id: postId,
        file_name: fileData.name,
        file_type: fileData.mimeType,
        file_size: fileData.size,
        drive_file_id: fileData.id,
        drive_view_url: fileData.webViewLink,
        drive_download_url: fileData.webContentLink,
        thumbnail_url: fileData.thumbnailLink,
        created_by: user.id
      }

      console.log('Datos del attachment a insertar:', attachment)

      const { data, error } = await supabase
        .from('post_attachments')
        .insert([attachment])
        .select()
        .single()

      if (error) {
        console.error('Error al insertar attachment:', error)
        return { success: false, error: error.message }
      }

      console.log('Attachment insertado exitosamente:', data)
      return { success: true, attachment: data }
    } catch (error) {
      console.error('Error en addAttachment:', error)
      return { success: false, error: error.message || 'Error al agregar archivo adjunto' }
    }
  }

  // Función para eliminar archivo adjunto
  const deleteAttachment = async (attachmentId) => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { error } = await supabase
        .from('post_attachments')
        .delete()
        .eq('id', attachmentId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Error al eliminar archivo adjunto' }
    }
  }

  // Función para obtener el tipo de archivo y su icono
  const getFileTypeInfo = (mimeType) => {
    const typeMap = {
      'application/pdf': { type: 'PDF', icon: 'heroicons:document-text', color: 'text-red-500' },
      'application/msword': { type: 'DOC', icon: 'heroicons:document', color: 'text-blue-500' },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'DOCX', icon: 'heroicons:document', color: 'text-blue-500' },
      'application/vnd.ms-excel': { type: 'XLS', icon: 'heroicons:table-cells', color: 'text-green-500' },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { type: 'XLSX', icon: 'heroicons:table-cells', color: 'text-green-500' },
      'application/vnd.ms-powerpoint': { type: 'PPT', icon: 'heroicons:presentation-chart-bar', color: 'text-orange-500' },
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': { type: 'PPTX', icon: 'heroicons:presentation-chart-bar', color: 'text-orange-500' },
      'image/jpeg': { type: 'JPG', icon: 'heroicons:photo', color: 'text-purple-500' },
      'image/png': { type: 'PNG', icon: 'heroicons:photo', color: 'text-purple-500' },
      'image/gif': { type: 'GIF', icon: 'heroicons:photo', color: 'text-purple-500' },
      'image/webp': { type: 'WEBP', icon: 'heroicons:photo', color: 'text-purple-500' }
    }

    return typeMap[mimeType] || { type: 'ARCHIVO', icon: 'heroicons:document', color: 'text-gray-500' }
  }

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    uploadToDrive,
    getPostAttachments,
    addAttachment,
    deleteAttachment,
    getFileTypeInfo,
    formatFileSize
  }
}
