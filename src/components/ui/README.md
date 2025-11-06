# UI Components

Reusable UI components for the AKD website.

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

