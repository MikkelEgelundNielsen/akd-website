## Andelshavere Navigation System

This document explains how to manage the navigation for the protected "For Andelshavere" section.

## Overview

The andelshavere section has its own **separate navigation system** managed in Sanity CMS. This keeps it independent from the main site navigation and provides flexibility for content editors.

### Why Separate?

- ✅ **Protected section** - Only authenticated farmers can access
- ✅ **Different content structure** - Specialized pages for farmers
- ✅ **No main nav pollution** - Won't appear in public navigation
- ✅ **Easy to manage** - Content editors can update without code changes

## Sanity Setup

### Schema: `andelshavereNavigation`

Located at: `/akd-sanity/schemas/andelshavereNavigation.ts`

### Fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Internal reference (not shown on website) |
| `menuItems` | Array | List of navigation links |

### Menu Item Fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | String | ✅ Yes | Text shown in navigation |
| `linkType` | Radio | ✅ Yes | Choose "Intern side" or "Manuel URL" |
| `internalLink` | Reference | Conditional | Select an existing page (if linkType = internal) |
| `manualUrl` | String | Conditional | Manual URL like `/andelshavere/dashboard` (if linkType = manual) |
| `description` | String | ❌ No | Optional hover tooltip |
| `icon` | String | ❌ No | Optional emoji or icon |

## How to Add/Edit Navigation in Sanity

1. **Open Sanity Studio**
   ```bash
   cd akd-sanity
   npm run dev
   ```

2. **Navigate to "Andelshavere Navigation"** in the sidebar

3. **Add Menu Items** with:
   
   **Option A: Link to Existing Page (Recommended)**
   - Label: "Nyheder for andelshavere"
   - Link type: "Intern side"
   - Vælg side: [Select your page from the list]
   - Icon: "📰" (optional)
   - Description: "Se seneste nyheder" (optional)

   **Option B: Manual URL (for pages without content yet)**
   - Label: "Dyrkning og rådgivning"
   - Link type: "Manuel URL"
   - Manuel URL: "/andelshavere/raadgivning"
   - Icon: "🌱" (optional)

### Example Menu Items:

```
✅ Using Internal References (Best):
Label: Nyheder for andelshavere
Link type: Intern side
Vælg side: [Select "Nyheder" from dropdown]
Icon: 📰

Label: Dyrkning og rådgivning
Link type: Intern side
Vælg side: [Select "Rådgivning" from dropdown]
Icon: 🌱

⚠️ Using Manual URLs (Only if page doesn't exist yet):
Label: Levering og kampagne
Link type: Manuel URL
Manuel URL: /andelshavere/levering
Icon: 🚚

Label: Andelsforhold
Link type: Manuel URL
Manuel URL: /andelshavere/andelsforhold
Icon: 🤝
```

## Frontend Implementation

### Component 1: `AndelshavereNav.astro` (Horizontal Menu)

Located at: `/src/components/layout/AndelshavereNav.astro`

**Features:**
- ✅ Fetches navigation from Sanity
- ✅ Sticky header (sticks below main nav)
- ✅ Active state highlighting
- ✅ Responsive design
- ✅ Hover tooltips (if description provided)
- ✅ Icon support

**Used in:** All andelshavere pages via `AndelshavereLayout`

### Component 2: `NavigationCards.astro` (Card Grid)

Located at: `/src/components/andelshavere/NavigationCards.astro`

**Features:**
- ✅ Fetches navigation from Sanity (same source as horizontal menu)
- ✅ Displays as card grid
- ✅ Shows descriptions
- ✅ Responsive grid layout (1/2/3 columns)
- ✅ Icon support
- ✅ Hover effects

**Used in:** Dashboard and overview pages

**Usage:**
```astro
---
import NavigationCards from '@/components/andelshavere/NavigationCards.astro'
---

<section class="py-16">
  <div class="container-custom">
    <h2>Vælg en kategori</h2>
    <NavigationCards />
  </div>
</section>
```

### Why Two Components?

Both components use the **same Sanity data source**, ensuring consistency. They just display it differently:
- **Horizontal Nav** - For page-to-page navigation (always visible)
- **Card Grid** - For dashboard/overview pages (more descriptive)

### Layout: `AndelshavereLayout.astro`

Located at: `/src/layouts/AndelshavereLayout.astro`

This layout wraps `BaseLayout` and automatically includes the andelshavere navigation.

### Usage in Pages:

```astro
---
import AndelshavereLayout from '@/layouts/AndelshavereLayout.astro'
---

<AndelshavereLayout 
  title="Nyheder - For Andelshavere"
  description="Seneste nyheder for andelshavere"
>
  <section class="py-16 md:py-24">
    <!-- Your page content -->
  </section>
</AndelshavereLayout>
```

## Creating New Andelshavere Pages

1. **Create the page** in `/src/pages/andelshavere/`
   ```
   /src/pages/andelshavere/nyheder.astro
   /src/pages/andelshavere/raadgivning.astro
   /src/pages/andelshavere/levering.astro
   /src/pages/andelshavere/andelsforhold.astro
   ```

2. **Use AndelshavereLayout**
   ```astro
   ---
   import AndelshavereLayout from '@/layouts/AndelshavereLayout.astro'
   ---

   <AndelshavereLayout title="Page Title">
     <!-- Content -->
   </AndelshavereLayout>
   ```

3. **Add to Sanity navigation** (if not already there)

4. **Pages are automatically protected** by authentication middleware

## Styling

The navigation uses:
- **Active state**: Burnt orange background with white text
- **Hover state**: Warm light background with burnt orange text
- **Spacing**: Responsive padding and gaps
- **Position**: Sticky below main navigation (z-index: 40)

## TypeScript Types

Located at: `/src/types/sanity.ts`

```typescript
interface AndelshavereMenuItem {
  label: string
  linkType: 'internal' | 'manual'
  href: string  // Computed from internalLink or manualUrl
  description?: string
  icon?: string
}

interface AndelshavereNavigation {
  _id: string
  _type: 'andelshavereNavigation'
  title: string
  menuItems: AndelshavereMenuItem[]
}
```

## Queries

Located at: `/src/lib/sanityQueries.ts`

```typescript
export const andelshavereNavigationQuery = `*[_type == "andelshavereNavigation"][0] {
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
    description,
    icon
  }
}`
```

## Best Practices

### DO:
✅ Prefer "Intern side" over "Manuel URL" when possible  
✅ Create pages in Sanity before linking to them  
✅ Use descriptive labels  
✅ **Add descriptions** - They appear in navigation cards!  
✅ Use emojis for visual interest  
✅ Test on mobile devices  
✅ Keep descriptions concise (1-2 sentences)  

### DON'T:
❌ Link to pages outside `/andelshavere/` path  
❌ Use absolute URLs (use relative paths)  
❌ Create too many menu items (4-6 is ideal)  
❌ Use manual URLs when the page exists in Sanity  
❌ Forget to create the actual page  

## Example Complete Setup

### 1. Create Pages First:
In Sanity, create General Pages with these slugs:
- `andelshavere-nyheder`
- `andelshavere-raadgivning`
- `andelshavere-levering`
- `andelshavere-andelsforhold`

### 2. Add to Navigation:
In "🔒 Andelshavere Navigation", add menu items:
- 📰 Nyheder for andelshavere → [Link to: andelshavere-nyheder]
- 🌱 Dyrkning og rådgivning → [Link to: andelshavere-raadgivning]
- 🚚 Levering og kampagne → [Link to: andelshavere-levering]
- 🤝 Andelsforhold → [Link to: andelshavere-andelsforhold]

### 3. Pages Are Auto-Protected:
```
src/pages/andelshavere/
├── dashboard.astro (already exists)
├── login.astro (already exists)
├── nyheder.astro (create this)
├── raadgivning.astro (create this)
├── levering.astro (create this)
└── andelsforhold.astro (create this)
```

### 4. Page Template Example:
```astro
---
import AndelshavereLayout from '@/layouts/AndelshavereLayout.astro'

const user = Astro.locals.user
---

<AndelshavereLayout 
  title="Nyheder - For Andelshavere"
  description="Seneste nyheder og information"
>
  <section class="py-16 md:py-24 bg-warm-light">
    <div class="container-custom">
      <h1 class="text-4xl md:text-5xl font-serif text-forest-green mb-8">
        Nyheder for andelshavere
      </h1>
      
      <!-- Your content here -->
      
    </div>
  </section>
</AndelshavereLayout>
```

## Troubleshooting

### Navigation not showing?
- Check if you've created the navigation in Sanity Studio
- Verify the document type is `andelshavereNavigation`
- Check browser console for errors

### URLs not working?
- Ensure URLs start with `/andelshavere/`
- Create the corresponding page files
- All pages under `/andelshavere/` are protected (except `/login`)

### Styling issues?
- Check if Tailwind classes are correct
- Verify z-index doesn't conflict with other elements
- Test on different screen sizes

