<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1A043C] to-[#371859] flex flex-col">
    <!-- Header -->
    <header class="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="block hover:opacity-80 transition-opacity bg-transparent">
              <img src="/white-logo.png?v=2" alt="Logo" class="h-16 w-16 object-contain bg-transparent" />
            </NuxtLink>
          </div>
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-white">
              Alianza La Libertad Avanza
            </h1>
            <p class="text-sm text-white/80 mt-1">
              Córdoba
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto">
        <!-- Icono de error -->
        <div class="mb-8">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-500/10 mb-6">
            <Icon name="heroicons:exclamation-triangle" class="h-12 w-12 text-red-400" />
          </div>
        </div>

        <!-- Título y mensaje -->
        <h1 class="text-4xl sm:text-6xl font-bold text-white mb-4">
          404
        </h1>
        
        <h2 class="text-2xl sm:text-3xl font-semibold text-white mb-6">
          Página no encontrada
        </h2>
        
        <p class="text-lg text-white/80 mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#31B4E7] hover:bg-[#2A9BC7] transition-colors"
          >
            <Icon name="heroicons:home" class="w-5 h-5 mr-2" />
            Volver al inicio
          </NuxtLink>
          
          <button 
            @click="goBack"
            class="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-lg shadow-sm text-base font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
            Volver atrás
          </button>
        </div>

        <!-- Información adicional -->
        <div class="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
          <h3 class="text-lg font-medium text-white mb-4">¿Buscas algo específico?</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <h4 class="font-medium text-white mb-2">Resoluciones</h4>
              <p class="text-sm text-white/60">Documentos oficiales y resoluciones de la Alianza</p>
            </div>
            <div>
              <h4 class="font-medium text-white mb-2">Comunicados</h4>
              <p class="text-sm text-white/60">Comunicados oficiales y noticias</p>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/posts"
              class="inline-flex items-center text-[#31B4E7] hover:text-[#2A9BC7] transition-colors"
            >
              <Icon name="heroicons:document-text" class="w-4 h-4 mr-1" />
              Ver todas las publicaciones
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
// Configurar el estado de la página como 404
setResponseStatus(404)

// Función para volver atrás
const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}

// Configurar el head de la página
useHead({
  title: '404 - Página no encontrada | Alianza La Libertad Avanza Córdoba',
  meta: [
    { name: 'description', content: 'La página que buscas no existe. Volvé al inicio de Alianza La Libertad Avanza Córdoba.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
