# AKD Danmark Website

Modern website for AKD Danmark - a Danish potato starch cooperative.

## Tech Stack

- **Framework:** Astro 4.x
- **Interactive Components:** Vue 3 (Composition API)
- **Styling:** Tailwind CSS
- **Language:** TypeScript (strict mode)
- **CMS:** Sanity.io
- **Analytics:** PostHog

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your Sanity project ID to .env
```

### Development

```bash
# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
akd-website/
├── src/
│   ├── components/     # UI components
│   │   ├── ui/        # Reusable UI components
│   │   ├── layout/    # Navigation, Footer
│   │   └── sections/  # Page-specific sections
│   ├── layouts/       # Page layouts
│   ├── pages/         # Routes (file-based routing)
│   ├── lib/           # Utilities and integrations
│   └── styles/        # Global styles
├── public/            # Static assets
├── .cursor/rules/     # Cursor AI rules
└── .cursorrules       # Main project rules
```

## Design System

### Colors

- **Forest Green** (#004928) - Navigation, headers
- **Burnt Orange** (#E87722) - PRIMARY CTAs ⭐
- **Amber** (#F5A623) - Secondary CTAs
- **Mint** (#10E397) - Accents only
- **Charcoal** (#26251E) - Body text
- **Warm Light** (#F2F1EC) - Page backgrounds
- **Light** (#F7F7F4) - Card backgrounds

### Typography

- **Headings:** Lora (serif)
- **Body:** Open Sans (sans-serif)

## Code Standards

See `.cursorrules` and `.cursor/rules/*.mdc` for detailed coding standards.

### Key Rules

- TypeScript strict mode (no `any`)
- Mobile-first responsive design
- WCAG 2.1 AA accessibility
- Semantic HTML always
- Use Tailwind classes (no inline styles)

## Accessibility

All pages must meet WCAG 2.1 AA standards:

- All images have alt text
- Color contrast ratios meet minimums
- Keyboard navigation works
- Focus indicators visible
- Semantic HTML structure

## Testing Checklist

Before committing:

- [ ] TypeScript compiles (`npm run build`)
- [ ] No console errors
- [ ] Tested at 375px, 768px, 1024px
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Colors use correct Tailwind classes

## Language

All content is in Danish (da-DK):

- Date format: DD. MMM YYYY
- Number format: 1.234,56
- Tone: Jordnær, præcis, imødekommende


