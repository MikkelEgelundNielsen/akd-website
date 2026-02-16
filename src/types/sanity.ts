/**
 * TypeScript types for Sanity CMS content
 * Generated based on Sanity schemas
 */

// Common types
export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface Slug {
  current: string
  _type: 'slug'
}

// SEO
export interface SEO {
  metaTitle?: string
  metaDescription?: string
  openGraphImage?: SanityImage
  noIndex?: boolean
}

// Links
export interface Link {
  title: string
  href: string
  openInNewTab?: boolean
}

export interface LinkGroup {
  title: string
  links: Link[]
}

// Portable Text (Rich Text)
export interface PortableTextBlock {
  _key: string
  _type: string
  children?: Array<{
    _key: string
    _type: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
    openInNewTab?: boolean
  }>
  style?: 'normal' | 'h2' | 'h3' | 'h4'
  listItem?: 'bullet' | 'number'
}

export interface CalloutBlock {
  _type: 'calloutBlock'
  _key: string
  content: PortableTextBlock[]
}

export type PortableTextContent = Array<PortableTextBlock | CalloutBlock | (SanityImage & {_type: 'image'})>

// TOC
export interface TOCSection {
  id: Slug
  title: string
}

// Site Settings
export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  title: string
  description?: string
  logo?: SanityImage
  defaultSeo?: SEO
  favicon?: SanityImage
  
  // Contact
  companyName?: string
  cvr?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    zipCode?: string
    city?: string
    country?: string
  }
  socialMedia?: {
    linkedin?: string
    facebook?: string
    instagram?: string
  }
  
  // Footer
  footerDescription?: string
  footerCtaText?: string
  footerCtaLink?: string
  andelshavereTitle?: string
  andelshavereDescription?: string
  andelshavereLoginLink?: string
  
  // Links
  quickLinks?: LinkGroup[]
  tertiaryLinks?: Link[]
}

// Navigation
export interface SubMenuItem {
  label: string
  href: string
  description?: string
}

export interface MenuItem {
  label: string
  href: string
  subItems?: SubMenuItem[]
}

export interface Navigation {
  _id: string
  _type: 'navigation'
  title: string
  menuItems: MenuItem[]
}

// Andelshavere Navigation
export interface AndelshavereMenuItem {
  label: string
  linkType: 'internal' | 'manual'
  href: string
  description?: string
  icon?: string
}

export interface AndelshavereNavigation {
  _id: string
  _type: 'andelshavereNavigation'
  title: string
  menuItems: AndelshavereMenuItem[]
}

// General Page
export interface GeneralPage {
  _id: string
  _type: 'generalPage'
  title: string
  slug: Slug
  preHeader?: string
  headline: PortableTextBlock[]
  showTableOfContents?: boolean
  tableOfContents?: TOCSection[]
  content: PortableTextContent
  seo?: SEO
  publishedAt?: string
  updatedAt?: string
}

// Article
export interface Article {
  _id: string
  _type: 'article'
  title: string
  slug: Slug
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
  body: PortableTextContent
  category?: 'news' | 'events' | 'jobs' | 'production'
}

// Page (Legacy)
export interface Page {
  _id: string
  _type: 'page'
  title: string
  slug: Slug
  description?: string
  content: PortableTextContent
}

// Dashboard Types

export type DashboardCategory = 'drift-kampagne' | 'oekonomi' | 'generelt'

export interface DashboardNews {
  _id: string
  _type: 'dashboardNews'
  title: string
  slug: Slug
  publishedAt: string
  category: DashboardCategory
  contentType: 'article' | 'video'
  excerpt?: string
  link?: string
  videoUrl?: string     // resolved from videoRef->videoFile.asset->url
  videoTitle?: string   // resolved from videoRef->title
}

export interface DashboardStreamer {
  _id: string
  _type: 'dashboardStreamer'
  isActive: boolean
  icon: 'warning' | 'info' | 'urgent'
  title: string
  message: string
  link?: string
  linkText?: string
}

export interface DashboardKnowledgeTopic {
  label: string
  link?: string
}

export interface DashboardKnowledgeItem {
  contentType: 'article' | 'video'
  articleRef?: {
    _id: string
    title: string
    slug: Slug
    excerpt?: string
    mainImage?: string
  }
  manualTitle?: string
  manualLink?: string
  thumbnail?: string
  category?: DashboardCategory
  videoUrl?: string     // resolved from videoRef->videoFile.asset->url
  videoTitle?: string   // resolved from videoRef->title
}

export interface DashboardKnowledge {
  _id: string
  _type: 'dashboardKnowledge'
  title: string
  searchPlaceholder?: string
  searchLink?: string
  popularTopics?: DashboardKnowledgeTopic[]
  items?: DashboardKnowledgeItem[]
}

export interface DashboardQuickLink {
  label: string
  href: string
  openInNewTab?: boolean
}

export interface DashboardQuickLinks {
  _id: string
  _type: 'dashboardQuickLinks'
  title: string
  links?: DashboardQuickLink[]
}

// Employee Story (individual document)
export interface EmployeeStory {
  _id: string
  _type: 'employeeStory'
  name: string
  jobTitle: string
  department: string
  location: string
  quote: string
  description: string
  image: string       // resolved URL from GROQ
  imageAlt: string
  startDate: string   // ISO date
}

// Page Hero (reusable object)
export interface PageHero {
  preHeadline?: string
  headline?: PortableTextBlock[]
  introText?: PortableTextBlock[]
}

// Meet Employees Page (singleton)
export interface MeetEmployeesPageDepartment {
  title: string
  employees: EmployeeStory[]
}

export interface MeetEmployeesPage {
  _id: string
  _type: 'meetEmployeesPage'
  title: string
  hero?: PageHero
  departments: MeetEmployeesPageDepartment[]
  primaryCtaText?: string
  primaryCtaUrl?: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  seo?: SEO
}

// Job Listing (individual document)
export interface JobListing {
  _id: string
  _type: 'jobListing'
  title: string
  slug: string              // resolved from slug.current in GROQ
  description: string
  location: string
  department?: string
  isActive: boolean
  publishedAt?: string
  body?: PortableTextBlock[] // rich text for the detail page
  applicationUrl?: string
  applicationDeadline?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  externalPartner?: string
  employees?: EmployeeStory[] // expanded references for the detail page
  seo?: SEO
}

// Photo Gallery (reusable document)
export interface PhotoGalleryImage {
  url: string
  alt: string
}

export interface PhotoGallery {
  _id: string
  _type: 'photoGallery'
  title: string
  images: PhotoGalleryImage[]
}

// Content Box Section (reusable object)
export interface ContentBoxItem {
  title: string
  description: string
  icon: 'arrow' | 'check'
  href?: string
}

export interface ContentBoxSection {
  variant?: 'light' | 'dark'
  layout?: 'split' | 'full-width'
  preHeader?: string
  headline: string
  image: string       // resolved URL from GROQ
  imageAlt: string
  pullUp?: number
  items: ContentBoxItem[]
}

// Working at AKD Page (singleton)
export interface WorkingAtAkdPage {
  _id: string
  _type: 'workingAtAkdPage'
  title: string
  hero?: PageHero
  contentBox?: ContentBoxSection
  photoGallery?: PhotoGallery
  primaryCtaText?: string
  primaryCtaUrl?: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  seo?: SEO
}

// Open Application Page (singleton)
export interface OpenApplicationPage {
  _id: string
  _type: 'openApplicationPage'
  title: string
  hero?: PageHero
  body?: PortableTextBlock[]
  contactEmail: string
  contactName?: string
  contactTitle?: string
  contactPhone?: string
  primaryCtaText?: string
  primaryCtaUrl?: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  seo?: SEO
}

// Person Contact (reusable object)
export interface PersonContact {
  name: string
  role?: string
  address?: string
  phone?: string
  mobile?: string
  email: string
}

// Document Download (reusable object)
export interface DocumentDownload {
  title: string
  fileUrl?: string   // resolved from file.asset->url in GROQ
  url?: string       // external URL alternative
}

// Document Group (inline object in reportsPage)
export interface DocumentGroup {
  title: string
  description?: string
  documents: DocumentDownload[]
}

// Board Page (singleton)
export interface BoardPage {
  _id: string
  _type: 'boardPage'
  title: string
  hero?: PageHero
  members: PersonContact[]
  seo?: SEO
}

// Management Page (singleton)
export interface ManagementPage {
  _id: string
  _type: 'managementPage'
  title: string
  hero?: PageHero
  members: PersonContact[]
  seo?: SEO
}

// Reports Page (singleton)
export interface ReportsPage {
  _id: string
  _type: 'reportsPage'
  title: string
  hero?: PageHero
  documentGroups: DocumentGroup[]
  seo?: SEO
}

// Video (reusable document)
export interface Video {
  _id: string
  _type: 'video'
  title: string
  description?: string
  videoUrl: string      // resolved from videoFile.asset->url
  thumbnail?: string    // resolved from thumbnail.asset->url
  thumbnailAlt?: string
  duration?: string
}

// Job Listings Page (singleton)
export interface JobListingsPage {
  _id: string
  _type: 'jobListingsPage'
  title: string
  hero?: PageHero
  listingsHeadline?: string
  listingsCtaPrimaryText?: string
  listingsCtaPrimaryUrl?: string
  listingsCtaSecondaryText?: string
  listingsCtaSecondaryUrl?: string
  contentBox?: ContentBoxSection
  bottomCtaPrimaryText?: string
  bottomCtaPrimaryUrl?: string
  bottomCtaSecondaryText?: string
  bottomCtaSecondaryUrl?: string
  seo?: SEO
}

