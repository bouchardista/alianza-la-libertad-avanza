<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700">
    <!-- Header -->
    <header class="bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row justify-between items-center py-4 space-y-4 lg:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <NuxtLink to="/" class="block hover:opacity-80 transition-opacity bg-transparent">
                <img src="/white-logo.png?v=2" alt="Logo" class="h-16 w-16 object-contain bg-transparent" />
              </NuxtLink>
            </div>
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold text-white">Panel Administrativo</h1>
              <p class="text-white/60 text-sm">Alianza La Libertad Avanza</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              @click="openModal"
              class="bg-[#31B4E7] hover:bg-[#2A9FD8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Crear Publicación
            </button>
            <NuxtLink
              to="/"
              class="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Volver al sitio
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/60 text-sm">Publicadas</p>
              <p class="text-2xl font-bold text-white">{{ stats.published }}</p>
            </div>
            <div class="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:document-text" class="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div class="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/60 text-sm">Borradores</p>
              <p class="text-2xl font-bold text-white">{{ stats.drafts }}</p>
            </div>
            <div class="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:document-text" class="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div class="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/60 text-sm">Resoluciones</p>
              <p class="text-2xl font-bold text-white">{{ stats.resolutions }}</p>
            </div>
            <div class="h-8 w-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:megaphone" class="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div class="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/60 text-sm">Comunicados</p>
              <p class="text-2xl font-bold text-white">{{ stats.communications }}</p>
            </div>
            <div class="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:megaphone" class="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
        <h2 class="text-xl font-semibold text-white">Filtros</h2>
        <div class="flex flex-wrap gap-3">
          <button
            @click="activeFilter = 'all'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === 'all'
                ? 'bg-[#31B4E7] text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            ]"
          >
            Todas
          </button>
          <button
            @click="activeFilter = 'published'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === 'published'
                ? 'bg-[#31B4E7] text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            ]"
          >
            Publicadas
          </button>
          <button
            @click="activeFilter = 'draft'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === 'draft'
                ? 'bg-[#31B4E7] text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            ]"
          >
            Borradores
          </button>
          <button
            @click="activeFilter = 'resolution'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === 'resolution'
                ? 'bg-[#31B4E7] text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            ]"
          >
            Resoluciones
          </button>
          <button
            @click="activeFilter = 'communication'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === 'communication'
                ? 'bg-[#31B4E7] text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            ]"
          >
            Comunicados
          </button>
        </div>
      </div>

      <!-- Lista de Posts -->
      <div class="bg-white/0 backdrop-blur-sm rounded-lg p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p class="text-white/60 mt-2">Cargando posts...</p>
        </div>
        
        <div v-else-if="filteredPosts.length === 0" class="text-center py-8">
          <p class="text-white/60">No hay posts que coincidan con el filtro seleccionado.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-white hover:text-white/80 transition-colors cursor-pointer">
                  {{ post.title }}
                </h3>
                <p class="text-white/60 text-sm mt-1">{{ formatDate(post.date) }}</p>
                <p class="text-white/80 text-sm mt-2 line-clamp-2">{{ post.content }}</p>
              </div>
              
              <div class="flex items-center space-x-3 ml-4">
                <!-- Pill de tipo y estado -->
                <div class="flex items-center">
                  <badge
                    :label="`${post.type} ${post.status === 'published' ? 'Publicado' : 'Borrador'}`"
                    :badge-class="post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'"
                    :icon-class="post.type === 'Resolución' ? 'text-violet-400' : 'text-blue-400'"
                  />
                </div>
                
                <!-- Botón de editar -->
                <button
                  @click="handleEditPost(post)"
                  class="text-white hover:text-white/80 transition-colors"
                >
                  <Icon name="heroicons:pencil" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Crear/Editar Post -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">
              {{ editingPost ? 'Editar Post' : 'Crear Publicación' }}
            </h2>
            <button
              @click="closeModal"
              class="text-white/60 hover:text-white transition-colors"
            >
              <Icon name="heroicons:x-mark" class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Campos del formulario -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-white/80 text-sm font-medium mb-2">Fecha</label>
                <input
                  v-model="newPost.date"
                  type="date"
                  required
                  disabled
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white/60 cursor-not-allowed"
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-white/80 text-sm font-medium mb-2">Firmante</label>
                <input
                  v-model="newPost.firmante"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
                  placeholder="Nombre del firmante"
                />
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-white/80 text-sm font-medium mb-2">Título</label>
              <input
                v-model="newPost.title"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
                placeholder="Título del post"
              />
            </div>

            <div class="mb-6">
              <label class="block text-white/80 text-sm font-medium mb-2">Tipo</label>
              <select
                v-model="newPost.type"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
              >
                <option value="">Seleccionar tipo</option>
                <option value="Resolución">Resolución</option>
                <option value="Comunicado">Comunicado</option>
              </select>
            </div>

            <div class="mb-6">
              <label class="block text-white/80 text-sm font-medium mb-2">Contenido</label>
              <textarea
                v-model="newPost.content"
                required
                rows="8"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#31B4E7] focus:border-transparent"
                placeholder="Contenido del post (Markdown)"
              ></textarea>
            </div>

            <!-- Sección de archivos adjuntos -->
            <div class="mb-6">
              <label class="block text-white/80 text-sm font-medium mb-2">Archivos Adjuntos</label>
              <div class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <div class="space-y-4">
                  <Icon name="heroicons:cloud-arrow-up" class="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p class="text-white/80">Haz clic para subir o arrastra archivos aquí</p>
                    <p class="text-white/60 text-sm">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, WEBP (máx. 50MB cada uno)</p>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    @change="handleFileSelect"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="bg-[#31B4E7] hover:bg-[#2A9FD8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Seleccionar archivos
                  </button>
                </div>
              </div>
            </div>

            <!-- Archivos seleccionados -->
            <div v-if="selectedFiles.length > 0" class="mb-6">
              <h4 class="text-white/80 text-sm font-medium mb-2">Archivos seleccionados:</h4>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                >
                  <div class="flex items-center space-x-3">
                    <Icon name="heroicons:document" class="h-5 w-5 text-white/60" />
                    <span class="text-white text-sm">{{ file.name }}</span>
                    <span class="text-white/60 text-xs">({{ formatFileSize(file.size) }})</span>
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Icon name="heroicons:x-mark" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="bg-[#31B4E7] hover:bg-[#2A9FD8] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Guardando...' : (editingPost ? 'Actualizar' : 'Crear Publicación') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

// Composables
const { createPost, updatePost, getPosts } = usePosts()
const { uploadFiles, deleteFile } = useSupabaseStorage()

// Estado
const loading = ref(true)
const posts = ref([])
const stats = ref({
  published: 0,
  drafts: 0,
  resolutions: 0,
  communications: 0
})
const activeFilter = ref('all')
const showModal = ref(false)
const editingPost = ref(null)
const submitting = ref(false)
const selectedFiles = ref([])

// Formulario
const newPost = ref({
  title: '',
  content: '',
  type: '',
  date: new Date().toISOString().split('T')[0],
  firmante: '',
  status: 'published'
})

// Computed
const filteredPosts = computed(() => {
  let filtered = posts.value

  switch (activeFilter.value) {
    case 'published':
      filtered = filtered.filter(post => post.status === 'published')
      break
    case 'draft':
      filtered = filtered.filter(post => post.status === 'draft')
      break
    case 'resolution':
      filtered = filtered.filter(post => post.type === 'Resolución')
      break
    case 'communication':
      filtered = filtered.filter(post => post.type === 'Comunicado')
      break
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Métodos
const loadPosts = async () => {
  try {
    loading.value = true
    const data = await getPosts()
    posts.value = data || []
    
    // Calcular estadísticas
    stats.value = {
      published: posts.value.filter(p => p.status === 'published').length,
      drafts: posts.value.filter(p => p.status === 'draft').length,
      resolutions: posts.value.filter(p => p.type === 'Resolución').length,
      communications: posts.value.filter(p => p.type === 'Comunicado').length
    }
  } catch (error) {
    console.error('Error cargando posts:', error)
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  showModal.value = true
  editingPost.value = null
  resetForm()
}

const closeModal = () => {
  showModal.value = false
  editingPost.value = null
  resetForm()
}

const resetForm = () => {
  newPost.value = {
    title: '',
    content: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    firmante: '',
    status: 'published'
  }
  selectedFiles.value = []
}

const handleEditPost = (post) => {
  editingPost.value = post
  newPost.value = {
    title: post.title,
    content: post.content,
    type: post.type,
    date: post.date,
    firmante: post.firmante,
    status: post.status
  }
  showModal.value = true
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  const maxSize = 50 * 1024 * 1024 // 50MB
  
  files.forEach(file => {
    if (file.size > maxSize) {
      alert(`El archivo ${file.name} excede el tamaño máximo de 50MB`)
      return
    }
    selectedFiles.value.push(file)
  })
  
  event.target.value = ''
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    
    // Subir archivos si hay
    let attachments = []
    if (selectedFiles.value.length > 0) {
      attachments = await uploadFiles(selectedFiles.value)
    }
    
    const postData = {
      ...newPost.value,
      attachments
    }
    
    if (editingPost.value) {
      await updatePost(editingPost.value.id, postData)
    } else {
      await createPost(postData)
    }
    
    await loadPosts()
    closeModal()
    
  } catch (error) {
    console.error('Error guardando post:', error)
    alert('Error al guardar el post')
  } finally {
    submitting.value = false
  }
}

const handleLogout = async () => {
  try {
    const client = useSupabaseClient()
    await client.auth.signOut()
    await navigateTo('/admin/secure-login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Cargar posts al montar
onMounted(() => {
  loadPosts()
})
</script>
