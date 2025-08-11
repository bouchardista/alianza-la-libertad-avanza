// Script de prueba para verificar el flujo de subida de archivos
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFileUpload() {
  try {
    console.log('🧪 Iniciando prueba de subida de archivos...')
    
    // 1. Verificar posts existentes
    console.log('\n📋 Verificando posts existentes...')
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, status')
      .limit(5)
    
    if (postsError) {
      console.error('❌ Error al obtener posts:', postsError)
      return
    }
    
    if (posts.length === 0) {
      console.log('❌ No hay posts para probar')
      return
    }
    
    console.log(`✅ Encontrados ${posts.length} posts`)
    const testPost = posts[0]
    console.log(`🎯 Usando post: ${testPost.title} (ID: ${testPost.id})`)
    
    // 2. Crear un archivo de prueba
    console.log('\n📄 Creando archivo de prueba...')
    const testFileName = 'test-file.txt'
    const testContent = 'Este es un archivo de prueba para verificar la subida de archivos.'
    fs.writeFileSync(testFileName, testContent)
    
    // 3. Simular subida a Google Drive (mock)
    console.log('\n☁️ Simulando subida a Google Drive...')
    const mockDriveData = {
      id: 'test-drive-id-' + Date.now(),
      name: testFileName,
      size: testContent.length,
      mimeType: 'text/plain',
      webViewLink: 'https://drive.google.com/file/d/test/view',
      webContentLink: 'https://drive.google.com/uc?export=download&id=test',
      thumbnailLink: null
    }
    
    console.log('✅ Datos simulados de Google Drive:', mockDriveData)
    
    // 4. Probar inserción en post_attachments
    console.log('\n📎 Probando inserción en post_attachments...')
    
    const attachment = {
      post_id: testPost.id,
      file_name: mockDriveData.name,
      file_type: mockDriveData.mimeType,
      file_size: mockDriveData.size,
      drive_file_id: mockDriveData.id,
      drive_view_url: mockDriveData.webViewLink,
      drive_download_url: mockDriveData.webContentLink,
      thumbnail_url: mockDriveData.thumbnailLink,
      created_by: 'test-user-id' // Usar un ID falso para la prueba
    }
    
    console.log('📋 Datos del attachment a insertar:', attachment)
    
    const { data: insertedAttachment, error: insertError } = await supabase
      .from('post_attachments')
      .insert([attachment])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Error al insertar attachment:', insertError)
      return
    }
    
    console.log('✅ Attachment insertado exitosamente:', insertedAttachment)
    
    // 5. Verificar que se puede recuperar
    console.log('\n🔍 Verificando recuperación del attachment...')
    const { data: retrievedAttachments, error: retrieveError } = await supabase
      .from('post_attachments')
      .select('*')
      .eq('post_id', testPost.id)
    
    if (retrieveError) {
      console.error('❌ Error al recuperar attachments:', retrieveError)
      return
    }
    
    console.log(`✅ Recuperados ${retrievedAttachments.length} attachments para el post`)
    retrievedAttachments.forEach((att, index) => {
      console.log(`${index + 1}. ${att.file_name} (${att.file_type})`)
    })
    
    // 6. Limpiar archivo de prueba
    console.log('\n🧹 Limpiando archivo de prueba...')
    if (fs.existsSync(testFileName)) {
      fs.unlinkSync(testFileName)
      console.log('✅ Archivo de prueba eliminado')
    }
    
    console.log('\n🎉 Prueba completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error)
  }
}

testFileUpload()
