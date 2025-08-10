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

      <!-- Lista de publicaciones -->
      <div v-if="posts && posts.length > 0">
        <post 
          v-for="post in filteredPosts" 
          :key="post._path" 
          :content="post" 
        />
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-white text-lg">No se encontraron publicaciones con el filtro seleccionado.</p>
      </div>
    </section>
    
    <!-- Footer -->
    <section class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 pb-12 mt-12">
      <div class="text-center">
        <p class="text-white">
          © 2025 Alianza La Libertad Avanza - Córdoba. Todos los derechos reservados.
        </p>
      </div>
    </section>
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

const { data: posts } = await useAsyncData("feed", () =>
  queryContent("/posts").sort({ date: -1 }).find()
);

const filterType = ref(null);

const filteredPosts = computed(() => {
  if (!posts.value) return [];
  if (!filterType.value) return posts.value;
  return posts.value.filter(post => post && post.type === filterType.value);
});
</script>
