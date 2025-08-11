<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1A043C] via-[#2D1B69] to-[#1A043C]">
    <!-- Header -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <NuxtLink to="/" class="flex items-center space-x-3 text-white hover:text-[#EFB141] transition-colors">
          <Icon name="heroicons:arrow-left" class="w-6 h-6" />
          <span class="text-lg font-semibold">Volver al inicio</span>
        </NuxtLink>
        
        <!-- Botones de compartir -->
        <div class="flex space-x-3">
          <button 
            @click="sharePost"
            class="flex items-center space-x-2 px-4 py-2 bg-[#31B4E7] hover:bg-[#2A9BC7] text-white rounded-lg transition-colors"
          >
            <Icon name="heroicons:share" class="w-5 h-5" />
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido del post -->
    <div class="container mx-auto px-4 pb-12">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EFB141] mx-auto mb-4"></div>
          <p class="text-white/80">Cargando publicación...</p>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <p class="text-red-400 text-lg">Error al cargar la publicación</p>
          <p class="text-red-300 mt-2">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="post" class="max-w-4xl mx-auto">
        <!-- Post completo -->
        <Post :content="post" />
      </div>

      <div v-else class="text-center py-12">
        <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
          <p class="text-yellow-400 text-lg">Publicación no encontrada</p>
          <p class="text-yellow-300 mt-2">La publicación que buscas no existe o ha sido eliminada.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { getPost } = usePosts()

// Estado
const post = ref(null)
const loading = ref(true)
const error = ref(null)

// Generar slug del post
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Función para compartir
const sharePost = async () => {
  if (navigator.share && post.value) {
    try {
      await navigator.share({
        title: post.value.title,
        text: post.value.content?.substring(0, 100) + '...',
        url: window.location.href
      })
    } catch (error) {
      console.log('Error al compartir:', error)
    }
  } else {
    // Fallback: copiar URL al portapapeles
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('URL copiada al portapapeles')
    } catch (error) {
      console.log('Error al copiar URL:', error)
    }
  }
}

// Cargar post
const loadPost = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Buscar el post por slug
    const result = await getPostBySlug(route.params.slug)
    
    if (result.success) {
      post.value = result.post
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Error al cargar la publicación'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

// Función para obtener post por slug
const getPostBySlug = async (slug) => {
  try {
    const supabase = useSupabaseClient()
    
    // Obtener todos los posts publicados
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    // Buscar el post que coincida con el slug
    const foundPost = posts.find(p => generateSlug(p.title) === slug)
    
    if (foundPost) {
      return { success: true, post: foundPost }
    } else {
      return { success: false, error: 'Post no encontrado' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Cargar post al montar la página
onMounted(() => {
  loadPost()
})

// SEO
useHead({
  title: post.value ? post.value.title : 'Publicación - Alianza La Libertad Avanza',
  meta: [
    {
      name: 'description',
      content: post.value ? post.value.content?.substring(0, 160) + '...' : 'Publicación de Alianza La Libertad Avanza'
    }
  ]
})
</script>
