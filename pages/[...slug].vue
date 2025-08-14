<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1A043C] via-[#2D1B69] to-[#1A043C]">
    <!-- Header -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <NuxtLink to="/" class="flex items-center space-x-3 text-white hover:text-[#EFB141] transition-colors">
          <Icon name="heroicons:arrow-left" class="w-6 h-6" />
          <span class="text-lg font-semibold">Volver al inicio</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="container mx-auto px-4 pb-12">
      <div class="max-w-4xl mx-auto">
        <!-- Contenido del error -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 text-center">
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
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
          <div class="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
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
      </div>
    </div>
    
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
