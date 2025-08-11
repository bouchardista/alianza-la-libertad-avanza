#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔄 Actualizando referencias de Google Drive a Supabase Storage...')

// Archivos a actualizar
const filesToUpdate = [
  'pages/admin.vue',
  'pages/editor.vue',
  'components/Post.vue'
]

// Cambios a realizar
const changes = [
  {
    from: 'useGoogleDrive',
    to: 'useSupabaseStorage'
  },
  {
    from: 'uploadToDrive',
    to: 'uploadToStorage'
  }
]

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Actualizando ${filePath}...`)
    
    let content = fs.readFileSync(filePath, 'utf8')
    let hasChanges = false
    
    changes.forEach(change => {
      if (content.includes(change.from)) {
        content = content.replace(new RegExp(change.from, 'g'), change.to)
        hasChanges = true
        console.log(`  ✅ Cambiado ${change.from} → ${change.to}`)
      }
    })
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ ${filePath} actualizado`)
    } else {
      console.log(`⏭️  ${filePath} no necesita cambios`)
    }
  } else {
    console.log(`❌ Archivo no encontrado: ${filePath}`)
  }
})

console.log('')
console.log('🎉 Actualización completada!')
console.log('')
console.log('📋 Cambios realizados:')
console.log('  - useGoogleDrive() → useSupabaseStorage()')
console.log('  - uploadToDrive() → uploadToStorage()')
console.log('')
console.log('📝 Archivos actualizados:')
filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`)
  } else {
    console.log(`  ❌ ${file} (no encontrado)`)
  }
})
