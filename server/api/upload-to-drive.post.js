import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔄 Iniciando subida a Google Drive...')
    const config = useRuntimeConfig()
    
    console.log('📋 Configuración disponible:', {
      hasServiceAccount: !!config.googleDriveServiceAccountJson,
      hasFolderId: !!config.googleDriveFolderId
    })
    
    // Verificar que las credenciales estén configuradas
    if (!config.googleDriveServiceAccountJson) {
      console.error('❌ Google Drive no está configurado correctamente')
      throw createError({
        statusCode: 500,
        statusMessage: 'Google Drive no está configurado correctamente'
      })
    }

    // Configurar cuenta de servicio
    console.log('🔐 Configurando cuenta de servicio...')
    const serviceAccount = JSON.parse(config.googleDriveServiceAccountJson)
    console.log('📧 Email de la cuenta de servicio:', serviceAccount.client_email)
    
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
      throw createError({
        statusCode: 400,
        statusMessage: 'No se proporcionó ningún archivo'
      })
    }

    // Convertir el archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Configurar los metadatos del archivo
    const fileMetadata = {
      name: file.name,
      parents: folderId ? [folderId] : [config.googleDriveFolderId]
    }

    // Configurar los medios
    const media = {
      mimeType: file.type,
      body: buffer
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
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error al subir archivo a Google Drive'
    })
  }
})
