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
      <h1 v-if="content.title" class="text-xl sm:text-3xl font-bold mb-4 text-white">
        {{ content.title }}
      </h1>

      <div class="document prose prose-invert prose-sm max-w-none">
        <div v-if="content.content" v-html="formatContent(content.content)"></div>
      </div>
      <div v-if="content.firmante" class="mt-6 pt-4 border-t border-white/20">
        <p class="text-sm text-white font-semibold">
          Firmado por: <span class="text-[#EFB141]">{{ content.firmante }}</span>
        </p>
      </div>
      
      <!-- Archivos adjuntos -->
      <AttachmentsCarousel :attachments="attachments" />
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
});

// Estado para archivos adjuntos
const attachments = ref([])
const { getPostAttachments } = useGoogleDrive()

// Cargar archivos adjuntos
const loadAttachments = async () => {
  if (props.content.id) {
    const result = await getPostAttachments(props.content.id)
    if (result.success) {
      attachments.value = result.attachments
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

const formatContent = (content) => {
  if (!content) return '';
  
  // Convertir Markdown básico a HTML
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-3 text-white">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-4 text-white">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-5 text-white">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="text-white mb-1">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
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
  @apply absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-[#EFB141] bg-[#1A043C] md:top-[0.4375rem];
}
.feed-border {
  @apply absolute -bottom-2 left-0 w-px bg-[#EFB141] -top-3 md:top-2.5;
}
.content-date {
  @apply pl-7 text-sm sm:text-base leading-6 text-[#EFB141] font-bold md:w-1/4 md:pl-0 md:pr-12 md:text-right;
}
.content-block {
  @apply relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-8;
}
.document {
  @apply max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-pre:text-base prose-invert prose-a:font-semibold prose-a:text-[#31B4E7] hover:prose-a:text-[#1E8BC3] prose-p:text-white prose-h1:text-white prose-h2:text-white prose-h3:text-white prose-h4:text-white prose-h5:text-white prose-h6:text-white prose-strong:text-white prose-em:text-white prose-li:text-white prose-blockquote:text-white prose-code:text-[#EFB141];
}
</style>
