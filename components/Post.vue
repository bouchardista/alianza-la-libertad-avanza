<template>
  <article class="md:flex" v-if="content">
    <h2 class="content-date h-full mt-px">
      <span>{{ formatDate(content.date) }}</span>
    </h2>
    <div class="content-block">
      <div class="feed-border"></div>
      <div class="feed-dot"></div>
      <badge
        v-if="content.type"
        :label="content.type"
        :badge-class="getBadgeClass(content.type)"
        :icon-class="getIconClass(content.type)"
        class="absolute -top-6 right-0 md:static mb-4"
      />
      <h1 v-if="content.title" class="text-xl sm:text-3xl font-bold mb-4">
        <NuxtLink 
          v-if="isPreview"
          :to="`/posts/${generateSlug(content.title)}`"
          class="text-white hover:text-[#31B4E7] transition-colors cursor-pointer"
        >
          {{ content.title }}
        </NuxtLink>
        <span v-else class="text-white">
          {{ content.title }}
        </span>
      </h1>

      <div class="document prose prose-invert prose-sm max-w-none">
        <div v-if="content.content" v-html="formatContent(content.content, isPreview)"></div>
      </div>
      
      <!-- Botón "Ver post completo" solo en vista previa -->
      <div v-if="isPreview && content.content && content.content.length > 200" class="mt-4">
        <NuxtLink 
          :to="`/posts/${generateSlug(content.title)}`"
          class="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#31B4E7] hover:bg-[#2A9BC7] text-white rounded-lg transition-colors text-sm"
        >
          <span>Ver post completo</span>
          <Icon name="heroicons:arrow-right" class="w-3 h-3" />
        </NuxtLink>
      </div>
      
      <div v-if="content.firmante" class="mt-6 pt-4 border-t border-white/20">
        <p class="text-sm text-white font-semibold">
          Firmado por: <span class="text-[#EFB141]">{{ content.firmante }}</span>
        </p>
      </div>
      
      <!-- Archivos adjuntos -->
      <div v-if="!isPreview || attachments.length > 0">
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
const { getPostAttachments } = useGoogleDrive()

const { generateSlug } = useSlug()

// Cargar archivos adjuntos
const loadAttachments = async () => {
  if (props.content.id) {
    console.log('Cargando archivos adjuntos para post:', props.content.id)
    const result = await getPostAttachments(props.content.id)
    console.log('Resultado de getPostAttachments:', result)
    if (result.success) {
      attachments.value = result.attachments
      console.log('Archivos adjuntos cargados:', attachments.value)
    } else {
      console.error('Error al cargar archivos adjuntos:', result.error)
    }
  } else {
    console.log('No hay ID de post para cargar archivos adjuntos')
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
  
  // Si es vista previa, truncar el contenido
  if (isPreview && content.length > 300) {
    // Buscar un buen punto de corte (después de un punto o salto de línea)
    let cutPoint = 300;
    const nextPeriod = content.indexOf('.', 300);
    const nextNewline = content.indexOf('\n', 300);
    
    if (nextPeriod !== -1 && nextPeriod < 400) {
      cutPoint = nextPeriod + 1;
    } else if (nextNewline !== -1 && nextNewline < 400) {
      cutPoint = nextNewline;
    }
    
    processedContent = content.substring(0, cutPoint) + '...';
  }
  
  // Convertir Markdown básico a HTML (método simple sin async)
  return processedContent
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-3 text-white">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-4 text-white">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-5 text-white">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="text-white mb-1">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#31B4E7] hover:text-[#2A9BC7] underline">$1</a>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#31B4E7] pl-4 italic text-white/80 mb-4">$1</blockquote>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-white mb-4">')
    .replace(/^(.+)$/gm, '<p class="text-white mb-4">$1</p>')
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
}
.document {
  @apply max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-pre:text-base prose-invert prose-a:font-semibold prose-a:text-[#31B4E7] hover:prose-a:text-[#1E8BC3] prose-p:text-white prose-h1:text-white prose-h2:text-white prose-h3:text-white prose-h4:text-white prose-h5:text-white prose-h6:text-white prose-strong:text-white prose-em:text-white prose-li:text-white prose-blockquote:text-white prose-code:text-[#EFB141];
}
</style>
