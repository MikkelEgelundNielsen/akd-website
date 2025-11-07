# UI Components

Reusable UI components for the AKD website.

## Buttons

### PrimaryButton.astro
Primary CTA button with burnt orange background, white text, and arrow icon in circular background.

**Usage:**
```astro
import PrimaryButton from '@/components/ui/PrimaryButton.astro'

<PrimaryButton href="/path">Button Text</PrimaryButton>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | **required** | URL destination |
| `class` | `string` | `''` | Additional CSS classes |
| `ariaLabel` | `string` | - | Accessibility label (optional) |

**When to use:**
- Primary call-to-action on a page
- Most important conversion action
- Main navigation destination
- Maximum one per section (typically)

**Examples:**
```astro
<!-- Basic usage -->
<PrimaryButton href="/job/stillinger">
  Se alle ledige stillinger
</PrimaryButton>

<!-- With custom classes -->
<PrimaryButton href="/kontakt" class="mt-8">
  Kontakt os
</PrimaryButton>

<!-- With aria-label -->
<PrimaryButton href="/login" ariaLabel="Log ind til andelshaver-området">
  Log ind
</PrimaryButton>
```

---

### SecondaryButton.astro
Secondary CTA link with arrow icon. Burnt orange text that changes to amber on hover.

**Usage:**
```astro
import SecondaryButton from '@/components/ui/SecondaryButton.astro'

<SecondaryButton href="/path">Link Text</SecondaryButton>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | **required** | URL destination |
| `class` | `string` | `''` | Additional CSS classes |
| `ariaLabel` | `string` | - | Accessibility label (optional) |

**When to use:**
- Secondary actions on a page
- Supporting links alongside primary CTAs
- "Learn more" or "Read more" type links
- Multiple per section is acceptable

**Examples:**
```astro
<!-- Basic usage -->
<SecondaryButton href="/om/ansvar-politikker">
  Se vores ansvar & politikker
</SecondaryButton>

<!-- Paired with primary CTA -->
<div class="flex flex-col sm:flex-row gap-6">
  <SecondaryButton href="/kontakt">
    Kontakt os
  </SecondaryButton>
  <PrimaryButton href="/">
    Gå til forsiden
  </PrimaryButton>
</div>
```

---

### Button Hierarchy Best Practices

**DO:**
✅ Use PrimaryButton for the main conversion action  
✅ Use SecondaryButton for supporting actions  
✅ Place SecondaryButton before PrimaryButton in layout  
✅ Limit to one primary CTA per section  
✅ Use consistent gap spacing: `gap-6`  

**DON'T:**
❌ Use multiple primary buttons in the same section  
❌ Use primary button for less important actions  
❌ Reverse the order (primary should come after secondary)  
❌ Mix button components with manual markup (use components consistently)  

---

## Logos

### LogoColored.astro
Full-color version of the AKD logo with green and gold colors.

**Usage:**
```astro
import LogoColored from '@/components/ui/LogoColored.astro'

<LogoColored class="h-12 w-auto" />
```

**Colors:**
- Primary: `#006835` (green)
- Secondary: `#a78034` (gold)

**When to use:**
- Light backgrounds (warm-light, light, white)
- Light theme navigation
- Footer
- Print materials

---

### LogoWhite.astro
White version of the AKD logo for dark backgrounds.

**Usage:**
```astro
import LogoWhite from '@/components/ui/LogoWhite.astro'

<LogoWhite class="h-12 w-auto" />
```

**Color:**
- All elements: `#ffffff` (white)

**When to use:**
- Dark backgrounds (forest-green, charcoal)
- Dark theme navigation
- Hero sections with dark backgrounds
- Dark overlays

---

## Props

Both logo components accept:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `string` | `'h-12 w-auto'` | CSS classes for sizing and styling |

---

## Examples

### Different Sizes

```astro
<!-- Small -->
<LogoColored class="h-8 w-auto" />

<!-- Default -->
<LogoColored class="h-12 w-auto" />

<!-- Large -->
<LogoColored class="h-20 w-auto" />

<!-- With responsive sizing -->
<LogoColored class="h-8 md:h-12 lg:h-16 w-auto" />
```

### Theme Switching

```astro
{theme === 'dark' ? (
  <LogoWhite class="h-12 w-auto" />
) : (
  <LogoColored class="h-12 w-auto" />
)}
```

### With Transitions

```astro
<LogoColored class="h-12 w-auto transition-all duration-300" />
```

---

## Technical Details

### ViewBox
Both logos use `viewBox="0 0 385 69"` which gives them:
- Width: 385 units
- Height: 69 units
- Aspect ratio: ~5.58:1 (wide horizontal logo)

### Accessibility
- Both include `aria-label="AKD Danmark logo"`
- Proper semantic SVG structure
- Works with screen readers

### Performance
- Inline SVG (no external requests)
- Small file size
- Crisp at any scale (vector)
- No pixelation on high-DPI displays

---

## Best Practices

### DO:
✅ Use `w-auto` to maintain aspect ratio
✅ Set height explicitly for consistent sizing
✅ Use colored logo on light backgrounds
✅ Use white logo on dark backgrounds
✅ Add transitions for smooth animations

### DON'T:
❌ Set both width and height (distorts aspect ratio)
❌ Use colored logo on dark backgrounds (poor contrast)
❌ Use white logo on light backgrounds (invisible)
❌ Scale smaller than 24px height (readability issues)

---

## Figma/Design Files

Logo source files can be found in:
- `[Design System Location]`
- Contact: [Design Team Contact]

For logo variations or modifications, please consult the brand guidelines.

