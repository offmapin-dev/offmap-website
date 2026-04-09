import type { RegionThemeKey } from '@/lib/constants'

// ── Stay detail interface ────────────────────────────────────────
export interface StayDetail {
  slug: string
  name: string
  region: string
  regionSlug: RegionThemeKey
  type: string
  description: string
  image: string
  gallery: string[]
  highlights: string[]
  activities: string[]
  amenities: string[]
  houseRules: string[]
  pricePerNight: number
  maxGuests: number
}

// ── Hardcoded stay data (will migrate to Payload CMS) ────────────
export const STAY_DETAILS: StayDetail[] = [
  {
    slug: 'offmap-cottage-bir',
    name: 'OffMap Cottage, Bir',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Cottage',
    description:
      'A quiet cottage above the paragliding village of Bir. Wake up to mountain views, eat farm-fresh meals, and do absolutely nothing at speed. The cottage sits on a hillside orchard with apple and plum trees, overlooking the Dhauladhar range. Mornings start with birdsong and chai on the balcony. Evenings end around a bonfire under more stars than you thought existed. This is not a hotel — it is a home that happens to have a spare room.',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
    ],
    highlights: [
      'Mountain views',
      'Farm-fresh meals',
      '5 min from Bir village',
      'Paragliding nearby',
    ],
    activities: [
      'Paragliding',
      'Hiking',
      'Village walks',
      'Monastery visits',
    ],
    amenities: ['Wi-Fi', 'Kitchen', 'Hot water', 'Mountain view', 'Parking'],
    houseRules: [
      'No smoking inside',
      'Quiet hours after 10pm',
      'Respect local customs',
    ],
    pricePerNight: 2500,
    maxGuests: 4,
  },
  {
    slug: 'desert-homestay-jawai',
    name: 'Desert Homestay, Jawai',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Homestay',
    description:
      'Stay with a local family in leopard country. Nights around the fire, days exploring ancient temples and granite hills. The homestay is run by a Rabari family who have lived in this landscape for generations. You will eat meals cooked on a wood fire, sleep under hand-stitched quilts, and wake up to the sound of goat bells. Jawai is raw, quiet, and completely unlike the Rajasthan you see on postcards.',
    image:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
    ],
    highlights: [
      'Leopard safari nearby',
      'Home-cooked meals',
      'Local family hosts',
      'Ancient temple walks',
    ],
    activities: [
      'Leopard safari',
      'Temple walks',
      'Village tour',
      'Stargazing',
    ],
    amenities: [
      'Home-cooked meals',
      'Hot water',
      'Courtyard seating',
      'Bonfire area',
      'Local guide',
    ],
    houseRules: [
      'No smoking inside',
      'Respect wildlife boundaries',
      'Follow host family customs',
    ],
    pricePerNight: 3200,
    maxGuests: 6,
  },
  {
    slug: 'forest-camp-uttarakhand',
    name: 'Forest Camp, Uttarakhand',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    type: 'Camp',
    description:
      'Tents under oak trees in the Kumaon hills. Complete silence except for birds. The kind of sleep you forget is possible. The camp sits in a clearing surrounded by dense oak and rhododendron forest. There are no roads nearby, no Wi-Fi, and no reason to check your phone. Meals are cooked over an open fire by a local team who know these forests like the back of their hand.',
    image:
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    ],
    highlights: [
      'Dense oak forest',
      'Himalayan bird watching',
      'Stargazing nights',
      'Trail access',
    ],
    activities: [
      'Forest treks',
      'Bird watching',
      'Night walks',
      'Campfire stories',
    ],
    amenities: [
      'Sleeping bags',
      'Camp meals',
      'Hot water (bucket)',
      'Campfire area',
      'Trail maps',
    ],
    houseRules: [
      'No littering — carry out what you carry in',
      'No loud music after 9pm',
      'Stay on marked trails',
    ],
    pricePerNight: 1800,
    maxGuests: 8,
  },
  {
    slug: 'valley-view-shangarh',
    name: 'Valley View Stay, Shangarh',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Guesthouse',
    description:
      'A small guesthouse above the Shangarh meadow. One of the most peaceful places we have ever stayed. The house belongs to a local family who converted their upper floor into two guest rooms. From the window you can see the sacred meadow, the cedar forest, and on clear days, the snow peaks beyond. There is no restaurant, no room service — just home-cooked food and honest conversation.',
    image:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
    ],
    highlights: [
      'Meadow views',
      'Sacred forest nearby',
      'Local cuisine',
      'Complete quiet',
    ],
    activities: [
      'Meadow walks',
      'Raghupur Fort hike',
      'Sacred forest visit',
      'Photography',
    ],
    amenities: [
      'Home-cooked meals',
      'Hot water',
      'Valley view room',
      'Garden seating',
      'Parking',
    ],
    houseRules: [
      'No smoking inside',
      'Quiet hours after 10pm',
      'Respect the sacred meadow',
    ],
    pricePerNight: 2200,
    maxGuests: 4,
  },
]

// ── Lookup helper ────────────────────────────────────────────────
export function getStayBySlug(slug: string): StayDetail | undefined {
  return STAY_DETAILS.find((s) => s.slug === slug)
}
