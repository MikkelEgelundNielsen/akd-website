# ContentBox Component Implementation

## Summary

Successfully refactored three similar content sections on the front page into a single, reusable `ContentBox` component. This component is now ready for CMS integration and provides a consistent, modular approach to displaying image-content layouts.

## What Was Done

### 1. Created Reusable Component

**File**: `/src/components/sections/ContentBox.astro`

A flexible component that supports:
- Two visual variants (light/dark)
- Image + content grid layout
- Multiple content items with icons (arrows or checkmarks)
- Optional clickable items
- Optional negative margin for overlapping effects

### 2. Refactored Front Page Sections

**File**: `/src/pages/index.astro`

Replaced three hardcoded sections with the ContentBox component:

#### A. "AKD I TAL" Section (Line ~81)
**Before**: ~70 lines of hardcoded HTML
**After**: 23 lines using ContentBox

```astro
<ContentBox
  variant="light"
  preHeader="AKD i tal"
  headline="Et stærkt fællesskab med kapacitet til mere"
  imageUrl="/images/akd-factory.jpg"
  imageAlt="AKD's fabriksanlæg i Brande"
  pullUp={true}
  items={[...4 stat items with arrows]}
/>
```

#### B. "Bliv Andelshaver" Section (Line ~273)
**Before**: ~80 lines of hardcoded HTML
**After**: 23 lines using ContentBox

```astro
<ContentBox
  variant="dark"
  preHeader="Bliv andelshaver"
  headline="Som andelshaver i AKD får du..."
  imageUrl="/images/andelshaver-tractor.jpg"
  imageAlt="Andelshaver i traktor under høst"
  pullUp={false}
  items={[...4 benefit items with checkmarks]}
/>
```

#### C. "Ansvar i Praksis" Section (Line ~320)
**Before**: ~100 lines of hardcoded HTML
**After**: 20 lines using ContentBox + separate CTAs

```astro
<ContentBox
  variant="light"
  preHeader="Ansvar i praksis"
  headline="Vi bruger hele kartoflen..."
  imageUrl="/images/production-kartoffelmel.jpg"
  imageAlt="Produktion af kartoffelmel"
  pullUp={true}
  items={[...3 responsibility items with arrows]}
/>

<!-- CTAs rendered separately below -->
<div class="container-custom">
  <div class="flex items-center justify-center gap-6 mt-12 mb-24">
    <!-- Secondary & Primary CTAs -->
  </div>
</div>
```

### 3. Created Documentation

**File**: `/src/components/sections/README.md`

Comprehensive documentation including:
- Props reference
- Usage examples
- Sanity.io schema example
- Best practices
- CMS integration guidelines
- Accessibility considerations

## Code Reduction

| Section | Before (lines) | After (lines) | Reduction |
|---------|---------------|---------------|-----------|
| AKD I TAL | ~70 | ~23 | 67% |
| Bliv Andelshaver | ~80 | ~23 | 71% |
| Ansvar i Praksis | ~100 | ~20 | 80% |
| **Total** | **~250** | **~66** | **74%** |

## Component Features

### Variants

1. **Light Variant** (white background, charcoal text)
   - Used in: "AKD I TAL", "Ansvar i Praksis"
   - Perfect for: Standard sections, overlapping on warm-light backgrounds

2. **Dark Variant** (charcoal background, white text)
   - Used in: "Bliv Andelshaver"
   - Perfect for: Sections on forest-green backgrounds, high contrast needs

### Icon Types

1. **Arrow** (`icon: 'arrow'`)
   - Mint green right-pointing chevron
   - Animates on hover (if item is clickable)
   - Used for: Stats, features, navigation items

2. **Checkmark** (`icon: 'check'`)
   - Mint green filled checkmark
   - Static (no hover animation)
   - Used for: Benefits, completed items, features list

### Overlapping Behavior

The `pullUp` prop enables sections to overlap:

```astro
<!-- Section 1: Large bottom padding -->
<section class="bg-forest-green pb-[450px]">...</section>

<!-- Section 2: Minimal top padding + pullUp -->
<section class="bg-warm-light pt-1">
  <ContentBox pullUp={true} ... />
</section>
```

**Result**: The ContentBox visually overlaps the previous section by ~200px

## CMS Integration Strategy

### Content Structure

When setting up in CMS (e.g., Sanity.io):

```typescript
// Page content is an array of sections
{
  sections: [
    {
      _type: 'hero',
      // ... hero fields
    },
    {
      _type: 'contentBox',
      variant: 'light',
      preHeader: 'AKD i tal',
      headline: '...',
      image: { ... },
      pullUp: true,
      items: [
        { title: '...', description: '...', icon: 'arrow', href: null }
      ]
    },
    // ... more sections
  ]
}
```

### Rendering in Astro

```astro
---
import ContentBox from '@/components/sections/ContentBox.astro'
// ... fetch content from CMS
---

{sections.map(section => {
  switch(section._type) {
    case 'contentBox':
      return (
        <section class={getSectionClasses(section)}>
          <ContentBox
            variant={section.variant}
            preHeader={section.preHeader}
            headline={section.headline}
            imageUrl={section.image.url}
            imageAlt={section.image.alt}
            pullUp={section.pullUp}
            items={section.items}
          />
        </section>
      )
    // ... other section types
  }
})}
```

## Benefits for CMS Integration

### 1. Consistency
- All similar sections use the same component
- Styling is centralized in one place
- Changes propagate across all instances

### 2. Flexibility
- Two visual variants cover most use cases
- Items can be static or clickable
- Optional overlapping behavior

### 3. Maintainability
- Component-based architecture
- Clear prop interface
- TypeScript-ready with type definitions

### 4. Content Management
- Non-technical users can create/edit these sections
- Preview in CMS shows accurate representation
- Validation rules ensure content quality

### 5. Scalability
- Easy to add new instances
- Can extend with new variants if needed
- Performance: minimal bundle size

## Next Steps for Full CMS Integration

1. **Set up Sanity schema** (see README.md for example)
2. **Create page content type** with sections array
3. **Implement section renderer** in Astro page templates
4. **Add preview functionality** in Sanity Studio
5. **Migrate existing content** to CMS structure
6. **Test and refine** content editor experience

## Technical Notes

### Responsive Design
- Mobile: Stacked layout (image above, content below)
- Desktop: Side-by-side (image left, content right, 50/50 split)
- Image heights: 256px (mobile) → 384px (tablet) → full height (desktop)

### Accessibility
- Proper heading hierarchy (h2 for headline, h3 for item titles)
- Alt text required for images
- Semantic HTML (`<a>` for links, `<div>` for static content)
- Keyboard navigation for clickable items
- ARIA labels where appropriate

### Performance
- No JavaScript required (pure HTML/CSS)
- SVG icons (scalable, small file size)
- Images should be optimized (WebP recommended)
- Lazy loading on images (if implemented)

## Files Modified/Created

### Created
- `/src/components/sections/ContentBox.astro` - Main component
- `/src/components/sections/README.md` - Documentation
- `/CONTENTBOX_IMPLEMENTATION.md` - This file

### Modified
- `/src/pages/index.astro` - Refactored three sections

## Verification

✅ All sections render correctly
✅ Variants match original styling
✅ Overlapping behavior works as expected
✅ Icons display correctly (arrows & checkmarks)
✅ Responsive design intact
✅ No linting errors
✅ Documentation complete

## Example Usage Reference

For quick copy-paste when creating new sections:

```astro
<!-- Light box, no overlap -->
<section class="bg-warm-light pt-24 pb-16 md:pb-24">
  <ContentBox
    variant="light"
    preHeader="Section Label"
    headline="Compelling headline that describes the content"
    imageUrl="/images/your-image.jpg"
    imageAlt="Descriptive alt text"
    pullUp={false}
    items={[
      {
        title: 'Feature One',
        description: 'Brief description of this feature.',
        icon: 'arrow',
        href: '/link-if-clickable'
      }
    ]}
  />
</section>

<!-- Dark box on green, no overlap -->
<section class="bg-forest-green pt-24 pb-16 md:pb-24">
  <ContentBox
    variant="dark"
    preHeader="Section Label"
    headline="Compelling headline"
    imageUrl="/images/your-image.jpg"
    imageAlt="Descriptive alt text"
    pullUp={false}
    items={[
      {
        title: 'Benefit One',
        description: 'Brief description.',
        icon: 'check'
      }
    ]}
  />
</section>

<!-- Light box with overlap (previous section needs extra bottom padding) -->
<section class="bg-warm-light pt-1 pb-16 md:pb-24">
  <ContentBox
    variant="light"
    preHeader="Section Label"
    headline="Compelling headline"
    imageUrl="/images/your-image.jpg"
    imageAlt="Descriptive alt text"
    pullUp={true}
    items={[...]}
  />
</section>
```

---

**Component Status**: ✅ Production Ready
**CMS Ready**: ✅ Yes
**Documentation**: ✅ Complete
**Testing**: ✅ Verified

