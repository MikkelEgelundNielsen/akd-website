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

// Dashboard News (newest first, max 5)
export const dashboardNewsQuery = `*[_type == "dashboardNews"] | order(publishedAt desc)[0...5] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  category,
  contentType,
  excerpt,
  link,
  "videoUrl": videoRef->videoFile.asset->url,
  "videoTitle": videoRef->title
}`

// Dashboard Streamer (singleton)
export const dashboardStreamerQuery = `*[_type == "dashboardStreamer"][0] {
  _id,
  isActive,
  icon,
  title,
  message,
  link,
  linkText
}`

// Dashboard Knowledge (singleton with expanded article references)
export const dashboardKnowledgeQuery = `*[_type == "dashboardKnowledge"][0] {
  _id,
  title,
  searchPlaceholder,
  searchLink,
  popularTopics[] {
    label,
    link
  },
  items[] {
    contentType,
    articleRef-> {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "mainImage": mainImage.asset->url
    },
    manualTitle,
    manualLink,
    "thumbnail": thumbnail.asset->url,
    "videoUrl": videoRef->videoFile.asset->url,
    "videoTitle": videoRef->title,
    category
  }
}`

// Dashboard Quick Links (singleton)
export const dashboardQuickLinksQuery = `*[_type == "dashboardQuickLinks"][0] {
  _id,
  title,
  links[] {
    label,
    href,
    openInNewTab
  }
}`

// Meet Employees Page (singleton with expanded employee references)
export const meetEmployeesPageQuery = `*[_type == "meetEmployeesPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  departments[] {
    title,
    employees[]-> {
      _id,
      name,
      jobTitle,
      department,
      location,
      quote,
      description,
      "image": image.asset->url,
      "imageAlt": image.alt,
      startDate
    }
  },
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Employees by department (for reuse on job pages etc.)
export const employeesByDepartmentQuery = (department: string) =>
  `*[_type == "employeeStory" && department == "${department}"] | order(name asc) {
    _id,
    name,
    jobTitle,
    department,
    location,
    quote,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt,
    startDate
  }`

// All employees
export const allEmployeesQuery = `*[_type == "employeeStory"] | order(name asc) {
  _id,
  name,
  jobTitle,
  department,
  location,
  quote,
  description,
  "image": image.asset->url,
  "imageAlt": image.alt,
  startDate
}`

// ── Content Box helper (shared projection) ──
const contentBoxProjection = `{
  variant,
  layout,
  preHeader,
  headline,
  "image": image.asset->url,
  "imageAlt": image.alt,
  pullUp,
  items[] {
    title,
    description,
    icon,
    href
  }
}`

// Working at AKD Page (singleton with expanded photoGallery)
export const workingAtAkdPageQuery = `*[_type == "workingAtAkdPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  "contentBox": contentBox ${contentBoxProjection},
  photoGallery-> {
    _id,
    title,
    images[] {
      "url": asset->url,
      alt
    }
  },
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Job Listings Page (singleton)
export const jobListingsPageQuery = `*[_type == "jobListingsPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  listingsHeadline,
  listingsCtaPrimaryText,
  listingsCtaPrimaryUrl,
  listingsCtaSecondaryText,
  listingsCtaSecondaryUrl,
  "contentBox": contentBox ${contentBoxProjection},
  bottomCtaPrimaryText,
  bottomCtaPrimaryUrl,
  bottomCtaSecondaryText,
  bottomCtaSecondaryUrl,
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Open Application Page (singleton)
export const openApplicationPageQuery = `*[_type == "openApplicationPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  body,
  contactEmail,
  contactName,
  contactTitle,
  contactPhone,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Board Page (singleton)
export const boardPageQuery = `*[_type == "boardPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  members[] {
    name,
    role,
    address,
    phone,
    mobile,
    email
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Management Page (singleton)
export const managementPageQuery = `*[_type == "managementPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  members[] {
    name,
    role,
    address,
    phone,
    mobile,
    email
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Reports Page (singleton)
export const reportsPageQuery = `*[_type == "reportsPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  documentGroups[] {
    title,
    description,
    documents[] {
      title,
      "fileUrl": file.asset->url,
      url
    }
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// ── Video queries ──

// All videos
export const allVideosQuery = `*[_type == "video"] | order(_createdAt desc) {
  _id,
  title,
  description,
  "videoUrl": videoFile.asset->url,
  "thumbnail": thumbnail.asset->url,
  "thumbnailAlt": thumbnail.alt,
  duration
}`

// Single video by ID
export const videoByIdQuery = (id: string) =>
  `*[_type == "video" && _id == "${id}"][0] {
    _id,
    title,
    description,
    "videoUrl": videoFile.asset->url,
    "thumbnail": thumbnail.asset->url,
    "thumbnailAlt": thumbnail.alt,
    duration
  }`

// Active job listings (ordered by publishedAt)
export const activeJobListingsQuery = `*[_type == "jobListing" && isActive == true] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  location,
  department,
  isActive,
  publishedAt,
  applicationDeadline
}`

// Job listing by slug (detail page)
export const jobListingBySlugQuery = (slug: string) =>
  `*[_type == "jobListing" && slug.current == "${slug}"][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    location,
    department,
    isActive,
    publishedAt,
    body,
    applicationUrl,
    applicationDeadline,
    contactName,
    contactPhone,
    contactEmail,
    externalPartner,
    employees[]-> {
      _id,
      name,
      jobTitle,
      department,
      location,
      quote,
      description,
      "image": image.asset->url,
      "imageAlt": image.alt,
      startDate
    },
    seo {
      metaTitle,
      metaDescription,
      "openGraphImage": openGraphImage.asset->url,
      noIndex
    }
  }`

