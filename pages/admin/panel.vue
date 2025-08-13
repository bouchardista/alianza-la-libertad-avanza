<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700">
    <!-- Header -->
    <header class="bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row justify-between items-center py-4 space-y-4 lg:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <NuxtLink to="/" class="block hover:opacity-80 transition-opacity bg-transparent">
                <img src="/white-logo.png?v=2" alt="Logo" class="h-16 w-16 object-contain bg-transparent" />
              </NuxtLink>
            </div>
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold text-white">Panel Administrativo</h1>
              <p class="text-white/60 text-sm">Alianza La Libertad Avanza</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <NuxtLink
              to="/"
              class="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Volver al sitio
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Bienvenido al Panel Administrativo</h2>
        <p class="text-white/80 text-lg mb-8">Aquí puedes gestionar el contenido del sitio</p>
        
        <div class="bg-white/5 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
          <h3 class="text-xl font-semibold text-white mb-4">Funciones disponibles:</h3>
          <ul class="text-white/80 space-y-2 text-left">
            <li>• Crear y editar publicaciones</li>
            <li>• Gestionar archivos adjuntos</li>
            <li>• Publicar y despublicar contenido</li>
            <li>• Administrar usuarios</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Aplicar middleware de autenticación
definePageMeta({
  middleware: 'auth-admin-panel'
})

// SEO
useHead({
  title: 'Panel Administrativo - Alianza La Libertad Avanza',
  meta: [
    { name: 'description', content: 'Panel administrativo para la gestión de contenido de Alianza La Libertad Avanza' }
  ]
})

// Función para cerrar sesión
const handleLogout = async () => {
  try {
    await $supabase.auth.signOut()
    await navigateTo('/admin/secure-login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>
