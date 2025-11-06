/**
 * Format date to Danish locale
 * @param date - Date to format
 * @param format - 'short' (DD-MM-YYYY) or 'long' (DD. MMM YYYY)
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'long'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return d.toLocaleDateString('da-DK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  return d.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Format number to Danish locale (1.234,56)
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('da-DK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + suffix
}

