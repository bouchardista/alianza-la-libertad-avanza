import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔄 Iniciando subida a Google Drive...')
    const config = useRuntimeConfig()
    
    console.log('📋 Configuración disponible:', {
      hasServiceAccount: !!config.googleDriveServiceAccountJson,
      hasFolderId: !!config.googleDriveFolderId,
      serviceAccountLength: config.googleDriveServiceAccountJson ? config.googleDriveServiceAccountJson.length : 0,
      folderId: config.googleDriveFolderId
    })
    
    // Verificar que las credenciales estén configuradas
    if (!config.googleDriveServiceAccountJson) {
      console.error('❌ Google Drive no está configurado correctamente')
      return {
        success: false,
        error: 'Google Drive no está configurado correctamente. Contacta al administrador.'
      }
    }

    // Configurar cuenta de servicio
    console.log('🔐 Configurando cuenta de servicio...')
    let serviceAccount
    try {
      serviceAccount = JSON.parse(config.googleDriveServiceAccountJson)
      console.log('📧 Email de la cuenta de servicio:', serviceAccount.client_email)
    } catch (parseError) {
      console.error('❌ Error al parsear la configuración de Google Drive:', parseError)
      return {
        success: false,
        error: 'Error en la configuración de Google Drive. Contacta al administrador.'
      }
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })

    // Crear cliente de Google Drive
    console.log('🚀 Creando cliente de Google Drive...')
    const drive = google.drive({ version: 'v3', auth })

    // Obtener el archivo del body
    console.log('📁 Leyendo archivo del request...')
    const formData = await readFormData(event)
    const file = formData.get('file')
    const folderId = formData.get('folderId')

    console.log('📋 Datos del archivo:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folderId: folderId
    })

    if (!file) {
      console.error('❌ No se proporcionó ningún archivo')
      return {
        success: false,
        error: 'No se proporcionó ningún archivo'
      }
    }

    // Convertir el archivo a buffer
    let buffer
    try {
      buffer = Buffer.from(await file.arrayBuffer())
      console.log('✅ Archivo convertido a buffer, tamaño:', buffer.length)
    } catch (bufferError) {
      console.error('❌ Error al convertir archivo a buffer:', bufferError)
      return {
        success: false,
        error: 'Error al procesar el archivo'
      }
    }

    // Configurar los metadatos del archivo
    const fileMetadata = {
      name: file.name,
      parents: folderId ? [folderId] : [config.googleDriveFolderId]
    }

    // Configurar los medios usando un stream de buffer
    const { Readable } = await import('stream')
    const stream = Readable.from(buffer)
    
    const media = {
      mimeType: file.type,
      body: stream
    }

    // Subir el archivo
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,name,size,mimeType,webViewLink,webContentLink,thumbnailLink'
    })

    return {
      success: true,
      fileData: {
        id: response.data.id,
        name: response.data.name,
        size: parseInt(response.data.size) || 0,
        mimeType: response.data.mimeType,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
        thumbnailLink: response.data.thumbnailLink
      }
    }

  } catch (error) {
    console.error('Error al subir archivo a Google Drive:', error)
    
    // Proporcionar más información sobre el error
    let errorMessage = 'Error al subir archivo a Google Drive'
    
    if (error.message) {
      errorMessage += `: ${error.message}`
    }
    
    if (error.code) {
      errorMessage += ` (Código: ${error.code})`
    }
    
    console.error('Mensaje de error detallado:', errorMessage)
    
    return {
      success: false,
      error: errorMessage
    }
  }
})
