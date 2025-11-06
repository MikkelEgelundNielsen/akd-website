import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

export const sanityClient: SanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Helper to fetch pages
export async function getPage(slug: string) {
  return await sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug }
  )
}

// Helper to fetch all articles
export async function getAllArticles() {
  return await sanityClient.fetch(
    `*[_type == "article"] | order(publishedAt desc)`
  )
}

