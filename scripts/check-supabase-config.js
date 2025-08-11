#!/usr/bin/env node

/**
 * Script para verificar la configuración de Supabase
 */

console.log('🔍 Verificando configuración de Supabase...')
console.log('==========================================')
console.log('')

// Verificar variables de entorno
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

console.log('📋 Variables de entorno requeridas:')
requiredEnvVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`  ❌ ${varName}: NO DEFINIDA`)
  }
})

console.log('')
console.log('📋 Configuración en nuxt.config.ts:')
console.log('  - Verificar que supabaseUrl y supabaseKey estén configurados')
console.log('  - Verificar que las variables estén en runtimeConfig.public')

console.log('')
console.log('🔧 Para configurar Supabase Storage:')
console.log('  1. Ir a Supabase Dashboard > Storage')
console.log('  2. Crear bucket "post-attachments"')
console.log('  3. Configurar como público')
console.log('  4. Configurar políticas de acceso')

console.log('')
console.log('📝 Comandos útiles:')
console.log('  - node scripts/setup-supabase-storage.js')
console.log('  - npm run dev (para probar localmente)')

console.log('')
console.log('🎯 Próximos pasos:')
console.log('  1. Verificar que las variables de entorno estén en Vercel')
console.log('  2. Configurar Supabase Storage')
console.log('  3. Probar subida de archivos')
