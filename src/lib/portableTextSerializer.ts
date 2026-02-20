/**
 * Portable Text to HTML serializer
 * Handles custom marks (mint accent) and blocks (callout)
 */

import type { PortableTextBlock, CalloutBlock } from '@/types/sanity'

interface SerializerOptions {
  /**
   * Whether to add IDs to H2, H3 and H4 headings for TOC linking and anchors
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

  // Handle video blocks (renders a card that triggers the global VideoModal)
  if (block._type === 'videoBlock') {
    const video = block.video
    if (!video) return ''

    const title = escapeHtml(video.title || '')
    const description = video.description ? escapeHtml(video.description) : ''
    const thumbnail = video.thumbnail || ''
    const thumbnailAlt = video.thumbnailAlt ? escapeHtml(video.thumbnailAlt) : ''
    const duration = video.duration || ''
    const videoUrl = video.videoUrl || ''

    return `
      <div class="video-block my-8">
        <button
          type="button"
          class="video-card group text-left w-full rounded-xl overflow-hidden bg-light shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange border border-charcoal/10"
          data-video-url="${escapeHtml(videoUrl)}"
          data-video-title="${title}"
          aria-label="Afspil video: ${title}"
        >
          <div class="relative overflow-hidden bg-charcoal/10 aspect-video w-full">
            ${thumbnail
              ? `<img src="${escapeHtml(thumbnail)}" alt="${thumbnailAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />`
              : `<div class="w-full h-full flex items-center justify-center bg-forest-green/10">
                  <svg class="w-12 h-12 text-forest-green/30" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                  </svg>
                </div>`
            }
            <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div class="w-[4.5rem] h-[4.5rem] rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                <div class="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition-colors">
                  <svg class="w-7 h-7 text-burnt-orange ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            ${duration ? `<span class="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">${escapeHtml(duration)}</span>` : ''}
          </div>
          <div class="p-4">
            <h4 class="font-semibold text-charcoal leading-snug text-base mb-1">${title}</h4>
            ${description ? `<p class="text-sm text-charcoal/70 mt-1">${description}</p>` : ''}
          </div>
        </button>
      </div>
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

  // Handle table blocks
  if (block._type === 'tableBlock') {
    const rows = block.rows || []
    if (rows.length === 0) return ''

    let html = '<div class="table-wrapper"><table>'
    rows.forEach((row: any, rowIndex: number) => {
      const isHeader = block.hasHeaderRow && rowIndex === 0
      const tag = isHeader ? 'th' : 'td'
      const wrapper = isHeader ? 'thead' : (rowIndex === 1 && block.hasHeaderRow ? 'tbody' : '')

      if (isHeader) html += '<thead>'
      if (rowIndex === 1 && block.hasHeaderRow) html += '<tbody>'

      html += '<tr>'
      ;(row.cells || []).forEach((cell: string) => {
        html += `<${tag}>${escapeHtml(cell)}</${tag}>`
      })
      html += '</tr>'

      if (isHeader) html += '</thead>'
    })
    if (block.hasHeaderRow && rows.length > 1) html += '</tbody>'
    else if (!block.hasHeaderRow) {
      // Wrap everything we already wrote — simpler: no-op since rows are already output
    }
    html += '</table></div>'
    return html
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
        const h3Id = options.addHeadingIds ? ` id="${slugify(getTextContent(block))}"` : ''
        return `<h3${h3Id}>${children}</h3>`
      case 'h4':
        const h4Id = options.addHeadingIds ? ` id="${slugify(getTextContent(block))}"` : ''
        return `<h4${h4Id}>${children}</h4>`
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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
 * Create TOC from H2, H3, and H4 headings in Portable Text
 */
export function extractTableOfContents(blocks: any[]): Array<{id: string, title: string, level: 2 | 3 | 4}> {
  if (!blocks || !Array.isArray(blocks)) return []
  
  return blocks
    .filter(block => block._type === 'block' && (block.style === 'h2' || block.style === 'h3' || block.style === 'h4'))
    .map(block => {
      const title = getTextContent(block)
      return {
        id: slugify(title),
        title,
        level: block.style === 'h2' ? 2 : block.style === 'h3' ? 3 : 4
      }
    })
}

