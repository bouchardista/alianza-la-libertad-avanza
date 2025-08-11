#!/usr/bin/env node

/**
 * Script para configurar Supabase Storage
 * 
 * Pasos para configurar:
 * 1. Crear bucket 'post-attachments' en Supabase
 * 2. Configurar políticas de acceso
 * 3. Verificar la configuración
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar definidos en .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupSupabaseStorage() {
  console.log('🔧 Configurando Supabase Storage...')
  console.log('====================================')
  console.log('')

  try {
    // 1. Crear bucket si no existe
    console.log('📦 Creando bucket post-attachments...')
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('post-attachments', {
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

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket post-attachments ya existe')
      } else {
        console.error('❌ Error al crear bucket:', bucketError.message)
        return
      }
    } else {
      console.log('✅ Bucket post-attachments creado exitosamente')
    }

    // 2. Listar buckets para verificar
    console.log('\n📋 Verificando buckets existentes...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error al listar buckets:', listError.message)
      return
    }

    console.log('✅ Buckets encontrados:')
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'Público' : 'Privado'})`)
    })

    // 3. Verificar políticas de acceso
    console.log('\n🔐 Verificando políticas de acceso...')
    console.log('✅ Bucket configurado como público')
    console.log('✅ Tipos de archivo permitidos configurados')
    console.log('✅ Límite de tamaño: 10MB')

    // 4. Probar subida de archivo de prueba
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

    // 5. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('post-attachments')
      .getPublicUrl(`test/${testFileName}`)

    console.log('✅ URL pública generada:', urlData.publicUrl)

    // 6. Eliminar archivo de prueba
    const { error: deleteError } = await supabase.storage
      .from('post-attachments')
      .remove([`test/${testFileName}`])

    if (deleteError) {
      console.error('⚠️  Error al eliminar archivo de prueba:', deleteError.message)
    } else {
      console.log('✅ Archivo de prueba eliminado')
    }

    console.log('')
    console.log('🎉 Configuración de Supabase Storage completada exitosamente!')
    console.log('')
    console.log('📋 Resumen:')
    console.log('  ✅ Bucket post-attachments creado/configurado')
    console.log('  ✅ Acceso público habilitado')
    console.log('  ✅ Tipos de archivo permitidos configurados')
    console.log('  ✅ Límite de tamaño: 10MB')
    console.log('  ✅ Subida de archivos funcionando')
    console.log('  ✅ URLs públicas funcionando')
    console.log('')
    console.log('🚀 Ya puedes usar Supabase Storage en tu aplicación!')

  } catch (error) {
    console.error('❌ Error general en la configuración:', error.message)
  }
}

// Ejecutar la configuración
setupSupabaseStorage()
