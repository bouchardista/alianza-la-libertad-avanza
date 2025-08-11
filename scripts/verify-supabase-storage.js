#!/usr/bin/env node

/**
 * Script para verificar y configurar Supabase Storage
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar definidos en .env')
  console.error('')
  console.error('📋 Variables actuales:')
  console.error('  SUPABASE_URL:', supabaseUrl ? 'DEFINIDO' : 'NO DEFINIDO')
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'DEFINIDO' : 'NO DEFINIDO')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifySupabaseStorage() {
  console.log('🔍 Verificando Supabase Storage...')
  console.log('==================================')
  console.log('')

  try {
    // 1. Verificar buckets existentes
    console.log('📦 Verificando buckets existentes...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error al listar buckets:', listError.message)
      return
    }

    console.log('✅ Buckets encontrados:')
    const bucketNames = buckets.map(bucket => bucket.name)
    bucketNames.forEach(name => {
      console.log(`  - ${name}`)
    })

    // 2. Verificar si existe el bucket post-attachments
    const postAttachmentsBucket = buckets.find(bucket => bucket.name === 'post-attachments')
    
    if (!postAttachmentsBucket) {
      console.log('\n📦 Bucket post-attachments no existe. Creándolo...')
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('post-attachments', {
        public: true,
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp'
        ],
        fileSizeLimit: 10485760 // 10MB
      })

      if (createError) {
        console.error('❌ Error al crear bucket:', createError.message)
        return
      }

      console.log('✅ Bucket post-attachments creado exitosamente')
    } else {
      console.log('\n✅ Bucket post-attachments ya existe')
      console.log(`  - Público: ${postAttachmentsBucket.public ? 'Sí' : 'No'}`)
    }

    // 3. Probar subida de archivo de prueba
    console.log('\n🧪 Probando subida de archivo de prueba...')
    const testContent = 'Este es un archivo de prueba para verificar la configuración de Supabase Storage.'
    const testFile = new Blob([testContent], { type: 'text/plain' })
    const testFileName = `test-${Date.now()}.txt`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('post-attachments')
      .upload(`test/${testFileName}`, testFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Error al subir archivo de prueba:', uploadError.message)
      return
    }

    console.log('✅ Archivo de prueba subido exitosamente:', uploadData.path)

    // 4. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('post-attachments')
      .getPublicUrl(`test/${testFileName}`)

    console.log('✅ URL pública generada:', urlData.publicUrl)

    // 5. Eliminar archivo de prueba
    const { error: deleteError } = await supabase.storage
      .from('post-attachments')
      .remove([`test/${testFileName}`])

    if (deleteError) {
      console.error('⚠️  Error al eliminar archivo de prueba:', deleteError.message)
    } else {
      console.log('✅ Archivo de prueba eliminado')
    }

    console.log('')
    console.log('🎉 Verificación completada exitosamente!')
    console.log('')
    console.log('📋 Resumen:')
    console.log('  ✅ Supabase Storage configurado')
    console.log('  ✅ Bucket post-attachments disponible')
    console.log('  ✅ Subida de archivos funcionando')
    console.log('  ✅ URLs públicas funcionando')
    console.log('')
    console.log('🚀 Ya puedes usar Supabase Storage en tu aplicación!')

  } catch (error) {
    console.error('❌ Error general en la verificación:', error.message)
  }
}

// Ejecutar la verificación
verifySupabaseStorage()
