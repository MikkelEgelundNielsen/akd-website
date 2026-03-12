import type { APIRoute } from 'astro'
import { sanityClient } from '@/lib/sanity'
import { portalNewsArticlesQuery } from '@/lib/sanityQueries'

export const prerender = false

const ALLOWED_ORIGINS = [
  'https://avlerinfo.dk',
  'https://www.avlerinfo.dk',
  'http://localhost',
]

function getCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
  }

  if (origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
  }

  return headers
}

export const GET: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin')
  const headers = getCorsHeaders(origin)

  try {
    const articles = await sanityClient.fetch(portalNewsArticlesQuery)

    const response = (articles || []).map((a: any) => ({
      title: a.title,
      slug: a.slug,
      date: a.publishedAt,
      excerpt: a.excerpt || '',
      isPublic: a.isPublic ?? true,
      url: a.isPublic
        ? `https://akd-website.pages.dev/nyheder/${a.slug}`
        : null,
    }))

    return new Response(JSON.stringify(response), { status: 200, headers })
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news', detail: err.message }),
      { status: 500, headers },
    )
  }
}

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin')
  return new Response(null, { status: 204, headers: getCorsHeaders(origin) })
}
