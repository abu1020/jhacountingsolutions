export interface SoftwareItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  badge: string;
  category: string;
  pricePlaceholder: string;
  iconName: string;
}

export const SOFTWARE_CATALOG: SoftwareItem[] = [
  {
    id: 'osflex',
    name: 'OSFlex',
    tagline: 'Next-Gen Financial & Operational ERP Suite',
    description: 'Cloud-native operational ERP for Indian enterprises with automated GST reconciliation, multi-entity ledger management, and real-time inventory tracking.',
    url: 'https://osflex.vercel.app',
    badge: 'Free for Lifetime',
    category: 'Enterprise ERP',
    pricePlaceholder: 'Free / Included with Account',
    iconName: 'Cpu'
  },
  {
    id: 'quickrooms',
    name: 'QuickRooms',
    tagline: 'Encrypted Real-Time Corporate Communication',
    description: 'Modern real-time private chat rooms for secure team collaboration, document sharing, and client channel rooms with audit logs.',
    url: 'https://quickrooms.vercel.app',
    badge: 'Premium Add-On',
    category: 'Team Communication',
    pricePlaceholder: '₹999 / Month Per Organization',
    iconName: 'MessageSquare'
  }
];
