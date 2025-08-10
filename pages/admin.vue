<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1A043C] to-[#371859]">
    <header class="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">
              Panel de Administración
            </h1>
            <p class="text-sm text-white/80 mt-1">
              Alianza La Libertad Avanza - Córdoba
            </p>
            <p v-if="user" class="text-xs text-white/60 mt-1">
              Conectado como: {{ user.name }} ({{ user.role }})
            </p>
          </div>
          <div class="flex space-x-4">
            <a
              href="/"
              class="inline-flex items-center px-4 py-2 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
              Volver al sitio
            </a>
            <button
              @click="handleLogout"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#AD3257] hover:bg-[#8B1F3F] transition-colors disabled:opacity-50"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
              {{ loading ? 'Cerrando...' : 'Cerrar Sesión' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="heroicons:document-text" class="h-6 w-6 text-white/60" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-white/80 truncate">
                    Total Publicaciones
                  </dt>
                  <dd class="text-lg font-medium text-white">
                    {{ posts ? posts.length : 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="heroicons:document-check" class="h-6 w-6 text-[#EFB141]" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-white/80 truncate">
                    Resoluciones
                  </dt>
                  <dd class="text-lg font-medium text-white">
                    {{ resolucionesCount }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="heroicons:chat-bubble-left-right" class="h-6 w-6 text-[#E36030]" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-white/80 truncate">
                    Comunicados
                  </dt>
                  <dd class="text-lg font-medium text-white">
                    {{ comunicadosCount }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de publicaciones -->
      <div class="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-white/20">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-white">
                Publicaciones
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-white/80">
                Gestiona todas las resoluciones y comunicados
              </p>
            </div>
            <button
              @click="createNewPost"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-800 bg-[#EFB141] hover:bg-[#E36030] hover:text-white transition-colors"
            >
              <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
              Nueva Publicación
            </button>
          </div>
        </div>
        <ul v-if="posts && posts.length > 0" class="divide-y divide-white/20">
          <li v-for="post in posts" :key="post._path" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      post.type === 'RESOLUCIÓN' 
                        ? 'bg-[#EFB141] text-gray-800' 
                        : 'bg-[#EFB141] text-gray-800'
                    ]"
                  >
                    {{ post.type }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-white">
                    {{ post.title }}
                  </div>
                  <div class="text-sm text-white/70">
                    {{ formatDate(post.date) }} • {{ post.category }}
                  </div>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editPost(post)"
                  class="inline-flex items-center px-3 py-1 border border-white/20 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon name="heroicons:pencil" class="w-4 h-4 mr-1" />
                  Editar
                </button>
                <button
                  @click="deletePost(post)"
                  class="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-[#AD3257] hover:bg-[#8B1F3F] transition-colors"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="px-4 py-8 text-center">
          <p class="text-white/60">No hay publicaciones disponibles.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Middleware para proteger la ruta
definePageMeta({
  middleware: 'auth-admin'
})

useHead({
  title: 'Administración - Alianza La Libertad Avanza',
  meta: [
    { name: 'description', content: 'Panel de administración del sitio oficial' }
  ]
});

console.log('🎯 Página de admin cargándose...')

const { user, signOut, loading } = useAuth()

const { data: posts } = await useAsyncData("admin-posts", () =>
  queryContent("/posts").sort({ date: -1 }).find()
);

const resolucionesCount = computed(() => {
  if (!posts.value) return 0;
  return posts.value.filter(post => post.type === 'RESOLUCIÓN').length;
});

const comunicadosCount = computed(() => {
  if (!posts.value) return 0;
  return posts.value.filter(post => post.type === 'COMUNICADO').length;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

const createNewPost = () => {
  // Aquí iría la lógica para crear un nuevo post
  alert('Función de crear nuevo post - Por implementar');
};

const editPost = (post) => {
  // Aquí iría la lógica para editar un post
  alert(`Editando: ${post.title}`);
};

const deletePost = (post) => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${post.title}"?`)) {
    // Aquí iría la lógica para eliminar un post
    alert(`Eliminando: ${post.title}`);
  }
};

const handleLogout = async () => {
  const result = await signOut()
  if (result.success) {
    await navigateTo('/login')
  }
};
</script>
