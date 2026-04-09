import { EXPERIENCE_CARD_IMAGES } from '@/lib/images'

// ── Types ────────────────────────────────────────────────────────

export interface ExperienceBatch {
  id: string
  startDate: string
  endDate: string
  seatsTotal: number
  seatsBooked: number
  price: number
  status: 'open' | 'full' | 'cancelled'
}

export interface ExperienceDetail {
  slug: string
  name: string
  region: string
  regionSlug: string
  type: string
  days: string
  price: number
  description: string
  image: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; description: string }[]
  batches: ExperienceBatch[]
}

// ── Data ─────────────────────────────────────────────────────────

export const EXPERIENCE_DETAILS: ExperienceDetail[] = [
  // ── 1. Bir-Barot Trek ─────────────────────────────────────────
  {
    slug: 'bir-barot-trek',
    name: 'Bir-Barot Trek',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Trekking',
    days: '4 days',
    price: 8999,
    description:
      'Apple orchards, pine forests and shepherd villages that most maps don\'t show. This trail connects the paragliding hub of Bir with the quiet riverside town of Barot through some of Himachal\'s most beautiful and least-visited terrain. Walk through ancient forests, camp beside glacial streams, and share chai with families who\'ve lived here for generations.',
    image: EXPERIENCE_CARD_IMAGES.birBarot,
    highlights: [
      'Trek through untouched pine and oak forests between Bir and Barot',
      'Camp beside the Uhl River under star-filled Himalayan skies',
      'Visit remote shepherd villages with traditional slate-roofed homes',
      'Experience world-class paragliding at Asia\'s best launch site',
      'Home-cooked pahadi meals prepared by local families',
    ],
    inclusions: [
      'All meals during the trek (breakfast, lunch, dinner)',
      'Camping equipment — tents, sleeping bags, mats',
      'Experienced local trek guide and support staff',
      'All internal transfers from Bir to Barot',
      'First-aid kit and basic medical supplies',
      'Forest permits and camping fees',
    ],
    exclusions: [
      'Travel to and from Bir (starting point)',
      'Personal trekking gear — shoes, backpack, rain jacket',
      'Travel insurance (recommended)',
      'Paragliding experience (optional add-on ₹2,500)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Bir & Acclimatization',
        description:
          'Reach Bir by afternoon. Settle into the guesthouse, explore the Tibetan colony, and meet the group over a welcome dinner. Evening briefing on the trek ahead.',
      },
      {
        day: 2,
        title: 'Bir to Rajgundha via Thamsar Pass',
        description:
          'Start the trek early from Billing launch site. Ascend through rhododendron forests to Thamsar Pass at 3,600m. Descend to the hidden valley of Rajgundha. Camp beside a stream.',
      },
      {
        day: 3,
        title: 'Rajgundha to Barot via River Trail',
        description:
          'Follow the Uhl River downstream through dense forests. Stop at shepherd huts for chai. The trail opens up to reveal stunning valley views before reaching Barot by evening.',
      },
      {
        day: 4,
        title: 'Explore Barot & Depart',
        description:
          'Morning visit to the historic Barot dam and trout hatchery. Explore the quiet village, pick up local honey. Depart after lunch with memories and sore legs.',
      },
    ],
    batches: [
      {
        id: 'bir-barot-oct-2025',
        startDate: '2025-10-14',
        endDate: '2025-10-17',
        seatsTotal: 15,
        seatsBooked: 11,
        price: 8999,
        status: 'open',
      },
      {
        id: 'bir-barot-nov-2025',
        startDate: '2025-11-08',
        endDate: '2025-11-11',
        seatsTotal: 15,
        seatsBooked: 7,
        price: 8999,
        status: 'open',
      },
      {
        id: 'bir-barot-dec-2025',
        startDate: '2025-12-20',
        endDate: '2025-12-23',
        seatsTotal: 15,
        seatsBooked: 15,
        price: 9499,
        status: 'full',
      },
    ],
  },

  // ── 2. Rajgundha Valley ───────────────────────────────────────
  {
    slug: 'rajgundha-valley',
    name: 'Rajgundha Valley',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Camping',
    days: '3 days',
    price: 7499,
    description:
      'Remote valley camping with local shepherd families under open Himalayan skies. Rajgundha is one of those places that feels like a secret — a wide meadow surrounded by towering peaks, accessible only on foot. No roads, no shops, no signal. Just mountains, shepherds and silence.',
    image: EXPERIENCE_CARD_IMAGES.rajgundhaValley,
    highlights: [
      'Camp in a remote valley accessible only by foot',
      'Stargaze under some of the clearest Himalayan skies',
      'Share stories and meals with local Gaddi shepherds',
      'Explore ancient shepherd trails and alpine meadows',
    ],
    inclusions: [
      'All meals — local pahadi cuisine cooked fresh',
      'Camping gear — tents, sleeping bags, mats',
      'Trek guide and porters from local village',
      'Internal transfers from Bir to trailhead',
      'Camping and forest permit fees',
    ],
    exclusions: [
      'Travel to Bir (starting point)',
      'Personal trekking gear and rain protection',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bir to Rajgundha Valley',
        description:
          'Meet at Bir in the morning. Drive to the trailhead and begin the trek through pine forests. Ascend steadily to the Rajgundha meadow. Set up camp and enjoy a hot dinner under the stars.',
      },
      {
        day: 2,
        title: 'Valley Exploration Day',
        description:
          'A full day in the valley. Morning hike to a nearby ridge for panoramic views. Visit shepherd huts, learn about Gaddi culture. Afternoon at leisure — read, nap, or just sit with the silence.',
      },
      {
        day: 3,
        title: 'Descend & Depart',
        description:
          'Early breakfast and pack up camp. Trek back to the trailhead through a different route via a waterfall viewpoint. Transfer back to Bir and depart by late afternoon.',
      },
    ],
    batches: [
      {
        id: 'rajgundha-oct-2025',
        startDate: '2025-10-18',
        endDate: '2025-10-20',
        seatsTotal: 12,
        seatsBooked: 10,
        price: 7499,
        status: 'open',
      },
      {
        id: 'rajgundha-nov-2025',
        startDate: '2025-11-15',
        endDate: '2025-11-17',
        seatsTotal: 12,
        seatsBooked: 3,
        price: 7499,
        status: 'open',
      },
    ],
  },

  // ── 3. Shangarh-Raghupur Fort ─────────────────────────────────
  {
    slug: 'shangarh-raghupur-fort',
    name: 'Shangarh-Raghupur Fort',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Cultural',
    days: '2 days',
    price: 5999,
    description:
      'Ancient fort ruins perched above a sacred meadow with Himalayan valley views. Shangarh is a mystical meadow believed to be designed by the gods. From here, a trail leads to Raghupur Fort — a forgotten watchtower from the era of local hill kingdoms, offering 360-degree views of the Tirthan and Sainj valleys.',
    image: EXPERIENCE_CARD_IMAGES.shangarhRaghupur,
    highlights: [
      'Walk through the sacred Shangarh meadow — "designed by gods"',
      'Explore the ruins of Raghupur Fort with panoramic valley views',
      'Stay in a traditional Himachali homestay',
      'Learn local legends from village elders over evening chai',
    ],
    inclusions: [
      'Homestay accommodation with all meals',
      'Local guide familiar with the fort\'s history',
      'All internal transfers from Aut tunnel',
      'Entry fees and permits',
      'Evening bonfire with local stories',
    ],
    exclusions: [
      'Travel to Aut/Banjar (starting point)',
      'Personal hiking gear',
      'Travel insurance',
      'Any additional meals outside the itinerary',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive at Shangarh & Fort Hike',
        description:
          'Reach Shangarh by noon. After a home-cooked lunch, begin the 3-hour hike to Raghupur Fort through oak forests. Explore the fort ruins and watch sunset over the valley. Descend and settle into the homestay.',
      },
      {
        day: 2,
        title: 'Meadow Morning & Depart',
        description:
          'Early morning walk on the Shangarh meadow. Visit the ancient Shangchul Mahadev temple. Enjoy a leisurely breakfast and depart by late morning.',
      },
    ],
    batches: [
      {
        id: 'shangarh-oct-2025',
        startDate: '2025-10-25',
        endDate: '2025-10-26',
        seatsTotal: 10,
        seatsBooked: 9,
        price: 5999,
        status: 'open',
      },
      {
        id: 'shangarh-nov-2025',
        startDate: '2025-11-22',
        endDate: '2025-11-23',
        seatsTotal: 10,
        seatsBooked: 4,
        price: 5999,
        status: 'open',
      },
    ],
  },

  // ── 4. Jawai Safari ───────────────────────────────────────────
  {
    slug: 'jawai-safari',
    name: 'Jawai Safari',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Wildlife',
    days: '3 days',
    price: 11999,
    description:
      'Leopard territory, ancient temples and tribal villages off the tourist trail. Jawai is where wild leopards roam granite hills alongside the Rabari tribe who worship them. No fences, no national park gates — just an extraordinary coexistence between humans and big cats that you won\'t find anywhere else in India.',
    image: EXPERIENCE_CARD_IMAGES.jawaiSafari,
    highlights: [
      'Spot wild leopards on open granite hills — no cages, no fences',
      'Visit Rabari tribal villages and learn about leopard coexistence',
      'Explore the stunning Jawai dam and flamingo congregation',
      'Sunset jeep safari through rugged Aravalli terrain',
      'Stay in a heritage camp with Rajasthani hospitality',
    ],
    inclusions: [
      'Heritage camp accommodation — 2 nights',
      'All meals — authentic Rajasthani thali and campfire dinners',
      'Two leopard safari sessions (morning + evening)',
      'Village walk with local Rabari guides',
      'Jawai dam visit and birdwatching',
      'All internal transfers in open-top safari jeep',
    ],
    exclusions: [
      'Travel to Jawai/Sumerpur (nearest railhead)',
      'Personal binoculars and camera equipment',
      'Travel insurance',
      'Tips for safari drivers and camp staff',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive & Evening Safari',
        description:
          'Arrive at Jawai camp by early afternoon. Settle in and enjoy a traditional welcome. First leopard safari at golden hour — drive through boulder-strewn hills as the sun sets over the Aravalli range.',
      },
      {
        day: 2,
        title: 'Dawn Safari & Village Walk',
        description:
          'Early morning safari for the best leopard sighting chances. Return for breakfast. Late morning village walk with Rabari families. Afternoon visit to Jawai dam for flamingos. Evening campfire dinner.',
      },
      {
        day: 3,
        title: 'Final Safari & Depart',
        description:
          'Last chance morning safari. Return to camp for brunch. Pack up and depart with a gift from the Rabari community. Transfer to the nearest railhead.',
      },
    ],
    batches: [
      {
        id: 'jawai-nov-2025',
        startDate: '2025-11-07',
        endDate: '2025-11-09',
        seatsTotal: 12,
        seatsBooked: 5,
        price: 11999,
        status: 'open',
      },
      {
        id: 'jawai-dec-2025',
        startDate: '2025-12-12',
        endDate: '2025-12-14',
        seatsTotal: 12,
        seatsBooked: 11,
        price: 12999,
        status: 'open',
      },
    ],
  },

  // ── 5. Paragliding in Bir ─────────────────────────────────────
  {
    slug: 'paragliding-in-bir',
    name: 'Paragliding in Bir',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    type: 'Activities',
    days: '1 day',
    price: 3499,
    description:
      'Tandem paragliding from the world\'s best launch site above the Kangra Valley. Soar above Bir-Billing, feel the thermals lift you above the clouds, and land in the Tibetan colony below.',
    image: EXPERIENCE_CARD_IMAGES.paraglidingBir,
    highlights: [
      'Fly from Billing — Asia\'s top-rated paragliding launch site',
      'Soar at 2,400m with views of Dhauladhar range',
      'Tandem flight with certified professional pilots',
      'GoPro video of your flight included',
    ],
    inclusions: [
      'Tandem paragliding flight (15–25 min)',
      'Certified pilot and all safety equipment',
      'Transfer from Bir to Billing launch site',
      'GoPro footage of your flight',
      'Landing zone pickup back to Bir',
    ],
    exclusions: [
      'Travel to Bir',
      'Meals and accommodation',
      'Personal insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Fly Over the Kangra Valley',
        description:
          'Morning transfer to Billing launch site. Safety briefing with your pilot. Take off and soar above the valley for 15–25 minutes depending on thermals. Land in the Bir Tibetan colony. Collect your GoPro footage.',
      },
    ],
    batches: [
      {
        id: 'paragliding-daily',
        startDate: '2025-10-01',
        endDate: '2025-10-01',
        seatsTotal: 8,
        seatsBooked: 2,
        price: 3499,
        status: 'open',
      },
    ],
  },

  // ── 6. Udaipur-Mount Abu ──────────────────────────────────────
  {
    slug: 'udaipur-mount-abu',
    name: 'Udaipur-Mount Abu',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Cultural',
    days: '4 days',
    price: 10999,
    description:
      'Lakes, palaces and the only hill station in Rajasthan — slow and real. From the romance of Udaipur\'s lake city to the cool forests of Mount Abu, this trip explores the gentler side of Rajasthan.',
    image: EXPERIENCE_CARD_IMAGES.udaipurMountAbu,
    highlights: [
      'Explore the City of Lakes — Udaipur\'s ghats, havelis and old bazaars',
      'Stay in a heritage haveli with rooftop views of Lake Pichola',
      'Drive through the Aravalli Hills to Mount Abu',
      'Visit the exquisite Dilwara Jain Temples',
    ],
    inclusions: [
      'Heritage haveli stays — 3 nights',
      'All meals — Rajasthani and Mewari cuisine',
      'Guided city walk in Udaipur with local historian',
      'All internal transfers in AC vehicle',
      'Entry fees to all monuments and temples',
    ],
    exclusions: [
      'Travel to/from Udaipur',
      'Personal shopping and souvenirs',
      'Travel insurance',
      'Boat ride on Lake Pichola (optional ₹400)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Udaipur',
        description:
          'Settle into the heritage haveli. Evening walk through the old city lanes, ghats and local bazaar. Rooftop dinner overlooking Lake Pichola.',
      },
      {
        day: 2,
        title: 'Udaipur Deep Dive',
        description:
          'Morning guided walk through the City Palace complex. Afternoon at Saheliyon ki Bari gardens. Optional sunset boat ride on the lake.',
      },
      {
        day: 3,
        title: 'Drive to Mount Abu',
        description:
          'Scenic drive through the Aravalli range. Check into the forest lodge. Visit the stunning Dilwara temples. Evening nature walk to Sunset Point.',
      },
      {
        day: 4,
        title: 'Mount Abu & Depart',
        description:
          'Morning trek to Guru Shikhar — highest point in Rajasthan. Visit Nakki Lake. Depart after lunch.',
      },
    ],
    batches: [
      {
        id: 'udaipur-nov-2025',
        startDate: '2025-11-20',
        endDate: '2025-11-23',
        seatsTotal: 12,
        seatsBooked: 6,
        price: 10999,
        status: 'open',
      },
    ],
  },

  // ── 7. Jaisalmer Dunes ────────────────────────────────────────
  {
    slug: 'jaisalmer-dunes',
    name: 'Jaisalmer Dunes',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Adventure',
    days: '3 days',
    price: 9499,
    description:
      'Desert camping under a billion stars in the golden heart of the Thar. Jaisalmer is more than just a fort city — it\'s the gateway to the living desert where nomads still roam and the sand sings at sunset.',
    image: EXPERIENCE_CARD_IMAGES.jaisalmerDunes,
    highlights: [
      'Sleep on sand dunes under the clearest night sky you\'ll ever see',
      'Camel safari into the Thar desert with Rajasthani folk music',
      'Explore the golden fort — the only living fort in India',
      'Visit abandoned desert villages and Kuldhara ghost town',
    ],
    inclusions: [
      'Desert camp stay with luxury tents — 2 nights',
      'All meals — traditional Rajasthani food cooked over campfire',
      'Camel safari to remote dunes',
      'Fort walk with local guide',
      'All internal transfers',
    ],
    exclusions: [
      'Travel to Jaisalmer',
      'Personal desert gear — sunscreen, scarf',
      'Travel insurance',
      'Dune buggy ride (optional ₹1,500)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive & Explore the Golden Fort',
        description:
          'Arrive in Jaisalmer and check into a haveli. Afternoon guided walk through the living fort. Evening at leisure in the old market. Night in the city.',
      },
      {
        day: 2,
        title: 'Into the Desert',
        description:
          'Morning visit to Kuldhara ghost village. Afternoon camel safari into the dunes. Watch the sunset from the highest dune. Campfire dinner with Rajasthani folk music under the stars.',
      },
      {
        day: 3,
        title: 'Desert Dawn & Depart',
        description:
          'Wake up for sunrise over the dunes. Hot chai on the sand. Return to Jaisalmer by late morning. Depart after brunch.',
      },
    ],
    batches: [
      {
        id: 'jaisalmer-nov-2025',
        startDate: '2025-11-28',
        endDate: '2025-11-30',
        seatsTotal: 15,
        seatsBooked: 8,
        price: 9499,
        status: 'open',
      },
    ],
  },

  // ── 8. Horse Riding Workshop ──────────────────────────────────
  {
    slug: 'horse-riding-workshop',
    name: 'Horse Riding Workshop',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    type: 'Activities',
    days: '1 day',
    price: 2999,
    description:
      'Traditional Marwari horse riding with local trainers in the desert heartland. The Marwari horse is one of the rarest breeds in the world, known for their inward-curving ears and desert endurance.',
    image: EXPERIENCE_CARD_IMAGES.horseRiding,
    highlights: [
      'Ride the legendary Marwari horse breed',
      'Learn from traditional Rajput horse trainers',
      'Ride through village trails and open desert terrain',
    ],
    inclusions: [
      'Half-day horse riding session',
      'Professional trainer and safety equipment',
      'Refreshments and traditional snacks',
      'Transfer from city hotel to riding grounds',
    ],
    exclusions: [
      'Travel to Jodhpur/Udaipur',
      'Meals and accommodation',
      'Personal riding boots (available for rent)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ride Like Royalty',
        description:
          'Morning pickup from your hotel. Arrive at the Marwari stud farm. Meet your horse and trainer. Begin with ground basics, then mount up for a countryside ride. Return by early afternoon.',
      },
    ],
    batches: [
      {
        id: 'horse-riding-daily',
        startDate: '2025-10-15',
        endDate: '2025-10-15',
        seatsTotal: 6,
        seatsBooked: 1,
        price: 2999,
        status: 'open',
      },
    ],
  },

  // ── 9. Kasar Devi-Khaliya Top ─────────────────────────────────
  {
    slug: 'kasar-devi-khaliya-top',
    name: 'Kasar Devi-Khaliya Top',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    type: 'Trekking',
    days: '5 days',
    price: 12999,
    description:
      'Through rhododendron forests to high meadows with sweeping Himalayan panoramas. From the spiritual energy of Kasar Devi to the snow-capped views of Khaliya Top, this trek traverses some of Kumaon\'s finest terrain.',
    image: EXPERIENCE_CARD_IMAGES.kasarDeviKhaliya,
    highlights: [
      'Trek through ancient rhododendron and oak forests',
      'Summit Khaliya Top at 3,500m for 360-degree Himalayan views',
      'Visit the mystical Kasar Devi temple — a Van Allen Belt site',
      'Camp in alpine meadows surrounded by Nanda Devi peaks',
    ],
    inclusions: [
      'All meals during the trek',
      'Camping equipment and tents',
      'Experienced local guide and porters',
      'All internal transfers from Kathgodam',
      'Forest permits and camping fees',
    ],
    exclusions: [
      'Travel to Kathgodam',
      'Personal trekking gear',
      'Travel insurance',
      'Sleeping bag rental (available ₹200/day)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Kasar Devi',
        description:
          'Reach Almora by afternoon. Transfer to Kasar Devi village. Visit the ancient Kasar Devi temple. Settle into the guesthouse. Evening briefing and group dinner.',
      },
      {
        day: 2,
        title: 'Kasar Devi to Dhakuri',
        description:
          'Begin trek from Loharkhet. Climb steadily through oak forests. Camp at Dhakuri Pass with views of Panchachuli peaks.',
      },
      {
        day: 3,
        title: 'Dhakuri to Khaliya Base',
        description:
          'Descend to Patal Bhuvaneshwar and ascend through bugyals (alpine meadows). Camp at the base of Khaliya Top.',
      },
      {
        day: 4,
        title: 'Summit Day — Khaliya Top',
        description:
          'Early morning summit push. Reach the top at 3,500m for spectacular views of Nanda Devi, Nanda Kot and the Panchachuli range. Descend to Munsiyari.',
      },
      {
        day: 5,
        title: 'Munsiyari & Depart',
        description:
          'Morning visit to Nanda Devi viewpoint. Explore the tribal museum. Depart for Kathgodam by afternoon.',
      },
    ],
    batches: [
      {
        id: 'kasar-devi-oct-2025',
        startDate: '2025-10-20',
        endDate: '2025-10-24',
        seatsTotal: 12,
        seatsBooked: 4,
        price: 12999,
        status: 'open',
      },
    ],
  },

  // ── 10. Binsar Wildlife Sanctuary ─────────────────────────────
  {
    slug: 'binsar-wildlife-sanctuary',
    name: 'Binsar Wildlife Sanctuary',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    type: 'Wildlife',
    days: '3 days',
    price: 8499,
    description:
      'Dense oak forests, Himalayan birds and the quiet chance of spotting a leopard. Binsar is one of Kumaon\'s best-kept secrets — a sanctuary wrapped in ancient broadleaf forests with over 200 bird species.',
    image: EXPERIENCE_CARD_IMAGES.binsarWildlife,
    highlights: [
      'Walk through ancient oak and rhododendron forests',
      'Spot over 200 species of Himalayan birds',
      'Visit the Zero Point viewpoint for 300km Himalayan panorama',
      'Stay in a forest rest house deep inside the sanctuary',
    ],
    inclusions: [
      'Forest rest house accommodation — 2 nights',
      'All meals — local Kumaoni cuisine',
      'Naturalist guide for forest walks and birdwatching',
      'Sanctuary entry permits',
      'All internal transfers from Kathgodam',
    ],
    exclusions: [
      'Travel to Kathgodam',
      'Personal binoculars and camera equipment',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive at Binsar',
        description:
          'Drive from Kathgodam through the Kumaon hills. Check into the forest rest house. Afternoon nature walk with the resident naturalist. Evening birdlist session.',
      },
      {
        day: 2,
        title: 'Deep Forest Exploration',
        description:
          'Dawn walk for birdwatching. Visit Zero Point for the best Himalayan panorama. Afternoon guided walk to the ancient Binsar Mahadev temple. Night walk for nocturnal wildlife.',
      },
      {
        day: 3,
        title: 'Final Walk & Depart',
        description:
          'Early morning walk to the leopard trail. Return for breakfast. Depart by late morning through the scenic Almora route.',
      },
    ],
    batches: [
      {
        id: 'binsar-nov-2025',
        startDate: '2025-11-14',
        endDate: '2025-11-16',
        seatsTotal: 8,
        seatsBooked: 3,
        price: 8499,
        status: 'open',
      },
    ],
  },

  // ── 11. Dal Lake Experience (Coming Soon) ─────────────────────
  {
    slug: 'dal-lake-experience',
    name: 'Dal Lake Experience',
    region: 'Kashmir',
    regionSlug: 'kashmir',
    type: 'Stays',
    days: '4 days',
    price: 14999,
    description:
      'Shikara rides through floating gardens, saffron fields and silent mornings. Stay on a traditional houseboat and experience Kashmir the way it was meant to be — slowly, on the water.',
    image: EXPERIENCE_CARD_IMAGES.dalLake,
    highlights: [
      'Stay on a traditional Kashmiri houseboat on Dal Lake',
      'Dawn shikara rides through lotus gardens',
      'Visit the floating vegetable market',
      'Explore Mughal gardens and old Srinagar',
    ],
    inclusions: [
      'Houseboat accommodation — 3 nights',
      'All meals — Kashmiri wazwan and kahwa',
      'Daily shikara rides',
      'Mughal garden visits with guide',
      'Airport transfers',
    ],
    exclusions: [
      'Flights to Srinagar',
      'Personal winter clothing',
      'Travel insurance',
      'Shopping and souvenirs',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Srinagar',
        description:
          'Airport pickup and transfer to the houseboat on Dal Lake. Settle in. Evening shikara ride to watch the sunset over the Zabarwan hills.',
      },
      {
        day: 2,
        title: 'Old Srinagar & Mughal Gardens',
        description:
          'Morning walk through the old city. Visit Jama Masjid and local markets. Afternoon at Nishat and Shalimar Bagh. Return to the houseboat for a Kashmiri wazwan dinner.',
      },
      {
        day: 3,
        title: 'Floating Markets & Saffron Fields',
        description:
          'Dawn visit to the floating vegetable market. Late morning drive to Pampore saffron fields. Afternoon at leisure on the lake.',
      },
      {
        day: 4,
        title: 'Morning on the Lake & Depart',
        description:
          'Final shikara ride. Farewell kahwa on the houseboat. Transfer to the airport.',
      },
    ],
    batches: [
      {
        id: 'dal-lake-apr-2026',
        startDate: '2026-04-15',
        endDate: '2026-04-18',
        seatsTotal: 10,
        seatsBooked: 0,
        price: 14999,
        status: 'cancelled',
      },
    ],
  },

  // ── 12. Gulmarg in Snow (Coming Soon) ─────────────────────────
  {
    slug: 'gulmarg-in-snow',
    name: 'Gulmarg in Snow',
    region: 'Kashmir',
    regionSlug: 'kashmir',
    type: 'Adventure',
    days: '3 days',
    price: 13999,
    description:
      'Asia\'s highest gondola and winter trails through untouched snowfields. Gulmarg transforms into a winter wonderland — perfect for skiing, snowboarding, or simply walking through a world blanketed in white.',
    image: EXPERIENCE_CARD_IMAGES.gulmargSnow,
    highlights: [
      'Ride Asia\'s highest gondola to 3,979m',
      'Ski or snowboard on world-class powder snow',
      'Snowshoe trek through silent pine forests',
      'Stay in a cozy mountain lodge with bonfire dinners',
    ],
    inclusions: [
      'Mountain lodge stay — 2 nights',
      'All meals',
      'Gondola tickets (Phase 1 + Phase 2)',
      'Snowshoe or skiing equipment rental',
      'All internal transfers from Srinagar',
    ],
    exclusions: [
      'Flights to Srinagar',
      'Personal winter gear and thermals',
      'Travel insurance',
      'Professional skiing lessons (optional ₹3,000)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Gulmarg',
        description:
          'Drive from Srinagar through snow-covered pines. Check into the mountain lodge. Afternoon free to explore the meadow. Bonfire dinner.',
      },
      {
        day: 2,
        title: 'Gondola & Snow Activities',
        description:
          'Take the gondola to the top station. Spend the day skiing, snowboarding, or simply marveling at the views. Afternoon snowshoe trek in the forest.',
      },
      {
        day: 3,
        title: 'Morning Walk & Depart',
        description:
          'Gentle morning walk to St. Mary\'s Church. Hot kahwa and departure to Srinagar airport.',
      },
    ],
    batches: [
      {
        id: 'gulmarg-jan-2026',
        startDate: '2026-01-10',
        endDate: '2026-01-12',
        seatsTotal: 12,
        seatsBooked: 0,
        price: 13999,
        status: 'cancelled',
      },
    ],
  },
]

// ── Helper ───────────────────────────────────────────────────────

export function getExperienceBySlug(slug: string): ExperienceDetail | undefined {
  return EXPERIENCE_DETAILS.find((e) => e.slug === slug)
}
