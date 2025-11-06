# Changelog

All notable changes to the AKD website project.

## [Unreleased]

### Homepage Hero Section - 2024-11-06

#### Added
- **Complete hero section** with forest green background
  - Pre-headline: "VELKOMMEN TIL AKD" (caps, mint, Open Sans semi-bold, 18px)
  - Main headline: "ET MODERNE ANDELSSELSKAB med rødder I TRADITIONERNE"
    - White text, Open Sans extrabold, 64px
    - "med rødder" accent: Lora medium italic, 64px, mint color
    - Constrained to max-width (max-w-5xl) for better readability
  - Three-column CTA section below headline:
    - "Job & karriere", "Bliv andelshaver", "For andelshavere"
    - Section titles: Lora semibold italic, 32px, mint
    - Teaser text: Open Sans semi-bold, 18px, white
    - Links: Burnt orange, semi-bold, 18px with arrow icon
  - Overlapping white section with -200px margin
  - Responsive design for mobile, tablet, desktop

#### Changed
- **Font loading**: Added Open Sans 800 (extrabold) and Lora italic variants (500, 600)
- **Global CSS**: Added `.link-arrow` utility for burnt orange links with arrow icons
- **Link arrow animation**: Arrows translate 4px to the right on hover (300ms smooth transition)

#### Technical Details
- Hero section uses relative positioning with large bottom padding
- Overlapping section uses negative top margin (-200px) with z-index layering
- Custom inline font-family for Lora italic to ensure proper rendering
- Arrow icons use inline SVG for consistency

---

### Login Button Expanding Circle Effect - 2024-11-06

#### Added
- **Animated hover effect on login button**: Amber circle expands to fill entire button
  - Circle transitions from 42px to full button width
  - **350ms smooth animation** with `ease-out` timing (faster, more snappy)
  - **Text and icon remain static** - only background expands
  - **Text and icon change to charcoal** (#26251E) on hover for better contrast
  - Uses `::before` pseudo-element as expanding background layer
  - Circle starts positioned behind the icon on the right
  - Expands to cover entire button while maintaining rounded shape
  - Works on all breakpoints (desktop, tablet, mobile)

#### Technical Details
- Uses `::before` pseudo-element positioned absolutely
- Starts at 42px circle, expands to `calc(100% - 6px)` (accounting for padding)
- `z-index: 1` keeps it behind text (z-10) and icon (z-10)
- Icon container background set to transparent (circle shows through from ::before)
- Maintains `border-radius` throughout animation

---

### Sub Navigation Hover Effect - 2024-11-06

#### Added
- **Animated hover effect on sub nav items**: 4px bottom stroke that scales from center to full width
  - Uses CSS `::after` pseudo-element
  - Matches text color (`currentColor`)
  - 300ms smooth animation with `transform: scaleX()`
  - Scales from center (`transform-origin: center`)
  - Active items show solid burnt-orange border (no animation)

---

### Navigation Layout Update - 2024-11-06

#### Changed
- **Main navigation alignment**: Nav items now aligned to the right instead of center
  - Logo stays on the left
  - Added flex spacer to push nav items right
  - 32px gap (`ml-8`) between nav items and login button
  - Creates more balanced, modern layout

---

### Logo Components - 2024-11-06

#### Added
- **LogoColored.astro**: Full-color AKD logo with green (#006835) and gold (#a78034)
- **LogoWhite.astro**: White version of AKD logo for dark backgrounds
- Both logos are proper SVG components with:
  - Correct viewBox and proportions (385x69)
  - Accessibility label
  - Configurable class prop for sizing
  - Smooth transition support

#### Changed
- **MainNav.astro**: Updated to use actual logo SVGs instead of placeholder text
  - Light theme uses `LogoColored`
  - Dark theme uses `LogoWhite`
  - **Logo sizing**: 180px wide on desktop (lg), 160px on tablet (md), 128px on mobile
  - **On scroll**: Shrinks to 120px (desktop), 100px (tablet), 80px (mobile)
  - Maintains proper aspect ratio with `h-auto`

---

### Login Button Alignment Fix - 2024-11-06

#### Changed
- **Login button circle alignment**: Amber circle now right-aligned inside button
  - Changed from `justify-between` to `ml-auto` for proper right alignment
  - Updated padding: `px-6` to `pl-6 pr-[3px]` to keep circle close to right edge
  - Text now uses `flex-1` to take available space
  - Maintains 3px padding on right for visual consistency

---

### Job Section Navigation Update - 2024-11-06

#### Changed
- **Updated Job & karriere navigation structure**: Now includes 4 sub-items instead of 3
  - Ledige stillinger (unchanged)
  - "Arbejde i AKD" renamed to "At arbejde hos AKD"
  - "Ansøgningsproces" removed
  - Added "Mød vores medarbejdere" (new page)
  - Added "Praktik, elev- og lærlingepladser" (new page)

#### Added
- **New page**: `moed-vores-medarbejdere.astro` - Employee testimonials with 6 profile cards
- **New page**: `praktik-elev-laerling.astro` - Information about internships, apprenticeships, and training positions
  - Covers 6 different educational areas
  - Application process section
  - Detailed information about each program type

#### Renamed
- `arbejde-i-akd.astro` → `at-arbejde-hos-akd.astro` (URL and title updated)

#### Removed
- `ansoegning.astro` - Application process page (no longer in navigation)

#### Technical Details
- Updated `navigation.ts` with new structure
- Updated `job/index.astro` to display 4 cards in a grid
- All new pages follow established design patterns
- Maintained accessibility and responsive design standards

---

### Navigation UI Updates - 2024-11-06

#### Changed
- **Main navigation shrinks on scroll**: Height reduces from 124px to 60px when user scrolls past 10px
- **Sub navigation parent label**: Changed font-weight from semibold to light for better visual hierarchy
- **Logo scales down**: Logo height reduces from 48px to 32px when navigation is scrolled
- **Smooth transitions**: Added 300ms transition for all height changes

#### Technical Details
- Updated `Navigation.astro`: Added 'scrolled' class toggle in scroll handler
- Updated `MainNav.astro`: Added CSS for `.scrolled` state with reduced heights and logo size
- Updated `SubNav.astro`: Changed parent label from `font-semibold` to `font-light`
- All transitions use CSS for smooth animations (300ms duration)

#### User Experience
- Navigation takes up less screen space when scrolling through content
- Maintains full visibility of logo and navigation items even when shrunk
- Smooth animation provides polished feel
- Sub navigation parent label is more subtle, putting focus on sub items

---

## Initial Build - 2024-11-06

### Added
- Complete two-level navigation system
- Light and dark theme variants
- Custom login button with burnt-orange background and amber circle
- Fixed positioning with scroll shadow
- Sub navigation with active states
- Full accessibility support (WCAG 2.1 AA)
- Responsive design foundation
- Complete documentation (NAVIGATION.md, NAVIGATION_BUILD_SUMMARY.md)

### Components Created
- `Navigation.astro` - Main wrapper component
- `MainNav.astro` - First-level navigation
- `SubNav.astro` - Second-level navigation
- `LoginButton.astro` - Custom CTA button
- `navigation.ts` - Data structure and helper functions

### Pages Created
- Homepage with dark theme navigation
- Job section overview
- Job listings page
- Work at AKD page
- Application process page

### Documentation
- Complete technical documentation
- Build summary with usage examples
- Testing checklist
- Troubleshooting guide

