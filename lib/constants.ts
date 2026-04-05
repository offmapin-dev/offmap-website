// ── Site Config ───────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: 'OffMap India',
  tagline: 'Travel slow, go Offmap!',
  description:
    'OffMap is for people who want to travel slower. To hike without rushing, sit with a view longer, and experience places deeply.',
  email: 'info@offmap.in',
  phone: '+91 92114 71385',
  whatsapp: '9211471385',
  whatsappUrl: 'https://wa.me/919211471385',
  socials: {
    instagram: '',
    youtube: '',
    linkedin: '',
  },
} as const

// ── Navigation ────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Stays', href: '/stays' },
  { label: 'Student Program', href: '/student-program' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'About', href: '/about' },
] as const

// ── Locations ─────────────────────────────────────────────────────
export const LOCATIONS = [
  {
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    intro: 'Quiet villages, forest trails, slow mornings.',
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    intro: 'Beyond forts—desert, villages, adventure.',
  },
  {
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    intro: 'Quieter, raw, spacious.',
  },
  {
    name: 'Kashmir',
    slug: 'kashmir',
    intro: '',
  },
] as const

// ── Region Themes ─────────────────────────────────────────────────
export const REGION_THEMES = {
  'himachal-pradesh': {
    name: 'Himachal Pradesh',
    primary: '#2D6A4F',
    accent: '#FFD60A',
    bg: '#F0F7F4',
    cardBg: '#E8F5EE',
    label: 'Forest & Valley',
    emoji: '🌲',
    description: 'Quiet villages, forest trails, slow mornings.',
  },
  rajasthan: {
    name: 'Rajasthan',
    primary: '#C1440E',
    accent: '#F4A261',
    bg: '#FDF6F0',
    cardBg: '#FBE9DC',
    label: 'Desert & Culture',
    emoji: '🐪',
    description: 'Beyond forts — desert, villages, adventure.',
  },
  kashmir: {
    name: 'Kashmir',
    primary: '#C1121F',
    accent: '#FFFFFF',
    bg: '#FFF5F5',
    cardBg: '#FFE8EA',
    label: 'Mountain Paradise',
    emoji: '🏔️',
    description: 'Snow-capped peaks, shikara lakes, saffron fields.',
  },
  uttarakhand: {
    name: 'Uttarakhand',
    primary: '#6B4226',
    accent: '#52796F',
    bg: '#F5F0EB',
    cardBg: '#EBE0D5',
    label: 'Hills & Trails',
    emoji: '🌿',
    description: 'Quieter, raw, spacious.',
  },
} as const

export type RegionThemeKey = keyof typeof REGION_THEMES

// ── Trip Types ────────────────────────────────────────────────────
export const TRIP_TYPES = [
  { label: 'Group Trips', value: 'group-trip' },
  { label: 'Day Trips', value: 'day-trip' },
  { label: 'School Trips', value: 'school-trip' },
  { label: 'Retreats', value: 'retreat' },
  { label: 'Stays', value: 'stay' },
  { label: 'Learning Experiences', value: 'learning-experience' },
] as const

// ── Experiences (homepage quick-nav) ──────────────────────────────
export const EXPERIENCES = [
  { label: 'Group Trips', href: '/experiences/group-trips' },
  { label: 'Day Trips', href: '/experiences/day-trips' },
  { label: 'Activities & Experiences', href: '/experiences/activities' },
  { label: 'Tailored Trips', href: '/experiences/tailored' },
] as const

// ── Featured Routes (homepage) ────────────────────────────────────
export const FEATURED_ROUTES = [
  { name: 'Bir–Barot', slug: 'bir-barot', location: 'himachal-pradesh' },
  { name: 'Rajgundha Valley', slug: 'rajgundha-valley', location: 'himachal-pradesh' },
  { name: 'Shangarh–Raghupur Fort', slug: 'shangarh-raghupur-fort', location: 'himachal-pradesh' },
  { name: 'Jawai', slug: 'jawai', location: 'rajasthan' },
  { name: 'Kasar Devi–Khaliya Top', slug: 'kasar-devi-khaliya-top', location: 'uttarakhand' },
] as const

// ── Footer Links (4 columns) ──────────────────────────────────────
export const FOOTER_LINKS: FooterColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Destinations', href: '/destinations' },
      { label: 'Experiences', href: '/experiences' },
      { label: 'Stays', href: '/stays' },
      { label: 'Student Program', href: '/student-program' },
    ],
  },
  {
    heading: 'Plan',
    links: [
      { label: 'Plan Your Trip', href: '/contact' },
      { label: 'Group Trips', href: '/experiences/group-trips' },
      { label: 'Custom Trips', href: '/experiences/tailored' },
    ],
  },
  {
    heading: 'Work With Us',
    links: [
      { label: 'Partner With Us', href: '/work-with-us' },
      { label: 'Host a Stay', href: '/work-with-us' },
      { label: 'Lead an Experience', href: '/work-with-us' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'FAQs', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Booking & Cancellation', href: '/faq' },
    ],
  },
]

// ── FAQ Data ──────────────────────────────────────────────────────
export const FAQ_DATA: FaqItem[] = [
  {
    question: 'What kind of trips do you do?',
    answer:
      'We design slow, experience-first trips. Less rushing, more exploring. Think hikes, village stays, local interactions, and time to actually feel a place.',
  },
  {
    question: 'Do you follow a fixed itinerary?',
    answer:
      "No. We plan the flow, but not every minute. There's structure, but also space to explore freely.",
  },
  {
    question: 'How long are your trips?',
    answer:
      'Most of our trips are 3–4 days, perfect for a short break without feeling rushed.',
  },
  {
    question: 'How do we travel during the trip?',
    answer:
      "We usually travel in comfortable traveller vehicles for the group. In places with snow or tougher terrain, we switch to 4x4 vehicles for safety and accessibility.",
  },
  {
    question: 'Is travel included?',
    answer:
      'Internal travel during the trip is included. Travel to the starting point (like Delhi/Chandigarh etc.) is usually not included unless mentioned.',
  },
  {
    question: 'What kind of stays can I expect?',
    answer:
      "We don't do standard hotels. You'll stay in home-stays, local homes, or small properties that feel connected to the place.",
  },
  {
    question: 'What is the room sharing like?',
    answer:
      'Mostly double sharing. In some cases, triple sharing may happen depending on the stay & group.',
  },
  {
    question: 'What is the age group?',
    answer: 'Most travelers are between 18–35.',
  },
  {
    question: "What's the gender ratio?",
    answer:
      "It's usually quite balanced, close to 50–50, but can vary from trip to trip.",
  },
  {
    question: 'Can I join solo?',
    answer:
      "Yes, and most people do. You won't feel out of place. Groups tend to connect pretty quickly.",
  },
  {
    question: 'Can you accommodate dietary restrictions?',
    answer:
      "Yes, in most cases. If you have allergies or specific dietary restrictions, just let us know in advance and we'll try our best to take care of it.",
  },
  {
    question: 'What kind of food can I expect?',
    answer:
      'Mostly home-style meals, with a mix of familiar and local dishes. In Himachal, that could mean simple pahadi meals. In Rajasthan, traditional dishes cooked by locals. It\'s less about variety, more about authenticity.',
  },
  {
    question: 'What if I have a health condition?',
    answer:
      "If you have any serious health concerns, we request you to let us know in advance. Our trips involve travel, basic stays and some physical activity, so it's important that you're comfortable managing on your own. Please carry your required medication, inform us beforehand, and take a call based on your comfort level. Since you'll be traveling in a group, we also ask everyone to be mindful of the shared experience. If needed, it's always better to postpone and join us when you feel ready.",
  },
  {
    question: 'Can I customize my trip?',
    answer:
      "Yes. If you're traveling with your own group, we can design a custom OffMap trip for you. Custom trips may have additional costs depending on requirements.",
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'If you cancel your trip at least 7 days before the departure, your booking amount will be refunded. For cancellations made closer to the trip, refunds may not be possible as bookings and arrangements are already in place.',
  },
  {
    question: 'Is this suitable for beginners?',
    answer:
      "Yes. Most of our experiences and hikes are beginner-friendly. We keep things accessible, not extreme.",
  },
  {
    question: 'What makes OffMap different?',
    answer:
      "We don't pick places from the internet. We go there first. Explore, stay, connect, and understand. Only then do we design trips.",
  },
  {
    question: 'Will there be network/connectivity?',
    answer:
      "Depends on the location. Some places have good network, some don't. And honestly, that's part of the experience.",
  },
  {
    question: 'How do I book a trip?',
    answer:
      "You can book directly through the website or reach out to us. We're happy to help you figure things out before you decide.",
  },
  {
    question: 'What if I have more questions?',
    answer:
      "Just reach out. No bots, no long waits. We'll help you personally.",
  },
]

// ── Types ─────────────────────────────────────────────────────────
export interface FooterColumn {
  heading: string
  links: { label: string; href: string }[]
}

export interface FaqItem {
  question: string
  answer: string
}

export type Location = (typeof LOCATIONS)[number]
export type TripType = (typeof TRIP_TYPES)[number]
export type NavLink = (typeof NAV_LINKS)[number]
