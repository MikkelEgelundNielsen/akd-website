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
  
  // Contact form
  callbackReasons?: CallbackReason[]
  callbackFallbackEmail?: string

  // Links
  quickLinks?: LinkGroup[]
  tertiaryLinks?: Link[]
}

export interface CallbackReason {
  label: string
  email: string
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
  slug: string
  publishedAt: string
  excerpt?: string
  mainImage?: string
  mainImageAlt?: string
  body: PortableTextContent
  category?: 'news' | 'events' | 'jobs' | 'production'
  isPublic?: boolean
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
  manualTeaser?: string
  manualLink?: string
  thumbnail?: string
  category?: DashboardCategory
  videoUrl?: string
  videoTitle?: string
}

export interface DashboardKnowledge {
  _id: string
  _type: 'dashboardKnowledge'
  title: string
  items?: DashboardKnowledgeItem[]
  tools?: DashboardQuickLink[]
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

// Internship Page (singleton)
export interface InternshipPage {
  _id: string
  _type: 'internshipPage'
  title: string
  hero?: PageHero
  pathCards?: {
    title: string
    description: string
    icon?: string
    linkUrl?: string
    linkLabel?: string
  }[]
  contentBox?: ContentBoxSection
  workAreas?: {
    title: string
    description?: string
  }[]
  steps?: {
    title: string
    description: string
  }[]
  contactHeadline?: string
  contactText?: string
  contactPhone?: string
  contactEmail?: string
  faqItems?: {
    question: string
    answer: string
  }[]
  seo?: SEO
}

// Person Contact (reusable object)
export interface PersonContact {
  name: string
  imageUrl?: string
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

// Vidensbase Topic (individual document)
export interface VidensbaseTopic {
  _id: string
  _type: 'vidensbaseTopic'
  title: string
  slug: string            // resolved from slug.current in GROQ
  icon: string
  shortLabel: string
  content: PortableTextContent
  tableOfContents?: { id: string; title: string }[]
  relatedTopics?: {
    _id: string
    title: string
    slug: string
    icon: string
    shortLabel: string
  }[]
  seo?: SEO
}

// Vidensbase Page (singleton)
export interface VidensbasePage {
  _id: string
  _type: 'vidensbasePage'
  title: string
  hero?: PageHero
  searchPlaceholder?: string
  popularTopics?: { label: string; link?: string }[]
  categories?: VidensbaseTopic[]  // expanded from references
  usefulLinks?: { label: string; href: string; openInNewTab?: boolean }[]
  seo?: SEO
}

// Table Block (embedded in Portable Text)
export interface TableRow {
  _key: string
  cells: string[]
}

export interface TableBlock {
  _type: 'tableBlock'
  _key: string
  rows: TableRow[]
  hasHeaderRow?: boolean
}

// News Article (individual document)
export interface NewsArticle {
  _id: string
  _type: 'newsArticle'
  title: string
  slug: string              // resolved from slug.current in GROQ
  publishedAt: string
  excerpt?: string
  mainImage?: string        // resolved URL from GROQ
  mainImageAlt?: string
  body?: PortableTextContent
  sourceUrl?: string
  isPublic?: boolean
  showOnPortal?: boolean
  seo?: SEO
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

// About Page - stat item
export interface StatItem {
  value: string
  label: string
}

// About Page - fellowship section
export interface FellowshipSection {
  preHeader?: string
  heading: string
  imageUrl?: string
  imageAlt?: string
  bodyText?: PortableTextBlock[]
}

// About Page - video section
export interface AboutVideoSection {
  preHeader?: string
  heading?: string
  description?: string
  videoRef?: Video
}

// About Page - quick nav card
export interface QuickNavCard {
  title: string
  description?: string
  href: string
  icon?: string
  row?: number
}

// About Page (singleton)
export interface AboutPage {
  _id: string
  _type: 'aboutPage'
  title: string
  hero?: PageHero
  heroTheme?: 'green' | 'light'
  contentBox?: ContentBoxSection
  statsPreHeader?: string
  statsHeading?: string
  stats?: StatItem[]
  fellowship?: FellowshipSection
  video?: AboutVideoSection
  quickNavHeading?: string
  quickNavDescription?: string
  quickNavCards?: QuickNavCard[]
  seo?: SEO
}

// Responsibility Page - document section (CSR / Code of Conduct)
export interface ResponsibilityDocumentSection {
  preHeader?: string
  heading: string
  introText?: string
  documentsHeading?: string
  documents?: DocumentDownload[]
}

// Responsibility Page - klimaaftryk section
export interface KlimaaftrykSection {
  preHeader?: string
  heading: string
  subheading?: string
  content?: PortableTextContent
}

// Responsibility Page - CTA section
export interface ResponsibilityCtaSection {
  heading?: string
  description?: string
  linkText?: string
  linkHref?: string
}

// Responsibility Page (singleton)
export interface ResponsibilityPage {
  _id: string
  _type: 'responsibilityPage'
  title: string
  hero?: PageHero
  csrSection?: ResponsibilityDocumentSection
  codeOfConductSection?: ResponsibilityDocumentSection
  klimaaftrykSection?: KlimaaftrykSection
  ctaSection?: ResponsibilityCtaSection
  seo?: SEO
}

// ── Circular Production Page ──

export interface CircularPrinciple {
  title: string
  text: string
  icon?: string
}

export interface CircularProcessStep {
  title: string
  text: string
}

export interface CircularRelevanceItem {
  heading: string
  text: string
}

export interface CircularCtaButton {
  label: string
  href: string
}

export interface CircularProductionPage {
  _id: string
  _type: 'circularProductionPage'
  title: string
  hero?: PageHero
  primaryCtaText?: string
  primaryCtaUrl?: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  introSection?: {
    heading: string
    body?: PortableTextContent
  }
  contentBox?: ContentBoxSection
  processSection?: {
    heading: string
    introText?: string
    steps?: CircularProcessStep[]
  }
  byproductsSection?: {
    heading: string
    body?: PortableTextContent
    linkText?: string
    linkHref?: string
  }
  localSection?: {
    heading: string
    body?: PortableTextContent
  }
  energySection?: {
    heading: string
    body?: PortableTextContent
  }
  relevanceContentBox?: ContentBoxSection
  ctaSection?: {
    heading?: string
    introText?: string
    ctas?: CircularCtaButton[]
  }
  seo?: SEO
}

// ── TraceIT Page ──

export interface TraceItBenefit {
  title: string
  text: string
}

export interface TraceItStep {
  title: string
  text: string
}

export interface TraceItNotice {
  title: string
  text: string
}

export interface TraceItFaqItem {
  question: string
  answer: string
}

export interface TraceItCtaButton {
  label: string
  href: string
}

export interface TraceItPage {
  _id: string
  _type: 'traceItPage'
  title: string
  hero?: PageHero
  primaryCtaText?: string
  primaryCtaUrl?: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  contentBox?: ContentBoxSection
  introSection?: {
    heading: string
    body?: PortableTextContent
  }
  benefitsSection?: {
    heading: string
    benefits?: TraceItBenefit[]
  }
  insightSection?: {
    heading: string
    body?: PortableTextContent
  }
  videoSection?: {
    preHeader?: string
    heading?: string
    description?: string
    videoRef?: Video
  }
  stepsSection?: {
    heading: string
    steps?: TraceItStep[]
  }
  dataQualitySection?: {
    heading: string
    body?: PortableTextContent
  }
  noticesSection?: {
    heading: string
    notices?: TraceItNotice[]
  }
  whoCanSendSection?: {
    heading: string
    body?: PortableTextContent
  }
  helpSection?: {
    heading: string
    body?: PortableTextContent
    ctaText?: string
    ctaHref?: string
  }
  faqSection?: {
    preHeader?: string
    headline?: string
    items?: TraceItFaqItem[]
  }
  ctaSection?: {
    heading?: string
    introText?: string
    ctas?: TraceItCtaButton[]
  }
  seo?: SEO
}

// ── Kartoffeludbytte Page ──

export interface KartoffelGuideCard {
  title: string
  text: string
  ctaText: string
  fileUrl?: string
  url?: string
}

export interface KartoffelFaqItem {
  question: string
  answer: string
}

export interface KartoffelCtaButton {
  label: string
  href: string
}

export interface KartoffeludbyttePage {
  _id: string
  _type: 'kartoffeludbyttePage'
  title: string
  hero?: PageHero
  primaryCtaText?: string
  primaryCtaUrl?: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  introSection?: {
    heading: string
    body?: PortableTextContent
  }
  guidesSection?: {
    heading: string
    guides?: KartoffelGuideCard[]
  }
  videoSection?: {
    preHeader?: string
    heading?: string
    description?: string
    videoRef?: Video
  }
  helpSection?: {
    heading: string
    body?: PortableTextContent
    ctaText?: string
    ctaHref?: string
  }
  faqSection?: {
    preHeader?: string
    headline?: string
    items?: KartoffelFaqItem[]
  }
  ctaSection?: {
    heading?: string
    introText?: string
    ctas?: KartoffelCtaButton[]
  }
  seo?: SEO
}

// ── Kontakt Page ──

export interface KontaktHeadquarters {
  label?: string
  name: string
  addressLines: string[]
  phone?: string
  email?: string
  openingHours?: string[]
  mapsLink?: string
  imageUrl?: string
  imageAlt?: string
  cvr?: string
}

export interface KontaktFactory {
  label?: string
  name: string
  addressLines: string[]
  openingHours?: string[]
  mapsEmbed?: string
  mapsLink?: string
}

export interface KontaktChannel {
  title: string
  description?: string
  email: string
  icon?: 'mail' | 'globe' | 'briefcase'
}

export interface KontaktChannelsSection {
  preHeader?: string
  headline?: string
  description?: string
  channels?: KontaktChannel[]
}

export interface KontaktWhistleblower {
  headline?: string
  description?: string
  linkText?: string
  linkHref?: string
}

export interface KontaktPage {
  _id: string
  _type: 'kontaktPage'
  title: string
  hero?: PageHero
  headquarters?: KontaktHeadquarters
  factories?: KontaktFactory[]
  contactChannels?: KontaktChannelsSection
  whistleblower?: KontaktWhistleblower
  seo?: SEO
}

// ── Rest- og biprodukter Page ──

export interface NutrientRow {
  name: string
  content: string
  price: string
  total100: string
  totalAdj: string
}

export interface FreightRow {
  label: string
  v10: string
  v40: string
  v80: string
  v120: string
}

export interface RestDocumentItem {
  label: string
  fileUrl?: string
  url?: string
}

export interface RestQuickNavCard {
  title: string
  description?: string
  anchor: string
  icon?: string
}

export interface RestProtamylasseSection {
  preHeader?: string
  headline?: string
  introText?: string
  contentBlocks?: { headline: string; body: string }[]
  maskinstationer?: string[]
  afhentningHeadline?: string
  afhentningText?: string
  tildeltMaengde?: { headline: string; body: string }
  pris?: { headline: string; body: string }
  nutrientTable?: {
    headline: string
    rows: NutrientRow[]
    totalRaw: string
    totalAdj: string
    avlerPrice: string
    footnote?: string
  }
  freightTable?: {
    headline: string
    rows: FreightRow[]
  }
  deklarationer?: {
    headline: string
    documents: RestDocumentItem[]
  }
}

export interface RestPulpSection {
  preHeader?: string
  headline?: string
  introText?: string
  bodyText?: string
  documents?: {
    headline: string
    items: RestDocumentItem[]
  }
}

export interface RestRestprodukterSection {
  preHeader?: string
  headline?: string
  body?: string
  document?: RestDocumentItem
  externalLinkText?: string
  externalLinkHref?: string
}

export interface RestContactPerson {
  name: string
  role?: string
  phone?: string
  email?: string
}

export interface RestContactSection {
  headline?: string
  description?: string
  contacts?: RestContactPerson[]
}

// ── Andele Page ──

export interface AndeleLejeaftalerSection {
  preHeader?: string
  heading?: string
  content?: PortableTextContent
}

export interface AndeleKoebSalgSection {
  preHeader?: string
  heading?: string
  content?: PortableTextContent
  documents?: Array<{ title: string; fileUrl?: string; url?: string }>
  financingNote?: string
}

export interface AndeleFinansieringSection {
  preHeader?: string
  heading?: string
  content?: PortableTextContent
}

export interface AndeleCtaSection {
  heading?: string
  description?: string
  linkText?: string
  linkHref?: string
}

export interface AndelePage {
  _id: string
  _type: 'andelePage'
  title: string
  hero?: PageHero
  lejeaftalerSection?: AndeleLejeaftalerSection
  koebSalgSection?: AndeleKoebSalgSection
  finansieringSection?: AndeleFinansieringSection
  ctaSection?: AndeleCtaSection
  seo?: SEO
}

// ── Rest- og biprodukter Page ──

export interface RestOgBiprodukterPage {
  _id: string
  _type: 'restOgBiprodukterPage'
  title: string
  hero?: PageHero
  quickNavCards?: RestQuickNavCard[]
  protamylasseSection?: RestProtamylasseSection
  pulpSection?: RestPulpSection
  restprodukterSection?: RestRestprodukterSection
  contactSection?: RestContactSection
  seo?: SEO
}

// ── Bliv Andelshaver Page ──

export interface BlivAndelshaverContactPerson {
  name: string
  role?: string
  imageUrl?: string
  imageAlt?: string
  phoneHref?: string
  phoneLabel?: string
  callbackReason?: string
  callbackLabel?: string
}

export interface CheckmarkItem {
  title: string
  description?: string
}

export interface BlivAndelshaverContactSection {
  preHeader?: string
  headline?: string
  checkmarkItems?: CheckmarkItem[]
}

export interface ValuePillar {
  title: string
  description?: string
}

export interface BlivAndelshaverBenefitsSection {
  preHeader?: string
  headline?: PortableTextBlock[]
  pillars?: ValuePillar[]
}

export interface ProcessStep {
  number: number
  title: string
  description?: string
}

export interface CtaLink {
  text: string
  href: string
  variant?: 'primary' | 'secondary'
  opensCallbackModal?: boolean
  callbackReason?: string
}

export interface BlivAndelshaverProcessSection {
  preHeader?: string
  headline?: PortableTextBlock[]
  steps?: ProcessStep[]
  ctaLinks?: CtaLink[]
}

export interface GrowerHighlight {
  title: string
}

export interface BlivAndelshaverGrowerLifeSection {
  preHeader?: string
  headline?: PortableTextBlock[]
  description?: string
  highlights?: GrowerHighlight[]
}

export interface BlivAndelshaverPhotoGallery {
  _id: string
  title?: string
  images: PhotoGalleryImage[]
}

export interface Testimonial {
  quote: string
  name: string
  title?: string
  location?: string
}

export interface BlivAndelshaverTestimonialsSection {
  preHeader?: string
  headline?: PortableTextBlock[]
  testimonials?: Testimonial[]
}

export interface AppFeature {
  title: string
  description?: string
}

export interface BlivAndelshaverAppSection {
  preHeader?: string
  headline?: PortableTextBlock[]
  description?: string
  features?: AppFeature[]
}

export interface BlivAndelshaverFaqItem {
  question: string
  answer: string
}

export interface BlivAndelshaverFaqSection {
  preHeader?: string
  headline?: string
  items?: BlivAndelshaverFaqItem[]
  bottomLinkText?: string
  bottomLinkHref?: string
}

export interface BlivAndelshaverCtaSection {
  headline?: PortableTextBlock[]
  description?: string
  contactCardHeadline?: string
  ctaLinks?: CtaLink[]
}

export interface BlivAndelshaverPage {
  _id: string
  _type: 'blivAndelshaverPage'
  title: string
  hero?: PageHero
  contactPerson?: BlivAndelshaverContactPerson
  contactSection?: BlivAndelshaverContactSection
  benefitsSection?: BlivAndelshaverBenefitsSection
  processSection?: BlivAndelshaverProcessSection
  growerLifeSection?: BlivAndelshaverGrowerLifeSection
  photoGallery?: BlivAndelshaverPhotoGallery
  testimonialsSection?: BlivAndelshaverTestimonialsSection
  appSection?: BlivAndelshaverAppSection
  faqSection?: BlivAndelshaverFaqSection
  ctaSection?: BlivAndelshaverCtaSection
  seo?: SEO
}

// ── ASB Page (Avlerinfo Selvbetjening) ──

export interface AsbOverviewCard {
  title: string
  description?: string
  image?: string
  imageAlt?: string
}

export interface AsbOverviewSection {
  preHeader?: string
  heading?: string
  cards?: AsbOverviewCard[]
}

export interface AsbFeatureBlock {
  title: string
  items?: string[]
  image?: string
  imageAlt?: string
}

export interface AsbFeaturesSection {
  preHeader?: string
  heading?: string
  description?: string
  blocks?: AsbFeatureBlock[]
}

export interface AsbDriftLeveringSection {
  preHeader?: string
  heading?: string
  description?: string
  image?: string
  imageAlt?: string
  bulletHeading?: string
  bullets?: string[]
  footnote?: string
}

export interface AsbPrinciple {
  title: string
  description?: string
}

export interface AsbDueslagExample {
  text: string
  image?: string
  imageAlt?: string
}

export interface AsbDueslagSection {
  preHeader?: string
  heading?: string
  description?: string
  image?: string
  imageAlt?: string
  principlesHeading?: string
  principles?: AsbPrinciple[]
  examplesHeading?: string
  examples?: AsbDueslagExample[]
}

export interface AsbKalenderSection {
  preHeader?: string
  heading?: string
  description?: string
  image?: string
  imageAlt?: string
  bulletHeading?: string
  bullets?: string[]
}

export interface AsbRoadmapSection {
  preHeader?: string
  heading?: string
  description?: string
  currentItems?: string[]
  plannedHeading?: string
  plannedItems?: string[]
}

export interface AsbDownloadSection {
  preHeader?: string
  heading?: string
  appStoreUrl?: string
  googlePlayUrl?: string
  tip?: string
}

export interface AsbFaqItem {
  question: string
  answer: string
}

export interface AsbFaqSection {
  preHeader?: string
  headline?: string
  items?: AsbFaqItem[]
}

export interface AsbContactSection {
  preHeader?: string
  heading?: string
  description?: string
  ctaText?: string
  opensCallbackModal?: boolean
  callbackReason?: string
  ctaHref?: string
}

export interface AsbHeroCtaLink {
  text: string
  href: string
  variant?: 'primary' | 'secondary'
  opensCallbackModal?: boolean
  callbackReason?: string
}

export interface AsbPage {
  _id: string
  _type: 'asbPage'
  title: string
  hero?: PageHero
  heroImage?: string
  heroImageAlt?: string
  heroCtaLinks?: AsbHeroCtaLink[]
  overviewSection?: AsbOverviewSection
  featuresSection?: AsbFeaturesSection
  driftLeveringSection?: AsbDriftLeveringSection
  dueslagSection?: AsbDueslagSection
  kalenderSection?: AsbKalenderSection
  roadmapSection?: AsbRoadmapSection
  downloadSection?: AsbDownloadSection
  faqSection?: AsbFaqSection
  contactSection?: AsbContactSection
  seo?: SEO
}

// ── Levering og kampagne section ──

export interface NavCard {
  title: string
  description?: string
  href: string
}

export interface TextSection {
  heading: string
  body?: any[]
}

export interface ProcessStep {
  title: string
  text: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface CtaButton {
  label: string
  href: string
}

export interface CtaSection {
  heading?: string
  introText?: string
  ctas?: CtaButton[]
}

export interface LeveringKampagnePage {
  _id: string
  _type: 'leveringKampagnePage'
  title: string
  hero?: PageHero
  statusBox?: {
    heading?: string
    body?: any[]
  }
  navCards?: NavCard[]
  introSection?: {
    preHeader?: string
    heading?: string
    body?: any[]
  }
  processSection?: {
    heading?: string
    steps?: ProcessStep[]
  }
  linksSection?: {
    heading?: string
    links?: CtaButton[]
  }
  seo?: SEO
}

export interface KampagneOgLeveringPage {
  _id: string
  _type: 'kampagneOgLeveringPage'
  title: string
  hero?: PageHero
  navCards?: NavCard[]
  highlightBox?: {
    heading?: string
    body?: any[]
  }
  sections?: TextSection[]
  faqSection?: {
    heading?: string
    items?: FAQItem[]
  }
  ctaSection?: CtaSection
  seo?: SEO
}

export interface PrincipleCard {
  title: string
  description: string
}

export interface TransportOgVilkarPage {
  _id: string
  _type: 'transportOgVilkarPage'
  title: string
  hero?: PageHero
  navCards?: NavCard[]
  principleCards?: PrincipleCard[]
  sections?: TextSection[]
  ctaSection?: CtaSection
  seo?: SEO
}

export interface DocLink {
  label: string
  href?: string
  fileUrl?: string
}

export interface VejningOgAfregningPage {
  _id: string
  _type: 'vejningOgAfregningPage'
  title: string
  hero?: PageHero
  navCards?: NavCard[]
  processSection?: {
    heading?: string
    steps?: ProcessStep[]
  }
  sections?: TextSection[]
  documentsSection?: {
    heading?: string
    links?: DocLink[]
  }
  faqSection?: {
    heading?: string
    items?: FAQItem[]
  }
  seo?: SEO
}

