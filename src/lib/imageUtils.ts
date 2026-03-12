/**
 * Appends Sanity CDN image transformation parameters to a URL.
 * Only transforms URLs from cdn.sanity.io — passes through all others unchanged.
 *
 * @param url    Raw image URL (typically from `asset->url` in GROQ)
 * @param width  Maximum width in pixels
 * @param quality JPEG/WebP quality 1-100 (default 80)
 */
export function sanityImageUrl(
  url: string | undefined | null,
  width: number,
  quality = 80,
): string {
  if (!url) return ''
  if (!url.includes('cdn.sanity.io')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}w=${width}&fm=webp&q=${quality}`
}
