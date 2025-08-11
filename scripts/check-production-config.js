// Script para verificar la configuración de Google Drive en producción
import { google } from 'googleapis'

async function checkGoogleDriveConfig() {
  try {
    console.log('🔍 Verificando configuración de Google Drive...')
    
    // Verificar variables de entorno
    const serviceAccountJson = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
    
    console.log('📋 Variables de entorno:')
    console.log('- GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON:', serviceAccountJson ? '✅ Configurada' : '❌ No configurada')
    console.log('- GOOGLE_DRIVE_FOLDER_ID:', folderId ? `✅ Configurada (${folderId})` : '❌ No configurada')
    
    if (!serviceAccountJson) {
      console.error('❌ GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON no está configurada')
      return
    }
    
    if (!folderId) {
      console.error('❌ GOOGLE_DRIVE_FOLDER_ID no está configurada')
      return
    }
    
    // Intentar parsear el JSON de la cuenta de servicio
    let serviceAccount
    try {
      serviceAccount = JSON.parse(serviceAccountJson)
      console.log('✅ JSON de cuenta de servicio válido')
      console.log('📧 Email de la cuenta:', serviceAccount.client_email)
    } catch (error) {
      console.error('❌ Error al parsear JSON de cuenta de servicio:', error.message)
      return
    }
    
    // Configurar autenticación
    console.log('🔐 Configurando autenticación...')
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })
    
    // Crear cliente de Google Drive
    console.log('🚀 Creando cliente de Google Drive...')
    const drive = google.drive({ version: 'v3', auth })
    
    // Verificar acceso a la carpeta
    console.log('📁 Verificando acceso a la carpeta...')
    try {
      const folderResponse = await drive.files.get({
        fileId: folderId,
        fields: 'id,name,permissions'
      })
      
      console.log('✅ Acceso a carpeta verificado')
      console.log('📂 Nombre de la carpeta:', folderResponse.data.name)
      console.log('🆔 ID de la carpeta:', folderResponse.data.id)
      
    } catch (error) {
      console.error('❌ Error al acceder a la carpeta:', error.message)
      if (error.code === 404) {
        console.error('   La carpeta no existe o no tienes permisos')
      } else if (error.code === 403) {
        console.error('   No tienes permisos para acceder a la carpeta')
      }
      return
    }
    
    // Crear un archivo de prueba
    console.log('🧪 Creando archivo de prueba...')
    const testContent = 'Este es un archivo de prueba para verificar la configuración de Google Drive.'
    const testFileName = `test-${Date.now()}.txt`
    
    try {
      const testFileResponse = await drive.files.create({
        requestBody: {
          name: testFileName,
          parents: [folderId]
        },
        media: {
          mimeType: 'text/plain',
          body: testContent
        },
        fields: 'id,name,size,mimeType,webViewLink'
      })
      
      console.log('✅ Archivo de prueba creado exitosamente')
      console.log('📄 Nombre:', testFileResponse.data.name)
      console.log('🆔 ID:', testFileResponse.data.id)
      console.log('🔗 Enlace:', testFileResponse.data.webViewLink)
      
      // Eliminar el archivo de prueba
      console.log('🧹 Eliminando archivo de prueba...')
      await drive.files.delete({
        fileId: testFileResponse.data.id
      })
      console.log('✅ Archivo de prueba eliminado')
      
    } catch (error) {
      console.error('❌ Error al crear archivo de prueba:', error.message)
      return
    }
    
    console.log('🎉 Configuración de Google Drive verificada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

checkGoogleDriveConfig()
