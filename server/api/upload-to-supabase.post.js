import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔄 Iniciando subida a Supabase Storage...')
    const config = useRuntimeConfig()
    
    // Debug: Mostrar todas las variables disponibles
    console.log('🔍 Variables de configuración disponibles:')
    console.log('  config.public.supabaseUrl:', config.public.supabaseUrl)
    console.log('  config.public.supabaseKey:', config.public.supabaseKey ? 'DEFINIDO' : 'NO DEFINIDO')
    console.log('  config.supabaseUrl:', config.supabaseUrl)
    console.log('  config.supabaseKey:', config.supabaseKey ? 'DEFINIDO' : 'NO DEFINIDO')
    console.log('  config.supabaseServiceRoleKey:', config.supabaseServiceRoleKey ? 'DEFINIDO' : 'NO DEFINIDO')
    
    // Verificar configuración de Supabase
    if (!config.public.supabaseUrl || !config.public.supabaseKey) {
      console.error('❌ Supabase no está configurado correctamente')
      console.error('supabaseUrl:', config.public.supabaseUrl)
      console.error('supabaseKey:', config.public.supabaseKey ? 'DEFINIDO' : 'NO DEFINIDO')
      return {
        success: false,
        error: 'Supabase no está configurado correctamente. Contacta al administrador.'
      }
    }

    // Crear cliente de Supabase
    const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
    
    // Obtener el archivo del body
    console.log('📁 Leyendo archivo del request...')
    const formData = await readFormData(event)
    const file = formData.get('file')
    const postId = formData.get('postId')

    console.log('📋 Datos del archivo:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      postId: postId
    })

    if (!file) {
      console.error('❌ No se proporcionó ningún archivo')
      return {
        success: false,
        error: 'No se proporcionó ningún archivo'
      }
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${postId}/${timestamp}-${file.name}`

    console.log('📝 Nombre único del archivo:', uniqueFileName)

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('post-attachments')
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Error al subir archivo a Supabase Storage:', error)
      return {
        success: false,
        error: `Error al subir archivo: ${error.message}`
      }
    }

    console.log('✅ Archivo subido exitosamente:', data)

    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('post-attachments')
      .getPublicUrl(uniqueFileName)

    console.log('🔗 URL pública generada:', urlData.publicUrl)

    return {
      success: true,
      fileData: {
        id: data.path,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        url: urlData.publicUrl,
        path: data.path
      }
    }

  } catch (error) {
    console.error('Error al subir archivo a Supabase Storage:', error)
    
    let errorMessage = 'Error al subir archivo a Supabase Storage'
    
    if (error.message) {
      errorMessage += `: ${error.message}`
    }
    
    console.error('Mensaje de error detallado:', errorMessage)
    
    return {
      success: false,
      error: errorMessage
    }
  }
})
