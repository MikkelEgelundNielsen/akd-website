/**
 * Sanity GROQ queries for fetching content
 */

// Site Settings
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id,
  title,
  description,
  "logo": logo.asset->url,
  defaultSeo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  },
  "favicon": favicon.asset->url,
  companyName,
  cvr,
  phone,
  email,
  address,
  socialMedia,
  footerDescription,
  footerCtaText,
  footerCtaLink,
  andelshavereTitle,
  andelshavereDescription,
  andelshavereLoginLink,
  quickLinks[] {
    title,
    links[] {
      title,
      linkType,
      "href": select(
        linkType == "internal" && defined(internalLink) => "/" + internalLink->slug.current,
        linkType == "manual" => manualUrl,
        "/"
      ),
      openInNewTab
    }
  },
  tertiaryLinks[] {
    title,
    linkType,
    "href": select(
      linkType == "internal" && defined(internalLink) => "/" + internalLink->slug.current,
      linkType == "manual" => manualUrl,
      "/"
    ),
    openInNewTab
  }
}`

// Navigation
export const navigationQuery = `*[_type == "navigation"][0] {
  _id,
  title,
  menuItems[] {
    label,
    linkType,
    "href": select(
      linkType == "internal" && defined(internalLink) => "/" + internalLink->slug.current,
      linkType == "manual" => manualUrl,
      "/"
    ),
    subItems[] {
      label,
      linkType,
      "href": select(
        linkType == "internal" && defined(internalLink) => "/" + internalLink->slug.current,
        linkType == "manual" => manualUrl,
        "/"
      ),
      description
    }
  }
}`

// General Page by slug
export const generalPageBySlugQuery = (slug: string) => `*[_type == "generalPage" && slug.current == "${slug}"][0] {
  _id,
  title,
  slug,
  preHeader,
  headline,
  showTableOfContents,
  tableOfContents[] {
    "id": id.current,
    title
  },
  content[] {
    ...,
    _type == "image" => {
      "url": asset->url,
      alt,
      caption
    }
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  },
  publishedAt,
  updatedAt
}`

// All General Pages (for listing and dynamic routes)
export const allGeneralPagesQuery = `*[_type == "generalPage"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  preHeader,
  headline,
  showTableOfContents,
  tableOfContents[] {
    "id": id.current,
    title
  },
  content[] {
    ...,
    _type == "image" => {
      "url": asset->url,
      alt,
      caption
    }
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  },
  publishedAt,
  updatedAt
}`

// Article by slug
export const articleBySlugQuery = (slug: string) => `*[_type == "article" && slug.current == "${slug}"][0] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  "mainImageAlt": mainImage.alt,
  body[] {
    ...,
    _type == "image" => {
      "url": asset->url,
      alt,
      caption
    }
  },
  category
}`

// All Articles (for listing)
export const allArticlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  category
}`

// Articles by category
export const articlesByCategoryQuery = (category: string) => `*[_type == "article" && category == "${category}"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  category
}`

// Andelshavere Navigation
// Note: Internal links expect slugs like "/andelshavere/levering-og-kampagne" in Sanity (with leading slash)
export const andelshavereNavigationQuery = `*[_type == "andelshavereNavigation"][0] {
  _id,
  title,
  menuItems[] {
    label,
    linkType,
    "href": select(
      linkType == "internal" && defined(internalLink) => internalLink->slug.current,
      linkType == "manual" => manualUrl,
      "/"
    ),
    description,
    icon
  }
}`

