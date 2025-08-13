<template>
  <article class="md:flex overflow-hidden" v-if="content">
    <h2 class="content-date h-full mt-px">
      <span>{{ formatDate(content.date) }}</span>
    </h2>
    <div class="content-block min-w-0">
      <div class="feed-border"></div>
      <div class="feed-dot"></div>
      <div class="absolute -top-6 right-0 md:static mb-4 flex items-center justify-end md:justify-start">
        <!-- Clip a la izquierda en mobile (solo en vista previa) -->
        <NuxtLink 
          v-if="attachments.length > 0 && isPreview"
          :to="`/posts/${generateSlug(content.title)}`"
          class="text-white hover:text-[#EFB141] transition-colors cursor-pointer mr-2 md:hidden"
        >
          <Icon 
            name="heroicons:paper-clip" 
            class="h-4 w-4" 
          />
        </NuxtLink>
        
        <badge
          v-if="content.type"
          :label="content.type"
          :badge-class="getBadgeClass(content.type)"
          :icon-class="getIconClass(content.type)"
        />
        
        <!-- Clip a la derecha en desktop/tablet (solo en vista previa) -->
        <NuxtLink 
          v-if="attachments.length > 0 && isPreview"
          :to="`/posts/${generateSlug(content.title)}`"
          class="text-white hover:text-[#EFB141] transition-colors cursor-pointer ml-2 hidden md:block"
        >
          <Icon 
            name="heroicons:paper-clip" 
            class="h-4 w-4" 
          />
        </NuxtLink>
      </div>
      <h1 v-if="content.title" class="text-xl sm:text-3xl font-bold mb-4">
        <NuxtLink 
          v-if="isPreview"
          :to="`/posts/${generateSlug(content.title)}`"
          class="text-white hover:text-white transition-colors cursor-pointer title-link"
        >
          {{ content.title }}
        </NuxtLink>
        <span v-else class="text-white">
          {{ content.title }}
        </span>
      </h1>

      <div class="document prose prose-invert prose-sm max-w-none">
        <NuxtLink 
          v-if="isPreview && content.content"
          :to="`/posts/${generateSlug(content.title)}`"
          class="block content-hover-area no-underline"
        >
          <div v-html="formatContent(content.content, isPreview)"></div>
        </NuxtLink>
        <div v-else-if="content.content" v-html="formatContent(content.content, isPreview)"></div>
      </div>
      
      <!-- Botón "Ver post completo" solo en vista previa -->
      <div v-if="isPreview && ((content.content && content.content.length > 150) || attachments.length > 0)" class="mt-4">
        <NuxtLink 
          :to="`/posts/${generateSlug(content.title)}`"
          class="inline-flex items-center space-x-2 px-3 py-1.5 bg-transparent border border-white text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
        >
          <span>Ver post completo</span>
          <Icon name="heroicons:arrow-right" class="w-3 h-3" />
        </NuxtLink>
      </div>
      
      <div v-if="content.firmante" class="mt-6 pt-4 border-t border-white/20 mb-12">
        <p class="text-sm text-white font-semibold">
          Firmado por: <span class="text-[#EFB141]">{{ content.firmante }}</span>
        </p>
      </div>
      
      <!-- Archivos adjuntos - solo en vista completa -->
      <div v-if="!isPreview && attachments.length > 0">
        <AttachmentsCarousel :attachments="attachments" />
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// Estado para archivos adjuntos
const attachments = ref([])
const { getPostAttachments } = useSupabaseStorage()

const { generateSlug } = useSlug()

// Cargar archivos adjuntos
const loadAttachments = async () => {
  if (props.content.id) {
    const result = await getPostAttachments(props.content.id)
    if (result.success) {
      attachments.value = result.attachments
    } else {
      console.error('Error al cargar archivos adjuntos:', result.error)
    }
  }
}

// Cargar archivos adjuntos al montar el componente
onMounted(() => {
  loadAttachments()
})

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    // Crear la fecha en la zona horaria local para evitar problemas de UTC
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
    
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

const formatContent = (content, isPreview = false) => {
  if (!content) return '';
  
  let processedContent = content;
  
  // Si es vista previa, limitar por altura (aproximadamente 3-4 líneas)
  if (isPreview) {
    // Dividir por líneas para contar párrafos
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // Si hay más de 3 líneas con contenido, truncar
    if (lines.length > 3) {
      // Tomar las primeras 3 líneas
      const firstThreeLines = lines.slice(0, 3);
      
      // Buscar un buen punto de corte en la última línea
      let lastLine = firstThreeLines[2];
      const lastPeriod = lastLine.lastIndexOf('.');
      const lastSpace = lastLine.lastIndexOf(' ');
      
      if (lastPeriod !== -1 && lastPeriod > lastLine.length * 0.7) {
        // Si hay un punto después del 70% de la línea, cortar ahí
        lastLine = lastLine.substring(0, lastPeriod + 1);
      } else if (lastSpace !== -1 && lastSpace > lastLine.length * 0.6) {
        // Si no hay punto pero hay un espacio después del 60%, cortar ahí
        lastLine = lastLine.substring(0, lastSpace);
      }
      
      firstThreeLines[2] = lastLine;
      processedContent = firstThreeLines.join('\n') + '...';
    }
  }
  
  // Convertir Markdown básico a HTML (método mejorado)
  return processedContent
    // Headers (procesar primero)
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-3 text-white">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-4 text-white">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-5 text-white">$1</h1>')
    // Blockquotes (procesar antes que párrafos)
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#31B4E7] pl-4 italic text-white/80 mb-4">$1</blockquote>')
    // Lists (procesar antes que párrafos)
    .replace(/^- (.*$)/gim, '<li class="text-white mb-1">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
    // Bold e Italic (procesar antes que párrafos)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>')
    // Links (procesar antes que párrafos)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#31B4E7] hover:text-[#2A9BC7] underline">$1</a>')
    // Párrafos (procesar al final, pero solo en líneas que no sean headers, blockquotes, o listas)
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim()
      // Si la línea ya es HTML (headers, blockquotes, listas), no envolver en párrafo
      if (trimmedLine.startsWith('<h') || trimmedLine.startsWith('<blockquote') || 
          trimmedLine.startsWith('<ul') || trimmedLine.startsWith('<li') || 
          trimmedLine === '') {
        return line
      }
      // Si la línea tiene contenido, envolver en párrafo
      if (trimmedLine) {
        return `<p class="text-white mb-4">${line}</p>`
      }
      return line
    })
    .join('\n')
    // Clean up empty paragraphs
    .replace(/<p class="text-white mb-4"><\/p>/g, '')
    .replace(/<p class="text-white mb-4">\s*<\/p>/g, '');
};

const getBadgeClass = (type) => {
  // Todos los badges ahora son amarillos
  return 'bg-[#EFB141] text-gray-800 border-[#EFB141]';
};

const getIconClass = (type) => {
  // Todos los iconos ahora son gris oscuro (sobre fondo amarillo)
  return 'text-gray-600';
};
</script>

<style>
.feed-dot {
  @apply absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-white bg-[#1A043C] md:top-[0.4375rem];
}
.feed-border {
  @apply absolute -bottom-2 left-0 w-px bg-white -top-3 md:top-2.5;
}
.content-date {
  @apply pl-7 text-sm sm:text-base leading-6 text-white font-bold md:w-1/4 md:pl-0 md:pr-12 md:text-right;
}
.content-block {
  @apply relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-8;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.document {
  @apply max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-pre:text-base prose-invert prose-a:font-semibold prose-a:text-[#31B4E7] hover:prose-a:text-[#1E8BC3] prose-p:text-white prose-h1:text-white prose-h2:text-white prose-h3:text-white prose-h4:text-white prose-h5:text-white prose-h6:text-white prose-strong:text-white prose-em:text-white prose-li:text-white prose-blockquote:text-white prose-code:text-[#EFB141];
}

/* Manejo de contenido largo */
.document p {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Hover para contenido clickeable en vista previa */
.document a:hover .document p,
.document a:hover .document h1,
.document a:hover .document h2,
.document a:hover .document h3,
.document a:hover .document h4,
.document a:hover .document h5,
.document a:hover .document h6,
.document a:hover .document ul,
.document a:hover .document ol,
.document a:hover .document blockquote {
  color: #31B4E7 !important;
}

/* Hover conectado entre título y contenido */
h1:hover ~ .document .content-hover-area p,
h1:hover ~ .document .content-hover-area h1,
h1:hover ~ .document .content-hover-area h2,
h1:hover ~ .document .content-hover-area h3,
h1:hover ~ .document .content-hover-area h4,
h1:hover ~ .document .content-hover-area h5,
h1:hover ~ .document .content-hover-area h6,
h1:hover ~ .document .content-hover-area ul,
h1:hover ~ .document .content-hover-area ol,
h1:hover ~ .document .content-hover-area blockquote {
  color: white !important;
}

/* Cuando se hace hover en el contenido, activar el título */
.document:hover ~ h1 .title-link {
  color: white !important;
}

/* Estilos para enlaces sin subrayado */
.content-hover-area {
  text-decoration: none !important;
  color: inherit !important;
}

.content-hover-area:hover {
  text-decoration: none !important;
  color: inherit !important;
}

/* Hover directo en el contenido */
.content-hover-area:hover p,
.content-hover-area:hover h1,
.content-hover-area:hover h2,
.content-hover-area:hover h3,
.content-hover-area:hover h4,
.content-hover-area:hover h5,
.content-hover-area:hover h6,
.content-hover-area:hover ul,
.content-hover-area:hover ol,
.content-hover-area:hover blockquote {
  color: white !important;
}

.document h1, .document h2, .document h3, .document h4, .document h5, .document h6 {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.document ul, .document ol {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.document blockquote {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.document a {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Estilos para scroll horizontal en mobile/tablet */
@media (max-width: 768px) {
  article {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
  
  article::-webkit-scrollbar {
    height: 4px;
  }
  
  article::-webkit-scrollbar-track {
    background: transparent;
  }
  
  article::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
  
  article::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>
