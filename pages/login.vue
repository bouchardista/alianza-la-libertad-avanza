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
        <div class="mx-auto h-20 w-20 flex items-center justify-center shadow-lg">
          <img src="/white-logo.png" alt="Logo Alianza La Libertad Avanza" class="h-16 w-16 object-contain" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Acceso al Sistema
        </h2>
        <p class="mt-2 text-center text-sm text-white/80">
          Alianza La Libertad Avanza - Córdoba
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/20 placeholder-white/60 text-white bg-white/10 rounded-t-md focus:outline-none focus:ring-[#EFB141] focus:border-[#EFB141] focus:z-10 sm:text-sm"
              placeholder="Email"
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

        <div v-if="error" class="text-red-400 text-sm text-center">
          {{ error }}
        </div>
      </form>

      <div class="text-center">
        <a href="/" class="text-[#EFB141] hover:text-[#E36030] text-sm transition-colors">
          ← Volver al sitio principal
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Login - Alianza La Libertad Avanza Córdoba',
  meta: [
    { name: 'description', content: 'Acceso al sistema de administración' }
  ]
});

const { signIn, loading } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const pageLoading = ref(false)

// Evitar problemas de hidratación usando onMounted
onMounted(() => {
  // El estado se inicializa en el cliente
})

const handleLogin = async () => {
  error.value = ''
  pageLoading.value = true
  
  const result = await signIn(email.value, password.value)
  
  if (result.success) {
    // Redirigir según el rol
    if (result.user.role === 'admin') {
      window.location.href = '/admin'
    } else if (result.user.role === 'editor') {
      window.location.href = '/editor'
    }
  } else {
    pageLoading.value = false
    error.value = result.error || 'Error al iniciar sesión'
  }
}
</script>
