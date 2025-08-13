const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase - puedes configurar estas variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan las variables de entorno');
  console.log('');
  console.log('📋 Para configurar las variables de entorno, puedes:');
  console.log('');
  console.log('1. Crear un archivo .env en la raíz del proyecto con:');
  console.log('   SUPABASE_URL=tu_url_de_supabase');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key');
  console.log('');
  console.log('2. O configurar las variables de entorno del sistema:');
  console.log('   export SUPABASE_URL=tu_url_de_supabase');
  console.log('   export SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key');
  console.log('');
  console.log('3. O ejecutar el script con las variables directamente:');
  console.log('   SUPABASE_URL=tu_url SUPABASE_SERVICE_ROLE_KEY=tu_key node scripts/create-admin-user.js');
  console.log('');
  console.log('🔗 Puedes encontrar estas credenciales en tu dashboard de Supabase:');
  console.log('   - Project Settings > API');
  console.log('   - Necesitas la "Project URL" y "service_role" key');
  console.log('');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('🔄 Creando usuario administrador...');
    
    // Crear el usuario en Auth con email temporal
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@alianza.com.ar',
      password: 'tmMkdVRs!!Ac64G',
      email_confirm: true,
      user_metadata: {
        username: 'admin',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Error al crear usuario en Auth:', authError.message);
      return;
    }

    console.log('✅ Usuario creado en Auth:', authData.user.id);

    // Insertar en la tabla profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          username: 'admin',
          role: 'admin',
          email: 'admin@alianza.com.ar'
        }
      ]);

    if (profileError) {
      console.error('❌ Error al crear perfil:', profileError.message);
      return;
    }

    console.log('✅ Perfil creado exitosamente');
    console.log('');
    console.log('📋 Detalles del usuario creado:');
    console.log('   - ID:', authData.user.id);
    console.log('   - Username: admin');
    console.log('   - Email: admin@alianza.com.ar');
    console.log('   - Role: admin');
    console.log('   - Password: tmMkdVRs!!Ac64G');
    console.log('');
    console.log('🎉 Usuario administrador creado exitosamente!');
    console.log('');
    console.log('🔐 Para acceder:');
    console.log('   - Username: admin');
    console.log('   - Password: tmMkdVRs!!Ac64G');
    console.log('   - URL: /admin/secure-login');
    console.log('   - Panel: /admin/panel');

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

createAdminUser();
