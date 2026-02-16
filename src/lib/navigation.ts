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
      { label: 'Priser og betingelser', href: '/bliv-andelshaver/priser' },
    ]
  },
  {
    label: 'Om AKD',
    href: '/om-akd',
    children: [
      { label: 'Bestyrelse', href: '/om-akd/bestyrelse' },
      { label: 'Ledelse og administration', href: '/om-akd/ledelse' },
      { label: 'Regnskaber & vedtægter', href: '/om-akd/regnskaber-vedtaegter' },
      { label: 'Rest- og biprodukter', href: '/om-akd/rest-og-biprodukter' },
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

