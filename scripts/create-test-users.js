// Script para crear usuarios de prueba en Supabase
// Ejecutar con: node scripts/create-test-users.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_KEY deben estar definidos en .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUsers() {
  console.log('🚀 Creando usuarios de prueba...')

  try {
    // Crear usuario admin
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@alianza.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador'
      }
    })

    if (adminError) {
      console.error('❌ Error creando admin:', adminError.message)
    } else {
      console.log('✅ Admin creado:', adminData.user.id)
      
      // Actualizar rol a admin
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'admin', name: 'Administrador' })
        .eq('id', adminData.user.id)
      
      if (roleError) {
        console.error('❌ Error actualizando rol admin:', roleError.message)
      } else {
        console.log('✅ Rol admin asignado')
      }
    }

    // Crear usuario editor
    const { data: editorData, error: editorError } = await supabase.auth.admin.createUser({
      email: 'editor@alianza.com',
      password: 'editor123',
      email_confirm: true,
      user_metadata: {
        name: 'Editor'
      }
    })

    if (editorError) {
      console.error('❌ Error creando editor:', editorError.message)
    } else {
      console.log('✅ Editor creado:', editorData.user.id)
      
      // Actualizar rol a editor
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'editor', name: 'Editor' })
        .eq('id', editorData.user.id)
      
      if (roleError) {
        console.error('❌ Error actualizando rol editor:', roleError.message)
      } else {
        console.log('✅ Rol editor asignado')
      }
    }

    console.log('\n🎉 Usuarios de prueba creados exitosamente!')
    console.log('📧 admin@alianza.com / admin123')
    console.log('📧 editor@alianza.com / editor123')

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

createTestUsers()
