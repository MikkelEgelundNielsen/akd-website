# TextPage Template

A reusable template for content-heavy pages with automatic table of contents and scroll spy.

## Overview

The TextPage template provides a clean, readable layout for legal documents, knowledge base articles, and other text-heavy content. It features:

- Hero section with pre-header and headline
- Automatic table of contents (TOC) sidebar (desktop) or accordion (mobile)
- Scroll spy that highlights the current section
- Smooth scrolling to anchors
- Responsive typography optimized for readability
- Progressive enhancement based on device capabilities

## Usage

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro'
import TextPage from '@/components/templates/TextPage.astro'

// Define the sections for the table of contents
// Each section must have a matching H2 with id attribute
const sections = [
  { id: 'intro', title: 'Introduktion' },
  { id: 'hovedpunkter', title: 'Hovedpunkter' },
  { id: 'kontakt', title: 'Kontakt' }
]
---

<BaseLayout title="Side titel | AKD Danmark">
  <TextPage
    preHeader="Kategori" (optional)
    headline="SIDE <span class='text-mint'>OVERSKRIFT</span>"
    sections={sections}
  >
    <!-- Your content with H2 sections -->
    <h2 id="intro">Introduktion</h2>
    <p>Indhold...</p>
    
    <h2 id="hovedpunkter">Hovedpunkter</h2>
    <p>Mere indhold...</p>
    
    <h2 id="kontakt">Kontakt</h2>
    <p>Kontakt information...</p>
  </TextPage>
</BaseLayout>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `preHeader` | `string` | No | Small uppercase label above headline (e.g., "JURIDISK INFORMATION") |
| `headline` | `string` | Yes | Main page headline (HTML allowed for styling with `<span class='text-mint'>`) |
| `sections` | `Section[]` | Yes | Array of section objects for TOC |

### Section Object

```typescript
interface Section {
  id: string      // Must match the id attribute of corresponding H2
  title: string   // Display text in TOC
}
```

## Typography System

The template includes a custom prose styling system (`.prose-akd`) with the following hierarchy:

### Headers

```html
<!-- H2 - Main sections (Lora bold italic, 34px) -->
<h2 id="section-id">Section Headline</h2>

<!-- H3 - Sub-sections (Open Sans semibold, 28px) -->
<h3>Sub-section Headline</h3>

<!-- H4 - Minor sections (Open Sans semibold, 20px) -->
<h4>Minor Headline</h4>
```

### Text Elements

```html
<!-- Regular paragraph (Open Sans regular, 16px) -->
<p>Body text content...</p>

<!-- Lists -->
<ul>
  <li>Unordered list item</li>
</ul>

<ol>
  <li>Ordered list item</li>
</ol>

<!-- Bold text -->
<strong>Important text</strong>

<!-- Links -->
<a href="/page">Link text</a>
```

### Special Elements

```html
<!-- Callout box - highlighted information -->
<div class="callout">
  <p><strong>Vigtigt:</strong> This is important information.</p>
</div>

<!-- Tables -->
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

## Table of Contents Features

### Desktop (≥1024px)

- **Sticky sidebar** on the right side
- **Scroll spy** automatically highlights the current section
- Smooth visual transitions
- Mint green border indicator on active section
- Always visible while scrolling

### Mobile (<1024px)

- **Collapsible accordion** at the top of content
- Collapses after clicking a link
- No scroll spy (performance optimization)
- Not sticky (better mobile UX)

## Responsive Behavior

The template adapts to different screen sizes:

| Breakpoint | Layout | TOC Behavior |
|------------|--------|--------------|
| Mobile (< 1024px) | Single column | Accordion (collapsible) |
| Desktop (≥ 1024px) | Two columns | Sticky sidebar with scroll spy |

## Content Guidelines

### Section IDs

- Always add `id` attributes to your H2 elements
- IDs must match those in the `sections` array
- Use kebab-case: `id="dine-rettigheder"`
- Keep IDs descriptive and URL-friendly

### Headline Styling

You can add color accents to headlines using inline HTML:

```astro
<TextPage
  headline="COOKIE & <span class='text-mint'>PRIVATLIVSPOLITIK</span>"
  sections={sections}
>
```

### Content Structure

```astro
<TextPage ...>
  
  <!-- Each major section should be an H2 with matching id -->
  <h2 id="first-section">First Section</h2>
  <p>Introduction paragraph...</p>
  
  <!-- Sub-sections use H3 -->
  <h3>Sub-topic</h3>
  <p>Details about sub-topic...</p>
  
  <!-- Important callouts -->
  <div class="callout">
    <p><strong>Note:</strong> Important information stands out.</p>
  </div>
  
  <!-- Lists for structured information -->
  <ul>
    <li>Point one</li>
    <li>Point two</li>
  </ul>
  
  <!-- Next major section -->
  <h2 id="second-section">Second Section</h2>
  <p>Content continues...</p>
  
</TextPage>
```

## Accessibility Features

- **Semantic HTML**: Proper use of `<article>`, `<nav>`, `<h2>`-`<h4>` hierarchy
- **Aria labels**: Navigation landmarks properly labeled
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Smooth scrolling**: With offset for fixed navigation
- **Focus management**: Clear focus indicators on interactive elements

## JavaScript Functionality

The template includes three main interactive features:

### 1. Mobile Accordion Toggle

```javascript
// Expands/collapses TOC on mobile
// Automatically collapses when clicking a link
```

### 2. Desktop Scroll Spy

```javascript
// Only runs on desktop (≥1024px)
// Uses IntersectionObserver for performance
// Highlights current section in TOC
```

### 3. Smooth Scroll

```javascript
// All anchor links scroll smoothly
// Accounts for fixed navigation (120px offset)
// Works on all screen sizes
```

## Example Pages

### Cookie & Privacy Policy

```astro
---
const sections = [
  { id: 'cookies', title: 'Cookies' },
  { id: 'persondata', title: 'Behandling af persondata' },
  { id: 'formaal', title: 'Formål med databehandling' },
  { id: 'dine-rettigheder', title: 'Dine rettigheder' },
  { id: 'kontakt', title: 'Kontakt' }
]
---

<TextPage
  preHeader="Juridisk information"
  headline="COOKIE & <span class='text-mint'>PRIVATLIVSPOLITIK</span>"
  sections={sections}
>
  <h2 id="cookies">Cookies</h2>
  <!-- Content -->
  
  <h2 id="persondata">Behandling af persondata</h2>
  <!-- Content -->
  
  <!-- ... -->
</TextPage>
```

### Knowledge Base Article

```astro
---
const sections = [
  { id: 'oversigt', title: 'Oversigt' },
  { id: 'kampagne', title: 'Kampagnevilkår' },
  { id: 'levering', title: 'Levering' }
]
---

<TextPage
  preHeader="For andelshavere"
  headline="ALT OM <span class='text-mint'>ÅRETS KAMPAGNE</span>"
  sections={sections}
>
  <h2 id="oversigt">Oversigt</h2>
  <p>Kampagnen starter...</p>
  
  <h3>Vigtige datoer</h3>
  <ul>
    <li>Start: 1. september</li>
    <li>Slut: 30. november</li>
  </ul>
  
  <!-- ... -->
</TextPage>
```

## Best Practices

### 1. Keep Sections Focused

- Each H2 section should cover one main topic
- Use H3 for sub-topics within a section
- Limit TOC to 5-8 sections for best UX

### 2. Write Descriptive Section Titles

```html
<!-- Good -->
<h2 id="dine-rettigheder">Dine rettigheder</h2>

<!-- Avoid -->
<h2 id="section-3">Section 3</h2>
```

### 3. Use Callouts for Important Info

Highlight critical information that users shouldn't miss:

```html
<div class="callout">
  <p><strong>Vigtigt:</strong> Deadline er 30. november 2024.</p>
</div>
```

### 4. Break Up Long Text

- Use lists for multiple points
- Add sub-sections (H3) for readability
- Include visual breaks with callouts or tables
- Keep paragraphs concise (3-5 lines)

### 5. Optimize for Scanning

- Use descriptive headings
- Bold key terms on first use
- Put important info in callouts
- Use lists instead of long paragraphs

## Styling Customization

The prose styling is defined in the `<style>` block of `TextPage.astro`. Common customizations:

```css
/* Adjust heading sizes */
.prose-akd :global(h2) {
  @apply text-[36px]; /* Increase from 34px */
}

/* Change link colors */
.prose-akd :global(a) {
  @apply text-forest-green hover:text-mint;
}

/* Customize callout appearance */
.prose-akd :global(.callout) {
  @apply bg-mint/10 border-mint;
}
```

## Performance Considerations

- **Scroll spy only on desktop**: Mobile devices get simpler, faster experience
- **Intersection Observer API**: Efficient scroll detection
- **Conditional JavaScript**: Features only load where needed
- **No external dependencies**: Pure vanilla JavaScript
- **Optimized re-renders**: Minimal DOM manipulation

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Intersection Observer polyfill recommended for IE11 (if needed)

## File Location

`/src/components/templates/TextPage.astro`

## Related Files

- `/src/pages/cookie-privatlivspolitik.astro` - Example implementation
- `/src/styles/global.css` - Global typography base styles

