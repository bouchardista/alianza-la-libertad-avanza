// Plugin para cargar fuentes en el cliente
export default defineNuxtPlugin(() => {
  // Asegurar que Montserrat esté disponible
  if (process.client) {
    // Verificar si la fuente ya está cargada
    if (!document.fonts.check('1em Montserrat')) {
      // Precargar la fuente
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }
  }
})
