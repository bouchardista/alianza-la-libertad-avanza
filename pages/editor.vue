<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1A043C] to-[#371859]">
    <!-- Mensaje de éxito -->
    <div v-if="showSuccessMessage" class="fixed top-4 right-4 z-50">
      <div class="bg-green-500/90 backdrop-blur-sm border border-green-400/20 rounded-lg p-4 shadow-lg">
        <div class="flex items-center">
          <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-100 mr-2" />
          <p class="text-green-100 font-medium">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Loader de página -->
    <div v-if="pageLoading" class="fixed inset-0 bg-gradient-to-b from-[#1A043C] to-[#371859] flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#31B4E7] mx-auto mb-4"></div>
        <p class="text-white/80 text-lg">Cargando panel de editor...</p>
      </div>
    </div>

    <header class="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">
              Panel de Editor
            </h1>
            <p class="text-sm text-white/80 mt-1">
              Alianza La Libertad Avanza - Córdoba
            </p>
            <p v-if="user" class="text-xs text-white/60 mt-1">
              Conectado como: {{ user.name }} ({{ user.role }})
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#31B4E7] hover:bg-[#2A9BC7] transition-colors"
            >
              <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
              Nueva Publicación
            </button>
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
      <!-- Loader de contenido -->
      <div v-if="pageLoading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31B4E7] mx-auto mb-4"></div>
          <p class="text-white/80">Cargando publicaciones...</p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div v-else>
        <!-- Error de carga -->
        <div v-if="postsError" class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8">
          <div class="flex items-center">
            <Icon name="heroicons:exclamation-triangle" class="h-8 w-8 text-red-400 mr-4" />
            <div>
              <h3 class="text-lg font-medium text-red-400">Error al cargar publicaciones</h3>
              <p class="text-red-300 mt-1">No se pudieron cargar las publicaciones. Intenta recargar la página.</p>
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="heroicons:document-text" class="h-8 w-8 text-[#31B4E7]" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-white/60">Total Publicaciones</p>
                <p class="text-2xl font-bold text-white">{{ posts?.length || 0 }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="heroicons:flag" class="h-8 w-8 text-[#EFB141]" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-white/60">Resoluciones</p>
                <p class="text-2xl font-bold text-white">{{ posts?.filter(p => p.type === 'RESOLUCIÓN').length || 0 }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="heroicons:megaphone" class="h-8 w-8 text-[#B23B8F]" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-white/60">Comunicados</p>
                <p class="text-2xl font-bold text-white">{{ posts?.filter(p => p.type === 'COMUNICADO').length || 0 }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="heroicons:calendar" class="h-8 w-8 text-[#6A4C98]" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-white/60">Este Mes</p>
                <p class="text-2xl font-bold text-white">{{ posts?.filter(p => new Date(p.date).getMonth() === new Date().getMonth()).length || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Publicaciones -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                                  <div class="px-6 py-4 border-b border-white/20">
                          <h2 class="text-xl font-semibold text-white">Mis Publicaciones y Borradores</h2>
                        </div>
          <div v-if="posts && posts.length > 0" class="divide-y divide-white/20">
            <div v-for="post in posts" :key="post._path" class="px-6 py-4">
                                <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-white">{{ post.title }}</h3>
                      <div class="flex items-center space-x-4 mt-2">
                        <Badge :type="post.type" />
                        <span class="text-sm text-white/60">{{ formatDate(post.date) }}</span>
                        <span class="text-sm text-white/60">{{ post.firmante }}</span>
                        <span v-if="post.status === 'draft'" class="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                          Borrador
                        </span>
                        <span v-else class="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          Publicado
                        </span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="handleEditPost(post)"
                        class="text-[#31B4E7] hover:text-[#2A9BC7] transition-colors"
                        title="Editar"
                      >
                        <Icon name="heroicons:pencil" class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
            </div>
          </div>
          <div v-else class="px-6 py-12 text-center">
            <Icon name="heroicons:document-text" class="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p class="text-white/60">No hay publicaciones disponibles.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal para crear nueva publicación -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 w-full max-w-2xl mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Nueva Publicación</h2>
          <button @click="showCreateModal = false" class="text-white/60 hover:text-white">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="handleCreatePost" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Título</label>
            <input
              v-model="newPost.title"
              type="text"
              required
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              placeholder="Título de la publicación"
            />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Tipo</label>
              <select
                v-model="newPost.type"
                required
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              >
                <option value="RESOLUCIÓN">Resolución</option>
                <option value="COMUNICADO">Comunicado</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Categoría</label>
              <select
                v-model="newPost.category"
                required
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="politica">Política</option>
                <option value="institucional">Institucional</option>
                <option value="eventos">Eventos</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Estado</label>
            <select
              v-model="newPost.status"
              required
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicar directamente</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Contenido</label>
            <textarea
              v-model="newPost.content"
              required
              rows="8"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              placeholder="Contenido de la publicación..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Fecha</label>
              <input
                v-model="newPost.date"
                type="date"
                required
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Firmante</label>
              <input
                v-model="newPost.firmante"
                type="text"
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
                placeholder="Alianza La Libertad Avanza"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 border border-white/20 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="postsLoading"
              class="px-4 py-2 bg-[#31B4E7] hover:bg-[#2A9BC7] text-white rounded-md transition-colors disabled:opacity-50"
            >
              {{ postsLoading ? 'Creando...' : 'Crear Publicación' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para editar publicación -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 w-full max-w-2xl mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Editar Publicación</h2>
          <button @click="showEditModal = false" class="text-white/60 hover:text-white">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="handleUpdatePost" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Título</label>
            <input
              v-model="editingPost.title"
              type="text"
              required
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              placeholder="Título de la publicación"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Tipo</label>
              <select
                v-model="editingPost.type"
                required
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              >
                <option value="RESOLUCIÓN">Resolución</option>
                <option value="COMUNICADO">Comunicado</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Categoría</label>
              <select
                v-model="editingPost.category"
                required
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="politica">Política</option>
                <option value="institucional">Institucional</option>
                <option value="eventos">Eventos</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Contenido</label>
            <textarea
              v-model="editingPost.content"
              required
              rows="8"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              placeholder="Contenido de la publicación..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Fecha</label>
              <input
                v-model="editingPost.date"
                type="date"
                required
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Firmante</label>
              <input
                v-model="editingPost.firmante"
                type="text"
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
                placeholder="Alianza La Libertad Avanza"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 border border-white/20 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="postsLoading"
              class="px-4 py-2 bg-[#31B4E7] hover:bg-[#2A9BC7] text-white rounded-md transition-colors disabled:opacity-50"
            >
              {{ postsLoading ? 'Actualizando...' : 'Actualizar Publicación' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 w-full max-w-md">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100/10 mb-4">
            <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            Confirmar eliminación
          </h3>
          <p class="text-sm text-white/80 mb-6">
            ¿Estás seguro de que quieres eliminar <strong class="text-white">{{ deleteConfirmPost?.title }}</strong>?
          </p>
          <p class="text-xs text-white/60 mb-6">
            Esta acción no se puede deshacer.
          </p>
          <div class="flex space-x-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 border border-white/20 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              :disabled="postsLoading"
              class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {{ postsLoading ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Middleware para proteger la ruta
definePageMeta({
  middleware: 'auth-editor'
})

useHead({
  title: 'Editor - Alianza La Libertad Avanza',
  meta: [
    { name: 'description', content: 'Panel de editor del sitio oficial' }
  ]
});

const { user, signOut, loading } = useAuth()
const { createPost, updatePost, loading: postsLoading, getPosts } = usePosts()

// Estado de carga inicial
const pageLoading = ref(true)

// Cargar posts desde Supabase
const posts = ref([])
const postsError = ref(null)

// Función para cargar posts
const loadPosts = async () => {
  const result = await getPosts()
  if (result.success) {
    posts.value = result.posts
  } else {
    postsError.value = result.error
  }
}

// Cargar posts al montar la página
onMounted(async () => {
  await loadPosts()
  pageLoading.value = false
  
  // Timeout de seguridad para evitar que se cuelgue
  setTimeout(() => {
    pageLoading.value = false
  }, 5000)
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const deleteConfirmPost = ref(null)
const successMessage = ref('')
const showSuccessMessage = ref(false)
const newPost = ref({
  title: '',
  content: '',
  type: 'COMUNICADO',
  category: 'general',
  status: 'draft',
  date: new Date().toISOString().split('T')[0],
  firmante: 'Alianza La Libertad Avanza'
})
const editingPost = ref({
  id: null,
  title: '',
  content: '',
  type: 'COMUNICADO',
  category: 'general',
  date: '',
  firmante: 'Alianza La Libertad Avanza'
})

const formatDate = (date) => {
  if (!date) return '';
  try {
    // Crear la fecha en la zona horaria local para evitar problemas de UTC
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
    
    return dateObj.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return date;
  }
}

const showSuccess = (message) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const handleLogout = async () => {
  const result = await signOut()
  if (result.success) {
    await navigateTo('/login')
  }
}

const handleCreatePost = async () => {
  const result = await createPost(newPost.value)
  
  if (result.success) {
    showCreateModal.value = false
    // Resetear el formulario
    newPost.value = {
      title: '',
      content: '',
      type: 'COMUNICADO',
      category: 'general',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      firmante: 'Alianza La Libertad Avanza'
    }
    // Refrescar la lista de posts
    await loadPosts()
    showSuccess('✅ Publicación creada exitosamente')
  } else {
    // Mostrar error más descriptivo
    if (result.error.includes('no autenticado')) {
      alert('Error de autenticación: ' + result.error + '\n\nSerás redirigido al login.')
      await navigateTo('/login')
    } else {
      alert('Error al crear la publicación: ' + result.error)
    }
  }
}

const handleEditPost = (post) => {
  editingPost.value = {
    id: post.id,
    title: post.title,
    content: post.content,
    type: post.type,
    category: post.category,
    date: post.date,
    firmante: post.firmante
  }
  showEditModal.value = true
}

const handleUpdatePost = async () => {
  const result = await updatePost(editingPost.value.id, editingPost.value)
  
  if (result.success) {
    showEditModal.value = false
    // Refrescar la lista de posts
    await loadPosts()
    showSuccess('✅ Publicación actualizada exitosamente')
  } else {
    if (result.error.includes('no autenticado')) {
      alert('Error de autenticación: ' + result.error + '\n\nSerás redirigido al login.')
      await navigateTo('/login')
    } else {
      alert('Error al actualizar la publicación: ' + result.error)
    }
  }
}

const handleDeletePost = (post) => {
  deleteConfirmPost.value = post
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  const result = await deletePost(deleteConfirmPost.value.id)
  
  if (result.success) {
    showDeleteModal.value = false
    deleteConfirmPost.value = null
    // Refrescar la lista de posts
    await loadPosts()
    showSuccess('✅ Publicación eliminada exitosamente')
  } else {
    if (result.error.includes('no autenticado')) {
      alert('Error de autenticación: ' + result.error + '\n\nSerás redirigido al login.')
      await navigateTo('/login')
    } else {
      alert('Error al eliminar la publicación: ' + result.error)
    }
  }
}
</script>
