import { translateDynamicContent } from "@/services/translate-service"
import type { Locale } from "@/i18n/translations"

/**
 * Traduce el contenido HTML manteniendo las etiquetas intactas
 * @param htmlContent El contenido HTML a traducir
 * @param locale El idioma al que traducir
 * @returns El contenido HTML traducido
 */
export function translateHtmlContent(htmlContent: string, locale: Locale): string {
  // If there's no content or the language is Spanish (base language), return the original content
  if (!htmlContent || locale === "es") {
    return htmlContent
  }

  // Create a temporary element to parse the HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent

  // Recursive function to translate text nodes
  function translateNode(node: Node) {
    // If it's a text node, translate its content
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const text = node.textContent.trim()
      if (text.length > 0) {
        // Translate the text and assign it back to the node
        node.textContent = translateDynamicContent(text, locale)
      }
    }
    // If it's an element, process its children
    else if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't translate the content of <code> or <pre> tags
      if ((node as Element).tagName.toLowerCase() !== "code" && (node as Element).tagName.toLowerCase() !== "pre") {
        // Process the node's children
        node.childNodes.forEach(translateNode)
      }
    }
  }

  // Translate all nodes in the content
  tempDiv.childNodes.forEach(translateNode)

  // Return the translated HTML
  return tempDiv.innerHTML
}
