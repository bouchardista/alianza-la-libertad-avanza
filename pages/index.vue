<template>
  <main class="min-h-screen relative bg-gradient-to-b from-[#1A043C] to-[#371859]">
    <hero />
    <section
      class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <!-- Filtros -->
      <div class="my-12 flex flex-wrap gap-4 justify-center">
        <button 
          @click="filterType = null"
          :class="[
            'px-6 py-3 rounded-full text-sm font-medium transition-colors',
            filterType === null 
              ? 'bg-[#EFB141] text-gray-800 shadow-md' 
              : 'bg-white/10 text-white hover:bg-[#EFB141] hover:text-gray-800 border border-white/20'
          ]"
        >
          Todos
        </button>
        <button 
          @click="filterType = 'RESOLUCIÓN'"
          :class="[
            'px-6 py-3 rounded-full text-sm font-medium transition-colors',
            filterType === 'RESOLUCIÓN' 
              ? 'bg-[#EFB141] text-gray-800 border border-[#EFB141] shadow-md' 
              : 'bg-white/10 text-white hover:bg-[#EFB141] hover:text-gray-800 border border-white/20'
          ]"
        >
          Resoluciones
        </button>
        <button 
          @click="filterType = 'COMUNICADO'"
          :class="[
            'px-6 py-3 rounded-full text-sm font-medium transition-colors',
            filterType === 'COMUNICADO' 
              ? 'bg-[#EFB141] text-gray-800 border border-[#EFB141] shadow-md' 
              : 'bg-white/10 text-white hover:bg-[#EFB141] hover:text-gray-800 border border-white/20'
          ]"
        >
          Comunicados
        </button>
      </div>

      <!-- Loader -->
      <div v-if="postsLoading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EFB141] mx-auto mb-4"></div>
          <p class="text-white/80">Cargando publicaciones...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="postsError" class="text-center py-12">
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <p class="text-red-400 text-lg">Error al cargar las publicaciones</p>
          <p class="text-red-300 mt-2">{{ postsError }}</p>
        </div>
      </div>

      <!-- Lista de publicaciones -->
      <div v-else-if="filteredPosts && filteredPosts.length > 0">
        <post 
          v-for="post in filteredPosts" 
          :key="post.id" 
          :content="post" 
          :is-preview="true"
        />
      </div>
      
      <div v-else-if="posts && posts.length > 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="bg-white/10 border border-white/20 rounded-lg p-8">
            <div class="flex justify-center mb-4">
              <Icon name="heroicons:document-text" class="h-16 w-16 text-white/40" />
            </div>
            <h2 class="text-white text-xl font-semibold mb-2">
              No se encontraron publicaciones
            </h2>
            <p v-if="filterType" class="text-white/60 text-sm">
              con el filtro seleccionado.
            </p>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="bg-white/10 border border-white/20 rounded-lg p-8">
            <div class="flex justify-center mb-4">
              <Icon name="heroicons:document-text" class="h-16 w-16 text-white/40" />
            </div>
            <h2 class="text-white text-xl font-semibold mb-2">
              No se encontraron publicaciones
            </h2>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Footer -->
    <Footer />
  </main>
</template>

<script setup>
import seoConfig from "../seoConfig/index";

useHead({
  title: seoConfig.title,
  meta: [
    { name: "description", content: seoConfig.description },
    { name: "og:title", content: seoConfig.og.title },
    { name: "og:description", content: seoConfig.og.description },
    { name: "og:image", content: seoConfig.og.image },
    { name: "og:url", content: seoConfig.og.url },
    { name: "twitter:title", content: seoConfig.og.title },
    { name: "twitter:description", content: seoConfig.og.description },
    { name: "twitter:image", content: seoConfig.og.image },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

const { getPublicPosts } = usePosts()
const filterType = ref(null)

// Estado para los posts
const posts = ref([])
const postsLoading = ref(true)
const postsError = ref(null)

// Cargar posts desde Supabase
const loadPosts = async () => {
  postsLoading.value = true
  const result = await getPublicPosts()
  if (result.success) {
    posts.value = result.posts
  } else {
    postsError.value = result.error
  }
  postsLoading.value = false
}

// Cargar posts al montar la página
onMounted(async () => {
  await loadPosts()
})

const filteredPosts = computed(() => {
  if (!posts.value) return [];
  if (!filterType.value) return posts.value;
  return posts.value.filter(post => post && post.type === filterType.value);
});
</script>
