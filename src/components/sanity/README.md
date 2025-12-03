# Sanity Components

Reusable components for rendering Sanity CMS content.

## PortableText.astro

Renders Portable Text (rich text) content from Sanity with support for:
- Headings (H2, H3, H4)
- Text formatting (bold, italic, **mint accent**)
- Links (internal and external)
- Lists (bullet and numbered)
- Callout boxes
- Images with captions

### Usage

```astro
---
import PortableText from '@/components/sanity/PortableText.astro'
import { sanityClient } from '@/lib/sanity'

const page = await sanityClient.fetch(query)
---

<PortableText 
  content={page.content} 
  addHeadingIds={true}
  class="max-w-3xl"
/>
```

### Props

- `content` (required): Portable Text array from Sanity
- `addHeadingIds` (optional): Add ID attributes to H2 headings for TOC linking (default: false)
- `class` (optional): Additional CSS classes

### Mint Accent

Text marked with "mint accent" in Sanity will render as:
```html
<span class="font-serif italic text-mint">Highlighted text</span>
```

Example: "COOKIE & **PRIVATLIVSPOLITIK**" where PRIVATLIVSPOLITIK has mint accent.

### Callout Boxes

Callout blocks from Sanity render as:
```html
<div class="callout">
  <p><strong>Vigtigt:</strong> Your important message here.</p>
</div>
```

Styled with:
- Light background (#F7F7F4)
- Mint left border (#10E397)
- Rounded right corners
- Padding for readability


