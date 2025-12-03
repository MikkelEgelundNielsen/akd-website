# AKD Website - AI Agent Quick Reference

## Quick Context

**Project:** akddanmark.dk - Danish potato starch cooperative  
**Tech:** Astro 4 + Vue 3 + Tailwind CSS + Sanity CMS  
**Language:** All content in Danish (da-DK)

## Most Important Rules

### 1. Color System (CRITICAL)
- **Burnt Orange (#E87722)** = PRIMARY CTA color
- **Amber (#F5A623)** = Secondary CTAs
- **Mint (#10E397)** = Accents only (NOT for CTAs)
- Use Tailwind classes: `bg-burnt-orange`, `bg-amber`, `text-mint`
- NEVER use arbitrary values: `bg-[#E87722]` ❌

### 2. Component Strategy
- Use Astro (.astro) for static content
- Use Vue (.vue) ONLY for interactive features (forms, modals, etc.)
- Follow mobile-first responsive design

### 3. Accessibility
- All images need alt text
- All buttons need aria-labels
- Color contrast minimum 4.5:1
- Keyboard navigation must work

### 4. Code Standards
- TypeScript strict mode
- No `any` types
- Import aliases: `@/components/...`
- Semantic HTML always

## Common Patterns

### Button Hierarchy
```html
<button class="btn-primary">Primær handling</button>
<button class="btn-secondary">Sekundær handling</button>
<a href="#" class="link-mint">Link →</a>
```

### Responsive Sections
```html
<section class="py-16 md:py-24 bg-warm-light">
  <div class="container-custom">
    <h2 class="text-3xl md:text-5xl font-serif text-forest-green mb-8">
      Overskrift
    </h2>
    <p class="text-lg text-charcoal leading-relaxed">
      Indhold...
    </p>
  </div>
</section>
```

## Before Committing
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Tested at 375px, 768px, 1024px
- [ ] Colors use correct Tailwind classes
- [ ] All images have alt text
- [ ] Keyboard navigation works

## Detailed Rules Location
Check `.cursor/rules/` for comprehensive guidelines:
- `colors.mdc` - Color system enforcement
- `components.mdc` - Component structure
- `typography.mdc` - Text styling
- `accessibility.mdc` - A11y requirements


