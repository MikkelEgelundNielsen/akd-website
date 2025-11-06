/**
 * Portable Text to HTML serializer
 * Handles custom marks (mint accent) and blocks (callout)
 */

import type { PortableTextBlock, CalloutBlock } from '@/types/sanity'

interface SerializerOptions {
  /**
   * Whether to add IDs to H2 headings for TOC linking
   */
  addHeadingIds?: boolean
}

/**
 * Converts Portable Text to HTML
 */
export function portableTextToHtml(
  blocks: any[],
  options: SerializerOptions = {}
): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  const result: string[] = []
  let currentList: { type: 'bullet' | 'number'; items: string[] } | null = null

  blocks.forEach((block, index) => {
    // Check if this is a list item
    if (block._type === 'block' && block.listItem) {
      const listType = block.listItem === 'bullet' ? 'bullet' : 'number'
      const itemHtml = serializeBlock(block, options)

      // Start a new list or continue existing one
      if (!currentList || currentList.type !== listType) {
        // Close previous list if exists
        if (currentList) {
          const tag = currentList.type === 'bullet' ? 'ul' : 'ol'
          result.push(`<${tag}>${currentList.items.join('')}</${tag}>`)
        }
        // Start new list
        currentList = { type: listType, items: [itemHtml] }
      } else {
        // Add to current list
        currentList.items.push(itemHtml)
      }
    } else {
      // Not a list item - close any open list first
      if (currentList) {
        const tag = currentList.type === 'bullet' ? 'ul' : 'ol'
        result.push(`<${tag}>${currentList.items.join('')}</${tag}>`)
        currentList = null
      }
      // Add the non-list block
      result.push(serializeBlock(block, options))
    }
  })

  // Close any remaining open list
  if (currentList) {
    const tag = currentList.type === 'bullet' ? 'ul' : 'ol'
    result.push(`<${tag}>${currentList.items.join('')}</${tag}>`)
  }

  return result.join('')
}

function serializeBlock(block: any, options: SerializerOptions): string {
  // Handle images
  if (block._type === 'image') {
    return `
      <figure>
        <img 
          src="${block.url}" 
          alt="${block.alt || ''}"
          class="w-full h-auto rounded-lg"
        />
        ${block.caption ? `<figcaption class="text-sm text-charcoal/70 mt-2 text-center">${block.caption}</figcaption>` : ''}
      </figure>
    `
  }

  // Handle callout blocks
  if (block._type === 'calloutBlock') {
    return `
      <div class="callout">
        ${portableTextToHtml(block.content, options)}
      </div>
    `
  }

  // Handle regular blocks
  if (block._type === 'block') {
    const children = serializeChildren(block.children || [], block.markDefs || [])
    
    // Handle list items (don't wrap in paragraph)
    if (block.listItem) {
      return `<li>${children}</li>`
    }
    
    // Handle different styles
    switch (block.style) {
      case 'h2':
        const h2Id = options.addHeadingIds ? ` id="${slugify(getTextContent(block))}"` : ''
        return `<h2${h2Id}>${children}</h2>`
      case 'h3':
        return `<h3>${children}</h3>`
      case 'h4':
        return `<h4>${children}</h4>`
      case 'normal':
      default:
        return `<p>${children}</p>`
    }
  }

  return ''
}

function serializeChildren(children: any[], markDefs: any[]): string {
  return children.map(child => {
    if (child._type !== 'span') return ''
    
    let text = child.text
    const marks = child.marks || []

    // Apply marks
    marks.forEach((mark: string) => {
      if (mark === 'strong') {
        text = `<strong>${text}</strong>`
      } else if (mark === 'em') {
        text = `<em>${text}</em>`
      } else if (mark === 'mint' || mark === 'mintAccent') {
        text = `<span class="font-serif italic text-mint">${text}</span>`
      } else {
        // Check if it's a link
        const markDef = markDefs.find(def => def._key === mark)
        if (markDef && markDef._type === 'link') {
          const target = markDef.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
          text = `<a href="${markDef.href}"${target}>${text}</a>`
        }
      }
    })

    return text
  }).join('')
}

function getTextContent(block: any): string {
  if (!block.children) return ''
  return block.children
    .map((child: any) => child.text || '')
    .join('')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extract plain text from Portable Text (useful for excerpts)
 */
export function portableTextToPlainText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .filter(block => block._type === 'block')
    .map(block => getTextContent(block))
    .join(' ')
}

/**
 * Create TOC from H2 headings in Portable Text
 */
export function extractTableOfContents(blocks: any[]): Array<{id: string, title: string}> {
  if (!blocks || !Array.isArray(blocks)) return []
  
  return blocks
    .filter(block => block._type === 'block' && block.style === 'h2')
    .map(block => {
      const title = getTextContent(block)
      return {
        id: slugify(title),
        title
      }
    })
}

