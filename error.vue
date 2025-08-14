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
          {{ error.statusCode === 404 ? '404' : error.statusCode }}
        </h1>
        
        <h2 class="text-2xl sm:text-3xl font-semibold text-white mb-6">
          {{ error.statusCode === 404 ? 'Página no encontrada' : 'Error del servidor' }}
        </h2>
        
        <p class="text-lg text-white/80 mb-8 leading-relaxed">
          {{ error.statusCode === 404 
            ? 'Lo sentimos, la página que buscas no existe o ha sido movida.' 
            : 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.' 
          }}
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
            @click="handleError"
            class="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-lg shadow-sm text-base font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
            Intentar nuevamente
          </button>
        </div>

        <!-- Información adicional para 404 -->
        <div v-if="error.statusCode === 404" class="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
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
defineProps({
  error: Object
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
