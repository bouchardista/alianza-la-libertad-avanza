import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Verificar que las credenciales estén configuradas
    if (!config.googleDriveServiceAccountJson) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Google Drive no está configurado correctamente'
      })
    }

    // Configurar cuenta de servicio
    const serviceAccount = JSON.parse(config.googleDriveServiceAccountJson)
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })

    // Crear cliente de Google Drive
    const drive = google.drive({ version: 'v3', auth })

    // Obtener el archivo del body
    const formData = await readFormData(event)
    const file = formData.get('file')
    const folderId = formData.get('folderId')

    if (!file) {
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
