// Composable para generar slugs
export const useSlug = () => {
  // Generar slug del post
  const generateSlug = (title) => {
    if (!title) return '';
    
    // Mapeo de caracteres especiales y acentos
    const charMap = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n',
      'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u', 'Ü': 'u', 'Ñ': 'n',
      'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
      'À': 'a', 'È': 'e', 'Ì': 'i', 'Ò': 'o', 'Ù': 'u'
    };
    
    let slug = title
      // Reemplazar caracteres especiales
      .split('').map(char => charMap[char] || char).join('')
      // Convertir a minúsculas
      .toLowerCase()
      // Remover caracteres no válidos (solo letras, números, espacios y guiones)
      .replace(/[^a-z0-9\s-]/g, '')
      // Reemplazar espacios con guiones
      .replace(/\s+/g, '-')
      // Remover guiones múltiples
      .replace(/-+/g, '-')
      // Remover guiones al inicio y final
      .replace(/^-+|-+$/g, '')
      // Limitar a 50 caracteres máximo
      .substring(0, 50)
      // Remover guión final si quedó
      .replace(/-+$/, '');
    
    return slug;
  };

  return {
    generateSlug
  };
};
