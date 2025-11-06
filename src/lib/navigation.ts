export interface SubNavItem {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  children?: SubNavItem[]
}

export const navigationItems: NavItem[] = [
  {
    label: 'Job & karriere',
    href: '/job',
    children: [
      { label: 'Ledige stillinger', href: '/job/stillinger' },
      { label: 'At arbejde hos AKD', href: '/job/at-arbejde-hos-akd' },
      { label: 'Mød vores medarbejdere', href: '/job/moed-vores-medarbejdere' },
      { label: 'Praktik, elev- og lærlingepladser', href: '/job/praktik-elev-laerling' },
    ]
  },
  {
    label: 'Bliv andelshaver',
    href: '/bliv-andelshaver',
    children: [
      { label: 'Fordele', href: '/bliv-andelshaver/fordele' },
      { label: 'Sådan bliver du andelshaver', href: '/bliv-andelshaver/hvordan' },
      { label: 'Priser og betingelser', href: '/bliv-andelshaver/priser' },
    ]
  },
  {
    label: 'Om AKD',
    href: '/om',
    children: [
      { label: 'Vores historie', href: '/om/historie' },
      { label: 'Produktion', href: '/om/produktion' },
      { label: 'Bæredygtighed', href: '/om/baeredygtighed' },
    ]
  },
  {
    label: 'Kontakt',
    href: '/kontakt',
  },
]

/**
 * Find the current navigation item based on the current path
 */
export function getCurrentNavItem(path: string): NavItem | undefined {
  return navigationItems.find(item => path.startsWith(item.href))
}

