import { translateDynamicContent } from "@/services/translate-service"
import type { Locale } from "@/i18n/translations"

/**
 * Traduce el contenido HTML manteniendo las etiquetas intactas
 * @param htmlContent El contenido HTML a traducir
 * @param locale El idioma al que traducir
 * @returns El contenido HTML traducido
 */
export function translateHtmlContent(htmlContent: string, locale: Locale): string {
  // Si no hay contenido o el idioma es español (idioma base), devolver el contenido original
  if (!htmlContent || locale === "es") {
    return htmlContent
  }

  // Crear un elemento temporal para parsear el HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent

  // Función recursiva para traducir nodos de texto
  function translateNode(node: Node) {
    // Si es un nodo de texto, traducir su contenido
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const text = node.textContent.trim()
      if (text.length > 0) {
        // Traducir el texto y asignarlo de vuelta al nodo
        node.textContent = translateDynamicContent(text, locale)
      }
    }
    // Si es un elemento, procesar sus hijos
    else if (node.nodeType === Node.ELEMENT_NODE) {
      // No traducir el contenido de las etiquetas <code> o <pre>
      if ((node as Element).tagName.toLowerCase() !== "code" && (node as Element).tagName.toLowerCase() !== "pre") {
        // Procesar los hijos del nodo
        node.childNodes.forEach(translateNode)
      }
    }
  }

  // Traducir todos los nodos del contenido
  tempDiv.childNodes.forEach(translateNode)

  // Devolver el HTML traducido
  return tempDiv.innerHTML
}
