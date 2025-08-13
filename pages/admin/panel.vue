<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
      <p class="text-white text-lg">Redirigiendo al panel administrativo...</p>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

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

// Redirigir al panel principal
onMounted(() => {
  router.replace('/admin')
})
</script>
