<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-20 w-20 flex items-center justify-center bg-transparent">
          <img src="/white-logo.png?v=2" alt="Logo Alianza La Libertad Avanza" class="h-16 w-16 object-contain bg-transparent" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Acceso Administrativo
        </h2>
        <p class="mt-2 text-center text-sm text-white/80">
          Ingresa con tus credenciales de administrador
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
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
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Icon name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
            </span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/" class="text-white/60 hover:text-white text-sm">
            ← Volver al sitio
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
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

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Intentar login con el username como email
    const { data, error: authError } = await $supabase.auth.signInWithPassword({
      email: `${username.value}@alianza.com.ar`,
      password: password.value
    })

    if (authError) {
      error.value = 'Credenciales incorrectas'
      return
    }

    // Verificar que el usuario tenga rol de admin
    const { data: profile, error: profileError } = await $supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || profile.role !== 'admin') {
      await $supabase.auth.signOut()
      error.value = 'No tienes permisos de administrador'
      return
    }

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
