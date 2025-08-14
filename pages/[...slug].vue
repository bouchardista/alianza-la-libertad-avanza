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
            Lo sentimos, la página que buscas no existe.
          </p>
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



// Configurar el head de la página
useHead({
  title: '404 - Página no encontrada | Alianza La Libertad Avanza Córdoba',
  meta: [
    { name: 'description', content: 'La página que buscas no existe. Volvé al inicio de Alianza La Libertad Avanza Córdoba.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
