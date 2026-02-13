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

