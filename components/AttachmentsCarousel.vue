<template>
  <div v-if="attachments && attachments.length > 0" class="mt-8">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <Icon name="heroicons:paper-clip" class="w-5 h-5 mr-2" />
      Archivos adjuntos
    </h3>
    
    <div class="relative">
      <!-- Carrusel container -->
      <div 
        ref="carouselContainer"
        class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        :class="{
          'snap-x snap-mandatory': isMobile
        }"
      >
        <div 
          v-for="(attachment, index) in attachments" 
          :key="attachment.id"
          class="flex-shrink-0"
          :class="{
            'w-full snap-center': isMobile,
            'w-1/4': !isMobile
          }"
        >
          <!-- Tarjeta de archivo -->
          <div 
            class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-200 cursor-pointer group"
            @click="openFile(attachment)"
          >
            <!-- Preview de imagen -->
            <div v-if="isImage(attachment.file_type)" class="mb-3">
              <img 
                :src="attachment.storage_url" 
                :alt="attachment.file_name"
                class="w-full h-32 object-cover rounded-md"
                @error="handleImageError"
              />
            </div>
            
            <!-- Preview de PDF -->
            <div v-else-if="isPDF(attachment.file_type)" class="mb-3">
              <div class="w-full h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-md flex items-center justify-center relative overflow-hidden border border-red-200">
                <!-- Icono de PDF con fondo decorativo -->
                <div class="text-center">
                  <Icon 
                    name="heroicons:document-text" 
                    class="w-12 h-12 text-red-500 mx-auto mb-2" 
                  />
                  <div class="text-red-600 text-xs font-medium">PDF</div>
                </div>
                <!-- Decoración de esquina -->
                <div class="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-red-400"></div>
              </div>
            </div>
            
            <!-- Icono para otros documentos -->
            <div v-else class="mb-3 flex justify-center">
              <div class="w-full h-32 flex items-center justify-center rounded-lg bg-white/10">
                <Icon 
                  :name="getFileTypeInfo(attachment.file_type).icon" 
                  :class="getFileTypeInfo(attachment.file_type).color"
                  class="w-12 h-12" 
                />
              </div>
            </div>
            
            <!-- Información del archivo -->
            <div class="text-center">
              <p class="text-white text-sm font-medium truncate mb-1">
                {{ attachment.file_name }}
              </p>
              <div class="flex items-center justify-center space-x-2 text-xs text-white/70">
                <span class="px-2 py-1 bg-white/10 rounded-full">
                  {{ getFileTypeInfo(attachment.file_type).type }}
                </span>
                <span>{{ formatFileSize(attachment.file_size) }}</span>
              </div>
            </div>
            
            <!-- Overlay hover -->
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:arrow-top-right-on-square" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botones de navegación (solo en desktop) -->
      <div v-if="!isMobile && attachments.length > 2" class="absolute top-1/2 -translate-y-1/2 left-0 z-10">
        <button 
          @click="scrollLeft"
          class="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <Icon name="heroicons:chevron-left" class="w-5 h-5" />
        </button>
      </div>
      
      <div v-if="!isMobile && attachments.length > 2" class="absolute top-1/2 -translate-y-1/2 right-0 z-10">
        <button 
          @click="scrollRight"
          class="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <Icon name="heroicons:chevron-right" class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <!-- Indicadores de página (solo en mobile) -->
    <div v-if="isMobile && attachments.length > 1" class="flex justify-center mt-4 space-x-2">
      <button 
        v-for="(_, index) in attachments" 
        :key="index"
        @click="scrollToIndex(index)"
        class="w-2 h-2 rounded-full transition-colors"
        :class="currentIndex === index ? 'bg-white' : 'bg-white/30'"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  attachments: {
    type: Array,
    default: () => []
  }
})

const carouselContainer = ref(null)
const currentIndex = ref(0)
const isMobile = ref(false)

// Detectar si es mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Agregar event listener para scroll
  if (carouselContainer.value) {
    carouselContainer.value.addEventListener('scroll', updateCurrentIndex)
  }
})

// Función para abrir archivo
const openFile = (attachment) => {
  if (attachment.storage_url) {
    window.open(attachment.storage_url, '_blank')
  }
}

// Función para manejar error de imagen
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// Función para obtener información del tipo de archivo
const getFileTypeInfo = (mimeType) => {
  const typeMap = {
    'application/pdf': { type: 'PDF', icon: 'heroicons:document-text', color: 'text-red-500' },
    'application/msword': { type: 'DOC', icon: 'heroicons:document', color: 'text-blue-500' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'DOCX', icon: 'heroicons:document', color: 'text-blue-500' },
    'application/vnd.ms-excel': { type: 'XLS', icon: 'heroicons:table-cells', color: 'text-green-500' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { type: 'XLSX', icon: 'heroicons:table-cells', color: 'text-green-500' },
    'application/vnd.ms-powerpoint': { type: 'PPT', icon: 'heroicons:presentation-chart-bar', color: 'text-orange-500' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { type: 'PPTX', icon: 'heroicons:presentation-chart-bar', color: 'text-orange-500' },
    'image/jpeg': { type: 'JPG', icon: 'heroicons:photo', color: 'text-purple-500' },
    'image/png': { type: 'PNG', icon: 'heroicons:photo', color: 'text-purple-500' },
    'image/gif': { type: 'GIF', icon: 'heroicons:photo', color: 'text-purple-500' },
    'image/webp': { type: 'WEBP', icon: 'heroicons:photo', color: 'text-purple-500' }
  }

  return typeMap[mimeType] || { type: 'ARCHIVO', icon: 'heroicons:document', color: 'text-gray-500' }
}

// Función para formatear tamaño de archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Función para verificar si es imagen
const isImage = (mimeType) => {
  return mimeType.startsWith('image/')
}

// Función para verificar si es PDF
const isPDF = (mimeType) => {
  return mimeType === 'application/pdf'
}

// Funciones de navegación del carrusel infinito
const scrollLeft = () => {
  if (carouselContainer.value) {
    const container = carouselContainer.value
    const scrollLeft = container.scrollLeft
    const itemWidth = container.scrollWidth / props.attachments.length
    
    // Si estamos al inicio, ir al final
    if (scrollLeft <= 0) {
      const lastItemPosition = (props.attachments.length - 1) * itemWidth
      container.scrollTo({ left: lastItemPosition, behavior: 'smooth' })
    } else {
      // Ir al elemento anterior
      container.scrollBy({ left: -itemWidth, behavior: 'smooth' })
    }
  }
}

const scrollRight = () => {
  if (carouselContainer.value) {
    const container = carouselContainer.value
    const scrollLeft = container.scrollLeft
    const itemWidth = container.scrollWidth / props.attachments.length
    const maxScroll = container.scrollWidth - container.clientWidth
    
    // Si estamos al final, ir al inicio
    if (scrollLeft >= maxScroll) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      // Ir al elemento siguiente
      container.scrollBy({ left: itemWidth, behavior: 'smooth' })
    }
  }
}

const scrollToIndex = (index) => {
  if (carouselContainer.value) {
    const itemWidth = carouselContainer.value.scrollWidth / props.attachments.length
    carouselContainer.value.scrollTo({ left: index * itemWidth, behavior: 'smooth' })
    currentIndex.value = index
  }
}

// Observar cambios en el scroll para actualizar indicadores
const updateCurrentIndex = () => {
  if (carouselContainer.value) {
    const container = carouselContainer.value
    const scrollLeft = container.scrollLeft
    const itemWidth = container.scrollWidth / props.attachments.length
    
    // Calcular el índice actual
    let newIndex = Math.round(scrollLeft / itemWidth)
    
    // Asegurar que el índice esté dentro del rango válido
    if (newIndex < 0) newIndex = 0
    if (newIndex >= props.attachments.length) newIndex = props.attachments.length - 1
    
    currentIndex.value = newIndex
  }
}



// Limpiar event listeners
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (carouselContainer.value) {
    carouselContainer.value.removeEventListener('scroll', updateCurrentIndex)
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
