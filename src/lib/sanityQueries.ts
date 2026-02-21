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
    },
    _type == "videoBlock" => {
      ...,
      "video": videoRef-> {
        title,
        description,
        "videoUrl": videoFile.asset->url,
        "thumbnail": thumbnail.asset->url,
        "thumbnailAlt": thumbnail.alt,
        duration
      }
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
    },
    _type == "videoBlock" => {
      ...,
      "video": videoRef-> {
        title,
        description,
        "videoUrl": videoFile.asset->url,
        "thumbnail": thumbnail.asset->url,
        "thumbnailAlt": thumbnail.alt,
        duration
      }
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
  "slug": slug.current,
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
    },
    _type == "videoBlock" => {
      ...,
      "video": videoRef-> {
        title,
        description,
        "videoUrl": videoFile.asset->url,
        "thumbnail": thumbnail.asset->url,
        "thumbnailAlt": thumbnail.alt,
        duration
      }
    }
  },
  category,
  isPublic
}`

// All Articles (for listing)
export const allArticlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  category,
  isPublic
}`

// Public articles only
export const publicArticlesQuery = `*[_type == "article" && isPublic == true] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  category,
  isPublic
}`

// Articles by category
export const articlesByCategoryQuery = (category: string) => `*[_type == "article" && category == "${category}"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  category,
  isPublic
}`

// ── News Articles ──

// All news articles (for authenticated avlere listing)
export const allNewsArticlesQuery = `*[_type == "newsArticle"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  "mainImageAlt": mainImage.alt,
  isPublic,
  showOnPortal
}`

// Single news article by slug
export const newsArticleBySlugQuery = (slug: string) => `*[_type == "newsArticle" && slug.current == "${slug}"][0] {
  _id,
  title,
  "slug": slug.current,
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
    },
    _type == "videoBlock" => {
      ...,
      "video": videoRef-> {
        title,
        description,
        "videoUrl": videoFile.asset->url,
        "thumbnail": thumbnail.asset->url,
        "thumbnailAlt": thumbnail.alt,
        duration
      }
    }
  },
  sourceUrl,
  isPublic,
  showOnPortal,
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Public news articles only (for unauthenticated visitors)
export const publicNewsArticlesQuery = `*[_type == "newsArticle" && isPublic == true] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  "mainImageAlt": mainImage.alt
}`

// Latest 3 public news articles (for front page)
export const latestPublicNewsQuery = `*[_type == "newsArticle" && isPublic == true] | order(publishedAt desc) [0...3] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  "mainImageAlt": mainImage.alt
}`

// Portal news articles (for avlerinfo.dk)
export const portalNewsArticlesQuery = `*[_type == "newsArticle" && isPublic == true && showOnPortal == true] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url,
  "mainImageAlt": mainImage.alt
}`

// Dashboard news (latest 5 for avlere dashboard)
export const dashboardNewsArticlesQuery = `*[_type == "newsArticle"] | order(publishedAt desc)[0...5] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt
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
    manualTeaser,
    manualLink,
    "thumbnail": coalesce(thumbnail.asset->url, videoRef->thumbnail.asset->url),
    "videoUrl": videoRef->videoFile.asset->url,
    "videoTitle": videoRef->title,
    category
  },
  tools[] {
    label,
    href,
    openInNewTab
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
    email,
    "imageUrl": image.asset->url
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
    email,
    "imageUrl": image.asset->url
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

// ── Vidensbase queries ──

// Vidensbase page singleton (hero, search, icon bar categories)
export const vidensbasePageQuery = `*[_type == "vidensbasePage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  searchPlaceholder,
  popularTopics[] {
    label,
    link
  },
  categories[]-> {
    _id,
    title,
    "slug": slug.current,
    icon,
    shortLabel
  },
  usefulLinks[] {
    label,
    href,
    openInNewTab
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// Single vidensbase topic by slug (full content + related topics)
export const vidensbaseTopicBySlugQuery = (slug: string) =>
  `*[_type == "vidensbaseTopic" && slug.current == "${slug}"][0] {
    _id,
    title,
    "slug": slug.current,
    icon,
    shortLabel,
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
      },
      _type == "videoBlock" => {
        ...,
        "video": videoRef-> {
          title,
          description,
          "videoUrl": videoFile.asset->url,
          "thumbnail": thumbnail.asset->url,
          "thumbnailAlt": thumbnail.alt,
          duration
        }
      }
    },
    relatedTopics[]-> {
      _id,
      title,
      "slug": slug.current,
      icon,
      shortLabel
    },
    seo {
      metaTitle,
      metaDescription,
      "openGraphImage": openGraphImage.asset->url,
      noIndex
    }
  }`

// All vidensbase topic slugs (for fallback/navigation)
export const allVidensbaseTopicsQuery = `*[_type == "vidensbaseTopic"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  icon,
  shortLabel
}`

// Internship page singleton
export const internshipPageQuery = `*[_type == "internshipPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  pathCards[] {
    title,
    description,
    icon,
    linkUrl,
    linkLabel
  },
  contentBox {
    variant,
    layout,
    preHeader,
    headline,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    pullUp,
    items[] {
      title,
      description,
      icon,
      href
    }
  },
  workAreas[] {
    title,
    description
  },
  steps[] {
    title,
    description
  },
  contactHeadline,
  contactText,
  contactPhone,
  contactEmail,
  faqItems[] {
    question,
    answer
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
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

// Full job listings with all fields — used by getStaticPaths to avoid N+1 fetches
export const fullJobListingsQuery = `*[_type == "jobListing" && isActive == true] | order(publishedAt desc) {
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

// ── About Page (singleton) ──

export const aboutPageQuery = `*[_type == "aboutPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  heroTheme,
  "contentBox": contentBox {
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
  },
  statsPreHeader,
  statsHeading,
  stats[] {
    value,
    label
  },
  fellowship {
    preHeader,
    heading,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    bodyText
  },
  video {
    preHeader,
    heading,
    description,
    "videoRef": videoRef-> {
      _id,
      title,
      description,
      "videoUrl": videoFile.asset->url,
      "thumbnail": thumbnail.asset->url,
      "thumbnailAlt": thumbnail.alt,
      duration
    }
  },
  quickNavHeading,
  quickNavDescription,
  quickNavCards[] {
    title,
    description,
    href,
    icon,
    row
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// ── Responsibility Page (singleton) ──

export const responsibilityPageQuery = `*[_type == "responsibilityPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  csrSection {
    preHeader,
    heading,
    introText,
    documentsHeading,
    documents[] {
      title,
      "fileUrl": file.asset->url,
      url
    }
  },
  codeOfConductSection {
    preHeader,
    heading,
    introText,
    documentsHeading,
    documents[] {
      title,
      "fileUrl": file.asset->url,
      url
    }
  },
  klimaaftrykSection {
    preHeader,
    heading,
    subheading,
    content[] {
      ...,
      _type == "image" => {
        "url": asset->url,
        alt,
        caption
      }
    }
  },
  ctaSection {
    heading,
    description,
    linkText,
    linkHref
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// ── Kontakt Page (singleton) ──

export const kontaktPageQuery = `*[_type == "kontaktPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  headquarters {
    label,
    name,
    addressLines,
    phone,
    email,
    openingHours,
    mapsLink,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    cvr
  },
  factories[] {
    label,
    name,
    addressLines,
    openingHours,
    mapsEmbed,
    mapsLink
  },
  contactChannels {
    preHeader,
    headline,
    description,
    channels[] {
      title,
      description,
      email,
      icon
    }
  },
  whistleblower {
    headline,
    description,
    linkText,
    linkHref
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// ── Rest- og biprodukter Page (singleton) ──

export const restOgBiprodukterPageQuery = `*[_type == "restOgBiprodukterPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  quickNavCards[] {
    title,
    description,
    anchor,
    icon
  },
  protamylasseSection {
    preHeader,
    headline,
    introText,
    contentBlocks[] {
      headline,
      body
    },
    maskinstationer,
    afhentningHeadline,
    afhentningText,
    tildeltMaengde {
      headline,
      body
    },
    pris {
      headline,
      body
    },
    nutrientTable {
      headline,
      rows[] {
        name,
        content,
        price,
        total100,
        totalAdj
      },
      totalRaw,
      totalAdj,
      avlerPrice,
      footnote
    },
    freightTable {
      headline,
      rows[] {
        label,
        v10,
        v40,
        v80,
        v120
      }
    },
    deklarationer {
      headline,
      documents[] {
        label,
        "fileUrl": file.asset->url,
        url
      }
    }
  },
  pulpSection {
    preHeader,
    headline,
    introText,
    bodyText,
    documents {
      headline,
      items[] {
        label,
        "fileUrl": file.asset->url,
        url
      }
    }
  },
  restprodukterSection {
    preHeader,
    headline,
    body,
    document {
      label,
      "fileUrl": file.asset->url,
      url
    },
    externalLinkText,
    externalLinkHref
  },
  contactSection {
    headline,
    description,
    contacts[] {
      name,
      role,
      phone,
      email
    }
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// ── Andele Page (singleton) ──

export const andelePageQuery = `*[_type == "andelePage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  lejeaftalerSection {
    preHeader,
    heading,
    content
  },
  koebSalgSection {
    preHeader,
    heading,
    content,
    documents[] {
      title,
      "fileUrl": file.asset->url,
      url
    },
    financingNote
  },
  finansieringSection {
    preHeader,
    heading,
    content
  },
  ctaSection {
    heading,
    description,
    linkText,
    linkHref
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// ── Bliv Andelshaver Page (singleton) ──

export const blivAndelshaverPageQuery = `*[_type == "blivAndelshaverPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  contactPerson {
    name,
    role,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    phoneHref,
    phoneLabel,
    callbackReason,
    callbackLabel
  },
  contactSection {
    preHeader,
    headline,
    checkmarkItems[] {
      title,
      description
    }
  },
  benefitsSection {
    preHeader,
    headline,
    pillars[] {
      title,
      description
    }
  },
  processSection {
    preHeader,
    headline,
    steps[] {
      number,
      title,
      description
    },
    ctaLinks[] {
      text,
      href,
      variant,
      opensCallbackModal,
      callbackReason
    }
  },
  growerLifeSection {
    preHeader,
    headline,
    description,
    highlights[] {
      title
    }
  },
  photoGridSection {
    headline,
    photos[] {
      "url": asset->url,
      alt
    }
  },
  testimonialsSection {
    preHeader,
    headline,
    testimonials[] {
      quote,
      name,
      title,
      location
    }
  },
  appSection {
    preHeader,
    headline,
    description,
    features[] {
      title,
      description
    }
  },
  faqSection {
    preHeader,
    headline,
    items[] {
      question,
      answer
    },
    bottomLinkText,
    bottomLinkHref
  },
  ctaSection {
    headline,
    description,
    contactCardHeadline,
    ctaLinks[] {
      text,
      href,
      variant,
      opensCallbackModal,
      callbackReason
    }
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

// ── ASB Page (Avlerinfo Selvbetjening) ──

export const asbPageQuery = `*[_type == "asbPage"][0] {
  _id,
  title,
  hero {
    preHeadline,
    headline,
    introText
  },
  "heroImage": heroImage.asset->url,
  "heroImageAlt": heroImage.alt,
  heroCtaLinks[] {
    text,
    href,
    variant,
    opensCallbackModal,
    callbackReason
  },
  overviewSection {
    preHeader,
    heading,
    cards[] {
      title,
      description,
      "image": image.asset->url,
      "imageAlt": image.alt
    }
  },
  featuresSection {
    preHeader,
    heading,
    description,
    blocks[] {
      title,
      items,
      "image": image.asset->url,
      "imageAlt": image.alt
    }
  },
  driftLeveringSection {
    preHeader,
    heading,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt,
    bulletHeading,
    bullets,
    footnote
  },
  dueslagSection {
    preHeader,
    heading,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt,
    principlesHeading,
    principles[] {
      title,
      description
    },
    examplesHeading,
    examples[] {
      text,
      "image": image.asset->url,
      "imageAlt": image.alt
    }
  },
  kalenderSection {
    preHeader,
    heading,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt,
    bulletHeading,
    bullets
  },
  roadmapSection {
    preHeader,
    heading,
    description,
    currentItems,
    plannedHeading,
    plannedItems
  },
  downloadSection {
    preHeader,
    heading,
    appStoreUrl,
    googlePlayUrl,
    tip
  },
  faqSection {
    preHeader,
    headline,
    items[] {
      question,
      answer
    }
  },
  contactSection {
    preHeader,
    heading,
    description,
    ctaText,
    opensCallbackModal,
    callbackReason,
    ctaHref
  },
  seo {
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    noIndex
  }
}`

