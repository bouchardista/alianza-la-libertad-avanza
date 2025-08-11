#!/usr/bin/env node

/**
 * Script para configurar Google Drive con Shared Drive
 * 
 * Pasos para configurar:
 * 1. Crear un Shared Drive en Google Workspace
 * 2. Obtener el ID del Shared Drive
 * 3. Configurar las variables de entorno
 */

const { google } = require('googleapis')

console.log('🔧 Configuración de Google Drive con Shared Drive')
console.log('================================================')
console.log('')

console.log('📋 Pasos para configurar:')
console.log('')
console.log('1. 🏢 Crear un Shared Drive:')
console.log('   - Ve a drive.google.com')
console.log('   - Click en "Nuevo" → "Carpeta compartida"')
console.log('   - Dale un nombre (ej: "Alianza La Libertad Avanza")')
console.log('   - Configura los permisos necesarios')
console.log('')
console.log('2. 🔍 Obtener el ID del Shared Drive:')
console.log('   - Abre el Shared Drive creado')
console.log('   - El ID está en la URL:')
console.log('     https://drive.google.com/drive/folders/SHARED_DRIVE_ID')
console.log('')
console.log('3. ⚙️ Configurar variables de entorno:')
console.log('   - GOOGLE_DRIVE_FOLDER_ID=SHARED_DRIVE_ID')
console.log('   - GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON=...')
console.log('')
console.log('4. 🔐 Dar permisos a la Service Account:')
console.log('   - Ve al Shared Drive')
console.log('   - Click derecho → "Compartir"')
console.log('   - Agrega el email de la Service Account con permisos de "Editor"')
console.log('   - Email: alianza-libertad-avanza-drive@imposing-ratio-468712-s3.iam.gserviceaccount.com')
console.log('')

console.log('📝 Variables de entorno necesarias:')
console.log('')
console.log('GOOGLE_DRIVE_FOLDER_ID=ID_DEL_SHARED_DRIVE')
console.log('GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}')
console.log('')

console.log('✅ Una vez configurado, los archivos se subirán al Shared Drive')
console.log('   y no tendrás problemas de cuota de almacenamiento.')
console.log('')

// Función para probar la configuración
async function testConfiguration() {
  const serviceAccountJson = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  
  if (!serviceAccountJson || !folderId) {
    console.log('❌ Variables de entorno no configuradas')
    console.log('   Ejecuta: node scripts/setup-google-drive.js')
    return
  }
  
  try {
    const serviceAccount = JSON.parse(serviceAccountJson)
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })
    
    const drive = google.drive({ version: 'v3', auth })
    
    // Probar acceso al Shared Drive
    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id,name)',
      supportsAllDrives: true,
      supportsTeamDrives: true,
      includeItemsFromAllDrives: true
    })
    
    console.log('✅ Configuración correcta!')
    console.log(`📁 Shared Drive ID: ${folderId}`)
    console.log(`📧 Service Account: ${serviceAccount.client_email}`)
    console.log(`📄 Archivos en el drive: ${response.data.files?.length || 0}`)
    
  } catch (error) {
    console.log('❌ Error en la configuración:')
    console.log(`   ${error.message}`)
    console.log('')
    console.log('🔧 Verifica:')
    console.log('   1. Que el Shared Drive existe')
    console.log('   2. Que la Service Account tiene permisos')
    console.log('   3. Que las variables de entorno están correctas')
  }
}

// Ejecutar test si se llama con --test
if (process.argv.includes('--test')) {
  testConfiguration()
}
