<template>
  <div class="markdown-editor">
    <!-- Pestañas -->
    <div class="flex border-b border-gray-600 mb-4">
      <button
        @click="activeTab = 'edit'"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors',
          activeTab === 'edit'
            ? 'text-[#31B4E7] border-b-2 border-[#31B4E7]'
            : 'text-gray-400 hover:text-white'
        ]"
      >
        <Icon name="heroicons:pencil" class="w-4 h-4 inline mr-2" />
        Editar
      </button>
      <button
        @click="activeTab = 'preview'"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors',
          activeTab === 'preview'
            ? 'text-[#31B4E7] border-b-2 border-[#31B4E7]'
            : 'text-gray-400 hover:text-white'
        ]"
      >
        <Icon name="heroicons:eye" class="w-4 h-4 inline mr-2" />
        Vista Previa
      </button>
      <button
        @click="activeTab = 'split'"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors',
          activeTab === 'split'
            ? 'text-[#31B4E7] border-b-2 border-[#31B4E7]'
            : 'text-gray-400 hover:text-white'
        ]"
      >
        <Icon name="heroicons:arrows-right-left" class="w-4 h-4 inline mr-2" />
        Dividido
      </button>
    </div>

    <!-- Contenido del editor -->
    <div class="editor-content">
      <!-- Modo Editar -->
      <div v-if="activeTab === 'edit'" class="w-full">
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7] font-mono text-sm resize-none"
          :placeholder="placeholder"
        ></textarea>
      </div>

      <!-- Modo Vista Previa -->
      <div v-else-if="activeTab === 'preview'" class="w-full">
        <div class="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-600 rounded-md overflow-y-auto">
          <div v-if="modelValue.trim()" class="prose prose-invert prose-sm max-w-none">
            <div v-html="renderedMarkdown"></div>
          </div>
          <div v-else class="text-gray-400 text-center py-8">
            <Icon name="heroicons:document-text" class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay contenido para previsualizar</p>
            <p class="text-sm">Escribe algo en el modo "Editar" para ver la vista previa</p>
          </div>
        </div>
      </div>

      <!-- Modo Dividido -->
      <div v-else-if="activeTab === 'split'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Editor</label>
          <textarea
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31B4E7] focus:border-[#31B4E7] font-mono text-sm resize-none"
            :placeholder="placeholder"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Vista Previa</label>
          <div class="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-600 rounded-md overflow-y-auto">
            <div v-if="modelValue.trim()" class="prose prose-invert prose-sm max-w-none">
              <div v-html="renderedMarkdown"></div>
            </div>
            <div v-else class="text-gray-400 text-center py-8">
              <Icon name="heroicons:document-text" class="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p class="text-sm">Sin contenido</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de herramientas -->
    <div class="mt-4 p-3 bg-gray-800/50 rounded-md border border-gray-600">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          @click="insertMarkdown('**', '**')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Negrita"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          @click="insertMarkdown('*', '*')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Cursiva"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          @click="insertMarkdown('### ', '')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Título H3"
        >
          H3
        </button>
        <button
          type="button"
          @click="insertMarkdown('## ', '')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Título H2"
        >
          H2
        </button>
        <button
          type="button"
          @click="insertMarkdown('# ', '')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Título H1"
        >
          H1
        </button>
        <button
          type="button"
          @click="insertMarkdown('- ', '')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Lista"
        >
          •
        </button>
        <button
          type="button"
          @click="insertMarkdown('[', '](url)')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Enlace"
        >
          🔗
        </button>
        <button
          type="button"
          @click="insertMarkdown('> ', '')"
          class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Cita"
        >
          "
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Escribe tu contenido en Markdown...'
  }
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref('edit')

// Configurar marked para renderizar HTML de forma segura
marked.setOptions({
  breaks: true,
  gfm: true
})

// Renderizar markdown
const renderedMarkdown = computed(() => {
  if (!props.modelValue.trim()) return ''
  try {
    return marked(props.modelValue)
  } catch (error) {
    console.error('Error rendering markdown:', error)
    return props.modelValue
  }
})

// Función para insertar markdown en el cursor
const insertMarkdown = (before, after) => {
  const textarea = document.querySelector('.markdown-editor textarea')
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = props.modelValue.substring(start, end)
  
  const newText = props.modelValue.substring(0, start) + 
                  before + selectedText + after + 
                  props.modelValue.substring(end)
  
  emit('update:modelValue', newText)
  
  // Restaurar el foco y la selección
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(
      start + before.length,
      end + before.length
    )
  })
}
</script>

<style scoped>
.markdown-editor {
  @apply w-full;
}

.prose {
  @apply text-white;
}

.prose h1 {
  @apply text-2xl font-bold text-white mb-4;
}

.prose h2 {
  @apply text-xl font-bold text-white mb-3;
}

.prose h3 {
  @apply text-lg font-bold text-white mb-2;
}

.prose p {
  @apply text-white/90 mb-3;
}

.prose ul {
  @apply list-disc list-inside text-white/90 mb-3;
}

.prose ol {
  @apply list-decimal list-inside text-white/90 mb-3;
}

.prose strong {
  @apply font-bold text-white;
}

.prose em {
  @apply italic text-white/90;
}

.prose a {
  @apply text-[#31B4E7] hover:text-[#2A9BC7] underline;
}

.prose blockquote {
  @apply border-l-4 border-[#31B4E7] pl-4 italic text-white/80;
}
</style>
