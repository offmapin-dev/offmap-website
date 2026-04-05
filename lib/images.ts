// ── Centralized image URLs ───────────────────────────────────────
// All external image URLs live here so they can be swapped easily
// and reused across pages without duplication.

// ── Base Unsplash photos (append ?w=___&q=__ for sizing) ─────────
const UNSPLASH = {
  himachalValley: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23',
  mountainPeaks: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  mountainRidges: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  mountainGreenValley: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b',
  tajMahal: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
  rajasthanPalace: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
  desertDunes: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3',
  leopardSafari: 'https://images.unsplash.com/photo-1549366021-9f761d450615',
  kashmirLandscape: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  kashmirLake: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b',
  uttarakhandForest: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  denseForestTrail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  villageScene: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d',
  localHomestay: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220',
  mountainStay: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2',
  indiaLandmark: 'https://images.unsplash.com/photo-1548013146-72479768bada',
  valleyLandscape: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
} as const

const MYNTRA = {
  rajasthanCover:
    'https://assets.myntassets.com/assets/images/2026/MARCH/24/JCyziwzs_6ee01729919d469899c817cec3ea5cd8.jpg',
  jawaiWildlife:
    'https://assets.myntassets.com/assets/images/2026/MARCH/24/cPwCjdUZ_9141407da6e44b8993e93958dda3b3cd.jpg',
  kashmirCover:
    'https://assets.myntassets.com/assets/images/2026/MARCH/24/D2v6kHyH_d1c879ce666440a292c02cf334ea2085.jpg',
} as const

function sized(base: string, w: number, q = 80) {
  if (base.includes('myntassets')) return base
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}w=${w}&q=${q}`
}

// ── Region hero banners (full-width, high-res) ──────────────────
export const HERO_IMAGES: Record<string, string> = {
  'himachal-pradesh': sized(UNSPLASH.himachalValley, 1920),
  rajasthan: sized(UNSPLASH.tajMahal, 1920),
  uttarakhand: sized(UNSPLASH.uttarakhandForest, 1920),
  kashmir: sized(UNSPLASH.kashmirLandscape, 1920),
}

// ── Region destination card images ──────────────────────────────
export const DESTINATION_CARD_IMAGES: Record<string, string> = {
  'himachal-pradesh': sized(UNSPLASH.himachalValley, 800),
  rajasthan: MYNTRA.rajasthanCover,
  uttarakhand: `${UNSPLASH.uttarakhandForest}?auto=format&fit=crop&w=1200&q=80`,
  kashmir: MYNTRA.kashmirCover,
}

// ── Region polaroid pairs ───────────────────────────────────────
export const POLAROID_IMAGES: Record<string, [string, string]> = {
  'himachal-pradesh': [
    sized(UNSPLASH.mountainRidges, 400),
    sized(UNSPLASH.mountainPeaks, 400),
  ],
  rajasthan: [
    sized(UNSPLASH.rajasthanPalace, 400),
    sized(UNSPLASH.desertDunes, 400),
  ],
  kashmir: [
    sized(UNSPLASH.kashmirLandscape, 400),
    sized(UNSPLASH.kashmirLake, 400),
  ],
  uttarakhand: [
    sized(UNSPLASH.uttarakhandForest, 400),
    sized(UNSPLASH.denseForestTrail, 400),
  ],
}

// ── Experience / trip card images ───────────────────────────────
export const EXPERIENCE_IMAGES: Record<string, string> = {
  'Bir–Barot Trek': sized(UNSPLASH.mountainPeaks, 600),
  'Rajgundha Valley': sized(UNSPLASH.mountainRidges, 600),
  'Shangarh–Raghupur Fort': sized(UNSPLASH.mountainGreenValley, 600),
  'Barot Valley': sized(UNSPLASH.himachalValley, 600),
  'Jawai Safari': sized(UNSPLASH.leopardSafari, 600),
  'Udaipur–Mount Abu': sized(UNSPLASH.rajasthanPalace, 600),
  'Jaisalmer Dunes': sized(UNSPLASH.desertDunes, 600),
  'Kasar Devi–Khaliya Top': sized(UNSPLASH.uttarakhandForest, 600),
  'Binsar Wildlife': sized(UNSPLASH.denseForestTrail, 600),
}

// ── Featured route images (homepage) ────────────────────────────
export const ROUTE_IMAGES: Record<string, string> = {
  'bir-barot': sized(UNSPLASH.villageScene, 600),
  'rajgundha-valley': sized(UNSPLASH.himachalValley, 600),
  'shangarh-raghupur-fort': sized(UNSPLASH.localHomestay, 600),
  jawai: MYNTRA.jawaiWildlife,
  'kasar-devi-khaliya-top': sized(UNSPLASH.indiaLandmark, 600),
}

// ── Stays teaser section ────────────────────────────────────────
export const STAY_PHOTOS = [
  {
    src: sized(UNSPLASH.mountainStay, 400),
    alt: 'Cozy mountain stay',
    caption: 'waking up to this',
    rotation: -3,
  },
  {
    src: `${UNSPLASH.uttarakhandForest}?auto=format&fit=crop&w=800&q=80`,
    alt: 'Forest homestay view',
    caption: 'the view from bed',
    rotation: 2,
  },
  {
    src: sized(UNSPLASH.localHomestay, 400),
    alt: 'Local homestay',
    caption: 'locally rooted',
    rotation: -1,
  },
] as const

export const STAYS_HERO = sized(UNSPLASH.mountainStay, 1920)

// ── Blog post images ────────────────────────────────────────────
export const BLOG_IMAGES = {
  birBarotTrek: sized(UNSPLASH.himachalValley, 600),
  jawaiSecret: MYNTRA.jawaiWildlife,
  slowTravel: sized(UNSPLASH.mountainPeaks, 600),
} as const

// ── About section collage ───────────────────────────────────────
export const ABOUT_IMAGES = {
  large: sized(UNSPLASH.himachalValley, 800),
  medium: sized(UNSPLASH.villageScene, 600),
  small: `${UNSPLASH.uttarakhandForest}?auto=format&fit=crop&w=800&q=80`,
} as const

// ── Homepage hero image ──────────────────────────────────────────
export const HOMEPAGE_HERO = sized(UNSPLASH.villageScene, 1920)

// ── Experiences page hero ───────────────────────────────────────
export const EXPERIENCES_HERO = sized(UNSPLASH.villageScene, 1920)

// ── Experience card images (experiences page) ───────────────────
export const EXPERIENCE_CARD_IMAGES = {
  birBarot: sized(UNSPLASH.himachalValley, 600),
  rajgundhaValley: sized(UNSPLASH.villageScene, 600),
  shangarhRaghupur: sized(UNSPLASH.localHomestay, 600),
  paraglidingBir: sized(UNSPLASH.mountainGreenValley, 600),
  jawaiSafari: sized(UNSPLASH.leopardSafari, 600),
  udaipurMountAbu: sized(UNSPLASH.tajMahal, 600),
  jaisalmerDunes: sized(UNSPLASH.desertDunes, 600),
  horseRiding: sized(UNSPLASH.rajasthanPalace, 600),
  kasarDeviKhaliya: sized(UNSPLASH.indiaLandmark, 600),
  binsarWildlife: sized(UNSPLASH.denseForestTrail, 600),
  dalLake: sized(UNSPLASH.kashmirLake, 600),
  gulmargSnow: sized(UNSPLASH.kashmirLandscape, 600),
} as const

// ── Fallback ────────────────────────────────────────────────────
export const FALLBACK_IMAGE = sized(UNSPLASH.mountainPeaks, 600)
