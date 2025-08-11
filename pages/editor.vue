<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1A043C] to-[#371859]">
    <!-- Mensaje de éxito -->
    <div v-if="showSuccessMessage" class="fixed top-4 right-4 z-50">
      <div :class="[
        'backdrop-blur-sm border rounded-lg p-4 shadow-lg',
        successMessage.includes('Borrador') 
          ? 'bg-yellow-500/90 border-yellow-400/20' 
          : 'bg-green-500/90 border-green-400/20'
      ]">
        <div class="flex items-center">
          <Icon 
            :name="successMessage.includes('Borrador') ? 'heroicons:document-text' : 'heroicons:check-circle'" 
            :class="[
              'h-5 w-5 mr-2',
              successMessage.includes('Borrador') ? 'text-yellow-100' : 'text-green-100'
            ]" 
          />
          <p :class="[
            'font-medium',
            successMessage.includes('Borrador') ? 'text-yellow-100' : 'text-green-100'
          ]">{{ successMessage }}</p>
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
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <NuxtLink to="/" class="block hover:opacity-80 transition-opacity bg-transparent">
                <img src="/white-logo.png" alt="Logo" class="h-16 w-16 object-contain bg-transparent" />
              </NuxtLink>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">
                Panel de Editor
              </h1>
              <p class="text-sm text-white/80 mt-1">
                Alianza La Libertad Avanza Córdoba
              </p>
              <p v-if="user" class="text-xs text-white/60 mt-1">
                Conectado como: {{ user.name }} ({{ user.role }})
              </p>
            </div>
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
      <div v-if="pageLoading" class="flex justify-center items-center min-h-[60vh]">
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
                <Icon name="heroicons:calendar" class="h-8 w-8 text-white" />
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
            <div v-for="post in posts" :key="post.id" class="px-6 py-4">
                                <div class="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-base sm:text-lg font-medium text-white truncate">
                        <a 
                          v-if="post.status === 'published'"
                          :href="`/posts/${generateSlug(post.title)}`"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-white hover:text-[#31B4E7] underline transition-colors cursor-pointer"
                        >
                          {{ post.title }}
                        </a>
                        <span v-else class="text-white">{{ post.title }}</span>
                      </h3>
                      <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                        <span class="text-sm text-white/60">{{ formatDate(post.date) }}</span>
                        <span class="text-sm text-white/60 truncate">{{ post.firmante }}</span>
                        <span v-if="post.status === 'draft'" class="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                          Borrador
                        </span>
                        <span v-else class="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          Publicado
                        </span>
                      </div>
                    </div>
                    <div class="flex items-end space-x-2">
                      <button 
                        v-if="post.status === 'draft'"
                        @click="handleRequestPublication(post)"
                        :disabled="disabledButtons.has(post.id)"
                        :class="[
                          'inline-flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
                          disabledButtons.has(post.id)
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        ]"
                        title="Solicitar publicación"
                      >
                        <Icon name="heroicons:paper-airplane" class="w-4 h-4" />
                        <span>{{ disabledButtons.has(post.id) ? 'Enviando...' : 'Solicitar su Publicación' }}</span>
                      </button>
                      <button 
                        @click="handleEditPost(post)"
                        class="text-[#31B4E7] hover:text-[#2A9BC7] transition-colors p-1"
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
      <div class="bg-gray-900 rounded-lg border border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7]"
              placeholder="Título de la publicación"
            />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Tipo</label>
              <select
                v-model="newPost.type"
                required
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7]"
              >
                <option value="RESOLUCIÓN">Resolución</option>
                <option value="COMUNICADO">Comunicado</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Categoría</label>
              <input
                value="General"
                type="text"
                disabled
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white/60 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Estado</label>
            <div class="w-full px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-md text-blue-300 text-sm">
              <Icon name="heroicons:information-circle" class="w-4 h-4 inline mr-2" />
              Crea tu contenido y luego solicita publicación. Los administradores revisarán y aprobarán el contenido.
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Contenido</label>
            <MarkdownEditor
              v-model="newPost.content"
              placeholder="Escribe el contenido de la publicación en Markdown..."
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Fecha</label>
              <input
                v-model="newPost.date"
                type="date"
                required
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7]"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Firmante</label>
              <input
                value="Alianza La Libertad Avanza Córdoba"
                type="text"
                disabled
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white/60 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Archivos adjuntos</label>
            <div 
              ref="dropZone"
              class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-colors"
              :class="{ 'border-[#31B4E7] bg-[#31B4E7]/10': isDragOver }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                @change="handleFileUpload"
                class="hidden"
              />
              <div class="space-y-4">
                <Icon name="heroicons:cloud-arrow-up" class="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p class="text-white text-sm">
                    <button 
                      type="button"
                      @click="$refs.fileInput.click()"
                      class="text-[#31B4E7] hover:text-[#2A9BC7] font-medium"
                    >
                      Haz clic para subir
                    </button>
                    o arrastra archivos aquí
                  </p>
                  <p class="text-gray-400 text-xs mt-1">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, WEBP (máx. 10MB cada uno)
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Lista de archivos seleccionados -->
            <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <Icon name="heroicons:document" class="w-5 h-5 text-gray-400" />
                  <div>
                    <p class="text-white text-sm font-medium">{{ file.name }}</p>
                    <p class="text-gray-400 text-xs">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="removeFile(index)"
                  class="text-red-400 hover:text-red-300"
                >
                  <Icon name="heroicons:x-mark" class="w-5 h-5" />
                </button>
              </div>
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
              {{ postsLoading ? 'Creando...' : 'Crear Borrador' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para editar publicación -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-lg border border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7]"
              placeholder="Título de la publicación"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Tipo</label>
              <select
                v-model="editingPost.type"
                required
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7]"
              >
                <option value="RESOLUCIÓN">Resolución</option>
                <option value="COMUNICADO">Comunicado</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Categoría</label>
              <input
                value="General"
                type="text"
                disabled
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white/60 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Contenido</label>
            <MarkdownEditor
              v-model="editingPost.content"
              placeholder="Escribe el contenido de la publicación en Markdown..."
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Fecha</label>
              <input
                v-model="editingPost.date"
                type="date"
                required
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7]"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white mb-2">Firmante</label>
              <input
                value="Alianza La Libertad Avanza Córdoba"
                type="text"
                disabled
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white/60 cursor-not-allowed"
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
              {{ postsLoading ? 'Actualizando...' : 'Actualizar Borrador' }}
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
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
// Middleware para proteger la ruta
definePageMeta({
  middleware: 'auth-editor'
})

useHead({
  title: 'Editor - Alianza La Libertad Avanza Córdoba',
  meta: [
    { name: 'description', content: 'Panel de editor del sitio oficial' }
  ]
});

const { user, signOut, loading } = useAuth()
const { createPost, updatePost, requestPublication, loading: postsLoading, getPosts } = usePosts()
const { uploadToStorage, addAttachment, deleteAttachment, getPostAttachments } = useSupabaseStorage()
const { generateSlug } = useSlug()

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
  firmante: 'Alianza La Libertad Avanza Córdoba'
})

// Estado para archivos seleccionados
const selectedFiles = ref([])
const isDragOver = ref(false)

// Estado para botones deshabilitados
const disabledButtons = ref(new Set())
const editingPost = ref({
  id: null,
  title: '',
  content: '',
  type: 'COMUNICADO',
  category: 'general',
  date: '',
  firmante: 'Alianza La Libertad Avanza Córdoba'
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
  // Forzar que sea borrador para editores
  const postData = { ...newPost.value, status: 'draft' }
  const result = await createPost(postData)
  
  if (result.success) {
    // Subir archivos si hay alguno seleccionado
    if (selectedFiles.value.length > 0) {
      await uploadFilesToPost(result.post.id)
    }
    
    showCreateModal.value = false
    // Resetear el formulario
    newPost.value = {
      title: '',
      content: '',
      type: 'COMUNICADO',
      category: 'general',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      firmante: 'Alianza La Libertad Avanza Córdoba'
    }
    // Limpiar archivos seleccionados
    selectedFiles.value = []
    // Refrescar la lista de posts
    await loadPosts()
    showSuccess('✅ Borrador creado exitosamente')
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
    showSuccess('✅ Borrador actualizado exitosamente')
  } else {
    if (result.error.includes('no autenticado')) {
      alert('Error de autenticación: ' + result.error + '\n\nSerás redirigido al login.')
      await navigateTo('/login')
    } else {
      alert('Error al actualizar la publicación: ' + result.error)
    }
  }
}

const handleRequestPublication = async (post) => {
  // Deshabilitar el botón inmediatamente
  disabledButtons.value.add(post.id)
  
  const result = await requestPublication(post.id)
  
  if (result.success) {
    // Refrescar la lista de posts
    await loadPosts()
    showSuccess('✅ Solicitud de publicación enviada. Los administradores la revisarán.')
  } else {
    // Re-habilitar el botón si hay error
    disabledButtons.value.delete(post.id)
    alert('Error al solicitar publicación: ' + result.error)
  }
}

// Funciones para manejar archivos
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  addValidFiles(files)
  event.target.value = '' // Limpiar input
}

const addValidFiles = (files) => {
  // Validar tamaño máximo (10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  const validFiles = files.filter(file => {
    if (file.size > maxSize) {
      alert(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`)
      return false
    }
    return true
  })
  
  selectedFiles.value.push(...validFiles)
}

// Funciones para drag & drop
const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(event.dataTransfer.files)
  addValidFiles(files)
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Función para subir archivos a Supabase Storage y agregarlos al post
const uploadFilesToPost = async (postId) => {
  console.log('🚀 Iniciando subida de archivos para post:', postId)
  console.log('📁 Archivos seleccionados:', selectedFiles.value.length)
  
  if (selectedFiles.value.length === 0) {
    console.log('📭 No hay archivos para subir')
    return
  }
  
  for (const file of selectedFiles.value) {
    try {
      console.log('📤 Subiendo archivo:', file.name, 'Tamaño:', file.size)
      
      // Subir a Supabase Storage
      const uploadResult = await uploadToStorage(file, postId)
      console.log('📋 Resultado de subida a Storage:', uploadResult)
      
      if (uploadResult.success) {
        console.log('✅ Archivo subido a Storage exitosamente')
        console.log('📎 Agregando como adjunto al post...')
        
        // Agregar como adjunto al post
        const attachmentResult = await addAttachment(postId, uploadResult.fileData)
        console.log('📋 Resultado de agregar adjunto:', attachmentResult)
        
        if (attachmentResult.success) {
          console.log('✅ Adjunto agregado exitosamente')
        } else {
          console.error('❌ Error al agregar adjunto:', attachmentResult.error)
        }
      } else {
        console.error('❌ Error al subir archivo a Storage:', uploadResult.error)
      }
    } catch (error) {
      console.error('❌ Error general al subir archivo:', error)
    }
  }
  
  console.log('🏁 Proceso de subida completado')
}
</script>
