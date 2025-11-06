# ContentBox Component

A reusable, modular content box component for displaying image-content layouts. Perfect for CMS integration.

## Overview

The ContentBox component creates a two-column layout with an image on the left and content on the right. It supports two visual variants (light/dark), multiple content items with icons (arrows or checkmarks), and optional negative margin for overlapping effects.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'light' \| 'dark'` | `'light'` | Visual style variant. **light**: white background with charcoal text; **dark**: charcoal background with white text |
| `preHeader` | `string` | *required* | Uppercase pre-header text (displayed in mint green) |
| `headline` | `string` | *required* | Main headline (displayed in Lora serif italic) |
| `imageUrl` | `string` | *required* | URL/path to the image |
| `imageAlt` | `string` | *required* | Alt text for the image (important for accessibility) |
| `items` | `Item[]` | *required* | Array of content items (see Item structure below) |
| `pullUp` | `boolean` | `false` | Whether to use negative margin to pull the box up into the previous section |

### Item Structure

Each item in the `items` array should have:

```typescript
{
  title: string        // Item headline (Open Sans bold 22px)
  description: string  // Item description (Open Sans regular 18px)
  icon: 'arrow' | 'check'  // Icon type to display
  href?: string        // Optional URL - if provided, the item becomes clickable with hover effect
}
```

## Variants

### Light Variant (default)
- **Background**: White (`bg-white`)
- **Text**: Charcoal (`text-charcoal`)
- **Use cases**: Standard content sections, overlapping sections on warm-light backgrounds

### Dark Variant
- **Background**: Charcoal (`bg-charcoal`)
- **Text**: White/Light (`text-white`, `text-white/90`)
- **Use cases**: Content sections on forest-green backgrounds

## Usage Examples

### Basic Light Box (e.g., "AKD I TAL")

```astro
<ContentBox
  variant="light"
  preHeader="AKD i tal"
  headline="Et stærkt fællesskab med kapacitet til mere"
  imageUrl="https://placehold.co/1200x800/2B5329/FFFFFF?text=AKD+Fabrik"
  imageAlt="AKD's fabriksanlæg i Brande"
  pullUp={false}
  items={[
    {
      title: '2 moderne fabrikker',
      description: 'Effektive anlæg med fokus på sikkerhed, kvalitet og stabile leverancer.',
      icon: 'arrow'
    },
    {
      title: '600+ andelshavere',
      description: 'Et stærkt andelsselskab, hvor samarbejde og indflydelse går hånd i hånd.',
      icon: 'arrow'
    }
  ]}
/>
```

### Dark Box on Forest Green (e.g., "Bliv Andelshaver")

```astro
<section class="bg-forest-green pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24">
  <ContentBox
    variant="dark"
    preHeader="Bliv andelshaver"
    headline="Som andelshaver i AKD får du en stabil aftager, faglig sparring og klare vilkår."
    imageUrl="https://placehold.co/1200x800/8FD5A6/26251E?text=Andelshaver"
    imageAlt="Andelshaver i traktor under høst"
    pullUp={false}
    items={[
      {
        title: 'Stabil aftagning',
        description: 'Tydelige aftaler og kampagnevilkår, år efter år.',
        icon: 'check'
      },
      {
        title: 'Faglig rådgivning',
        description: 'Agro-teamet hjælper med dyrkning, optagning og lagring.',
        icon: 'check'
      }
    ]}
  />
</section>
```

### Overlapping Box with Clickable Items

```astro
<section class="bg-warm-light pt-1 pb-16 md:pb-24">
  <ContentBox
    variant="light"
    preHeader="Vores services"
    headline="Vi tilbyder omfattende support til vores partnere"
    imageUrl="https://placehold.co/1200x800/2B5329/FFFFFF?text=Support"
    imageAlt="Support team in action"
    pullUp={true}
    items={[
      {
        title: 'Teknisk support',
        description: 'Hurtig hjælp når du har brug for det.',
        icon: 'arrow',
        href: '/support/teknisk'  // Makes this item clickable
      },
      {
        title: 'Uddannelse',
        description: 'Løbende kurser og certificering.',
        icon: 'arrow',
        href: '/support/uddannelse'
      }
    ]}
  />
</section>
```

## Overlapping Behavior

When `pullUp={true}`:
- The box uses negative top margin (`-mt-48 sm:-mt-52 md:-mt-56 lg:-mt-[200px]`)
- This pulls the box up to overlap the previous section
- **Important**: The parent section should have minimal top padding (e.g., `pt-1`) and the previous section should have enough bottom padding to accommodate the overlap

### Example Setup for Overlapping

```astro
<!-- Previous section with extra bottom padding -->
<section class="bg-forest-green pb-[450px]">
  <div class="container-custom">
    <h1>Hero Content</h1>
  </div>
</section>

<!-- Section with overlapping ContentBox -->
<section class="bg-warm-light pt-1 pb-16 md:pb-24">
  <ContentBox pullUp={true} ... />
</section>
```

## Styling Details

### Typography
- **Pre-header**: Open Sans Bold 16px, Mint, Uppercase, Tracking-wide
- **Headline**: Lora Semibold Italic, 36px (mobile) to 48px (desktop), Charcoal/White
- **Item Title**: Open Sans Bold 22px, Charcoal/White
- **Item Description**: Open Sans Regular 18px, Charcoal/White (90% opacity for dark variant)

### Icons
- **Arrows**: Mint green, 20-24px, Right-pointing chevron, Translates right on hover (if item has href)
- **Checkmarks**: Mint green, 24px, Filled checkmark in circle

### Responsive Behavior
- **Mobile**: Single column, image above content, image height 256px
- **Tablet (md)**: Single column, image height 384px
- **Desktop (lg+)**: Two columns, image takes 50% width, full height

## CMS Integration Guidelines

### Content Structure for CMS

When setting up this component in your CMS, create a schema with:

1. **Component Type**: "ContentBox"
2. **Fields**:
   - Variant: Select field ['light', 'dark']
   - Pre-header: Short text (max 50 chars)
   - Headline: Text (max 150 chars)
   - Image: Image upload/media library
   - Image Alt Text: Text (required for accessibility)
   - Pull Up: Boolean/Toggle
   - Items: Repeater/Array field with:
     - Title: Short text (max 80 chars)
     - Description: Text (max 200 chars)
     - Icon Type: Select ['arrow', 'check']
     - Link (optional): URL field

### Sanity.io Example Schema

```typescript
{
  name: 'contentBox',
  title: 'Content Box',
  type: 'object',
  fields: [
    {
      name: 'variant',
      title: 'Visual Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Light (White background)', value: 'light' },
          { title: 'Dark (Charcoal background)', value: 'dark' }
        ],
        layout: 'radio'
      },
      initialValue: 'light'
    },
    {
      name: 'preHeader',
      title: 'Pre-header',
      type: 'string',
      validation: Rule => Rule.required().max(50)
    },
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: Rule => Rule.required().max(150)
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    },
    {
      name: 'pullUp',
      title: 'Pull Up (Overlap Previous Section)',
      type: 'boolean',
      initialValue: false,
      description: 'Use negative margin to overlap the previous section'
    },
    {
      name: 'items',
      title: 'Content Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required().max(80)
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: Rule => Rule.required().max(200)
            },
            {
              name: 'icon',
              title: 'Icon Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Arrow (→)', value: 'arrow' },
                  { title: 'Checkmark (✓)', value: 'check' }
                ],
                layout: 'radio'
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'href',
              title: 'Link URL (Optional)',
              type: 'url',
              description: 'If provided, the item becomes clickable'
            }
          ]
        }
      ],
      validation: Rule => Rule.required().min(1).max(6)
    }
  ]
}
```

## Best Practices

1. **Image Requirements**:
   - Minimum width: 800px
   - Aspect ratio: 4:3 or 16:9 recommended (1200x800 works well)
   - Format: WebP or JPEG
   - Optimize for web (< 200KB)
   - **During development**: Use [placehold.co](https://placehold.co/) placeholders:
     ```
     https://placehold.co/1200x800/2B5329/FFFFFF?text=Your+Text
     ```
     (Forest green background with white text)

2. **Content Guidelines**:
   - Pre-header: Keep short and descriptive (1-3 words)
   - Headline: Clear value proposition or key message (under 100 chars ideal)
   - Items: 2-4 items work best visually, max 6
   - Item descriptions: Concise (1-2 sentences)

3. **Accessibility**:
   - Always provide meaningful alt text for images
   - If items are links, ensure titles are descriptive
   - Test keyboard navigation if items have hrefs

4. **Variant Selection**:
   - Use **light** variant on warm-light or forest-green backgrounds
   - Use **dark** variant on forest-green backgrounds when you want contrast
   - Consider color contrast ratios for accessibility

5. **Pull-Up Usage**:
   - Only use `pullUp={true}` when the previous section has adequate bottom padding
   - Ensure the previous section background color creates nice contrast
   - Test on mobile to ensure the overlap doesn't cause layout issues

## File Location

`/src/components/sections/ContentBox.astro`

