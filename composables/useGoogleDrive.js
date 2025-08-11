export const useGoogleDrive = () => {
  const config = useRuntimeConfig()
  
  const getSupabase = () => {
    try {
      return $supabase.client
    } catch (error) {
      console.error('Error getting Supabase client:', error)
      return null
    }
  }

  // Función para obtener el token de acceso de Google Drive
  const getGoogleDriveToken = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { success: false, error: 'Cliente de Supabase no disponible' }
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Aquí deberías implementar la lógica para obtener el token de Google Drive
      // Por ahora, usaremos una variable de entorno
      const token = config.public.googleDriveToken
      
      if (!token) {
        return { success: false, error: 'Token de Google Drive no configurado' }
      }

      return { success: true, token }
    } catch (error) {
      return { success: false, error: error.message || 'Error al obtener token de Google Drive' }
    }
  }

  // Función para subir archivo a Google Drive
  const uploadToDrive = async (file, folderId = null) => {
    try {
      const tokenResult = await getGoogleDriveToken()
      if (!tokenResult.success) {
        return tokenResult
      }

      const formData = new FormData()
      formData.append('file', file)
      
      if (folderId) {
        formData.append('folderId', folderId)
      }

      // Aquí deberías hacer la llamada a tu API para subir a Google Drive
      // Por ahora, simularemos la respuesta
      const response = await $fetch('/api/upload-to-drive', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${tokenResult.token}`
        }
      })

      return { success: true, fileData: response }
    } catch (error) {
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

      const { data, error } = await supabase
        .from('post_attachments')
        .insert([attachment])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, attachment: data }
    } catch (error) {
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
