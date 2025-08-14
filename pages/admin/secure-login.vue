<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1A043C] to-[#371859] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Loader de página -->
    <div v-if="pageLoading" class="fixed inset-0 bg-gradient-to-b from-[#1A043C] to-[#371859] flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#EFB141] mx-auto mb-4"></div>
        <p class="text-white/80 text-lg">Iniciando sesión...</p>
      </div>
    </div>

    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-24 w-24 flex items-center justify-center bg-transparent">
          <img src="/white-logo.png?v=2" alt="Logo Alianza La Libertad Avanza" class="h-20 w-20 object-contain bg-transparent" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Acceso Administrativo
        </h2>
        <p class="mt-2 text-center text-sm text-white/80">
          Alianza La Libertad Avanza Córdoba
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/20 placeholder-white/60 text-white bg-white/10 rounded-t-md focus:outline-none focus:ring-[#EFB141] focus:border-[#EFB141] focus:z-10 sm:text-sm"
              placeholder="Usuario"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/20 placeholder-white/60 text-white bg-white/10 rounded-b-md focus:outline-none focus:ring-[#EFB141] focus:border-[#EFB141] focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-[#EFB141] hover:bg-[#E36030] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EFB141] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Icon name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
            </span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/" class="text-[#EFB141] hover:text-[#E36030] text-sm transition-colors">
            ← Volver al sitio principal
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const router = useRouter()

// SEO
useHead({
  title: 'Acceso Administrativo - Alianza La Libertad Avanza',
  meta: [
    { name: 'description', content: 'Acceso administrativo para la gestión de contenido de Alianza La Libertad Avanza' }
  ]
})

// Estado del formulario
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Verificar si ya está autenticado como admin
onMounted(async () => {
  try {
    const { data: { user } } = await client.auth.getUser()
    
    if (user) {
      // Verificar que tenga rol de admin
      const { data: profile } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile && profile.role === 'admin') {
        // Si ya está autenticado como admin, redirigir al panel principal
        await router.replace('/admin/panel')
        return
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error)
  }
})

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('🔄 Intentando login con:', `${username.value}@alianza.com.ar`)
    
    // Intentar login con el username como email
    const { data, error: authError } = await client.auth.signInWithPassword({
      email: `${username.value}@alianza.com.ar`,
      password: password.value
    })

    if (authError) {
      console.error('❌ Error de autenticación:', authError)
      error.value = 'Credenciales incorrectas'
      return
    }

    console.log('✅ Login exitoso, usuario:', data.user.id)

    // Verificar que el usuario tenga rol de admin
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('❌ Error al obtener perfil:', profileError)
      await $supabase.auth.signOut()
      error.value = 'Error al verificar permisos'
      return
    }

    console.log('📋 Perfil encontrado:', profile)

    if (profile.role !== 'admin') {
      console.log('❌ Usuario no es admin, rol:', profile.role)
      await $supabase.auth.signOut()
      error.value = 'No tienes permisos de administrador'
      return
    }

    console.log('✅ Usuario es admin, redirigiendo...')

    // Redirigir al panel de administración
    await router.push('/admin/panel')

  } catch (err) {
    console.error('Error en login:', err)
    error.value = 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
