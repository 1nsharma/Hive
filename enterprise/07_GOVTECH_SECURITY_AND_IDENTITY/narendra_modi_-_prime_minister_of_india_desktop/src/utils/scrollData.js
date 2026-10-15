export const scrollSections = [
  {
    id: 'intro',
    year: '1950 — Present',
    title: 'The Years of Modi',
    subtitle: 'From Vadnagar to Global Leadership',
    chapter: 'Prologue',
    chapterColor: '#E67E22',
    modelPosition: { x: 0, y: -0.2, z: 0 },
    modelRotation: { x: 0, y: 0, z: 0 },
    cameraPosition: { x: 0, y: 1.8, z: 7.5 },
    backgroundColor: '#0a0e1a',
    media: null,
    quote: "A journey of dedication to 1.4 billion citizens begins with humble service to the nation.",
    duration: 1.4
  },
  {
    id: 'birth',
    year: '1950',
    title: 'Humble Beginnings',
    subtitle: 'Vadnagar, Gujarat',
    chapter: 'Early Life',
    chapterColor: '#E67E22',
    modelPosition: { x: -1.6, y: -0.2, z: 0 },
    modelRotation: { x: 0, y: -Math.PI / 5, z: 0 },
    cameraPosition: { x: 0, y: 1.2, z: 6.2 },
    backgroundColor: '#0d1117',
    media: {
      type: 'image',
      url: '/media/images/vadnagar.svg',
      caption: 'Vadnagar - Ancient town with rich spiritual & cultural heritage'
    },
    content: 'Born into a modest family in Mehsana district. Grew up helping his father at the railway tea stall, learning the values of discipline, self-reliance, and hard work.',
    duration: 1.8
  },
  {
    id: 'rss',
    year: '1971',
    title: 'Ideological Foundation',
    subtitle: 'Grassroots Social Service & Organization',
    chapter: 'Early Life',
    chapterColor: '#E67E22',
    modelPosition: { x: -1.2, y: -0.2, z: 0.5 },
    modelRotation: { x: 0, y: Math.PI / 6, z: 0 },
    cameraPosition: { x: 1.2, y: 1.4, z: 5.8 },
    backgroundColor: '#111827',
    media: {
      type: 'image',
      url: '/media/images/rss.svg',
      caption: 'Grassroots organizational work and democracy movement (1975-77)'
    },
    content: 'Dedicated youth to social upliftment as an RSS pracharak. Traveled extensively across Gujarat and India, gaining firsthand insight into the struggles and aspirations of common citizens.',
    duration: 1.8
  },
  {
    id: 'gujarat-cm',
    year: '2001',
    title: 'Chief Minister of Gujarat',
    subtitle: 'Pioneering the Gujarat Development Model',
    chapter: 'Governance',
    chapterColor: '#2ECC71',
    modelPosition: { x: 1.4, y: 0.1, z: 0 },
    modelRotation: { x: 0, y: -Math.PI / 4, z: 0 },
    cameraPosition: { x: -0.8, y: 1.8, z: 6.5 },
    backgroundColor: '#0a101d',
    media: {
      type: 'image',
      url: '/media/images/gujarat-cm.svg',
      caption: '13 years of transformative administrative governance (2001 - 2014)'
    },
    content: 'Served four consecutive terms as Chief Minister, transforming Gujarat into an economic, industrial, and infrastructure powerhouse of India.',
    achievements: [
      'Vibrant Gujarat Global Summit - Catalyzed global investments',
      'Jyotigram Yojana - Delivered uninterrupted 24x7 3-phase electricity to 18,000+ villages',
      'Sujalam Sufalam - Unprecedented water canal grid reviving agriculture'
    ],
    duration: 2.2
  },
  {
    id: 'pm-2014',
    year: '2014',
    title: '14th Prime Minister',
    subtitle: 'Historic Single-Party Mandate in 30 Years',
    chapter: 'Governance',
    chapterColor: '#2ECC71',
    modelPosition: { x: 0, y: 0.4, z: -0.5 },
    modelRotation: { x: 0, y: 0, z: 0 },
    cameraPosition: { x: 0, y: 2.0, z: 6.8 },
    backgroundColor: '#080c14',
    media: {
      type: 'image',
      url: '/media/images/pm-oath-2014.svg',
      caption: 'May 26, 2014 - Oath of office at Rashtrapati Bhavan before SAARC leaders'
    },
    content: 'First Prime Minister born in independent India. Swept to power with a decisive absolute majority on the plank of development, minimum government, and maximum governance.',
    decisions: [
      'Make in India - Manufacturing revolution',
      'Swachh Bharat Abhiyan - 110M+ sanitation facilities',
      'Jan Dhan Yojana - Financial inclusion for 500M+ unbanked citizens',
      'Digital India - Foundation of modern DPI stack'
    ],
    duration: 2.6
  },
  {
    id: 'demonetization',
    year: '2016',
    title: 'Bold Financial Reform',
    subtitle: 'Demonetization & The Digital Leap',
    chapter: 'Governance',
    chapterColor: '#2ECC71',
    modelPosition: { x: 1.6, y: 0, z: 0.6 },
    modelRotation: { x: 0, y: -Math.PI / 3, z: 0 },
    cameraPosition: { x: 2.2, y: 1.2, z: 5.5 },
    backgroundColor: '#0f172a',
    media: {
      type: 'image',
      url: '/media/images/digital-leap.svg',
      caption: 'The pivotal catalyst for India\'s world-leading FinTech ecosystem'
    },
    impact: {
      upi: 'Over 13 Billion monthly real-time transactions',
      growth: '46% of all global digital real-time payments occur in India',
      taxBase: 'Double-digit expansion in formalized direct taxpayer base'
    },
    duration: 2.0
  },
  {
    id: 'pm-2019',
    year: '2019',
    title: 'Second Consecutive Term',
    subtitle: 'Stronger Mandate: 303 Seats',
    chapter: 'Governance',
    chapterColor: '#2ECC71',
    modelPosition: { x: -1.2, y: 0.8, z: 0 },
    modelRotation: { x: 0, y: Math.PI / 4, z: 0 },
    cameraPosition: { x: 0, y: 2.4, z: 7.2 },
    backgroundColor: '#0d1117',
    media: {
      type: 'image',
      url: '/media/images/pm-oath-2019.svg',
      caption: 'May 30, 2019 - Swearing-in ceremony with BIMSTEC world leaders'
    },
    content: 'First non-Congress Prime Minister to return with an even larger single-party majority, solidifying a mandate for deep structural reforms.',
    decisions: [
      'Article 370 Abrogation - Full constitutional integration of Jammu & Kashmir',
      'PM Kisan Samman Nidhi - ₹6,000/yr direct support to 110M+ farmers',
      'Ayushman Bharat PM-JAY - World\'s largest free healthcare program (500M+ covered)'
    ],
    duration: 2.4
  },
  {
    id: 'atmanirbhar',
    year: '2020',
    title: 'Atmanirbhar Bharat',
    subtitle: 'Resilience, Self-Reliance & Vaccine Maitri',
    chapter: 'Governance',
    chapterColor: '#2ECC71',
    modelPosition: { x: 0, y: 0.2, z: 1.2 },
    modelRotation: { x: 0, y: 0, z: 0 },
    cameraPosition: { x: -1.4, y: 1.4, z: 5.8 },
    backgroundColor: '#0a0e1a',
    media: {
      type: 'image',
      url: '/media/images/atmanirbhar.svg',
      caption: '₹20 Lakh Crore economic package and 2.2B+ indigenous vaccine doses'
    },
    content: 'Turned global crisis into opportunity by spearheading indigenous semiconductor, defense, and pharmaceutical manufacturing through Production Linked Incentive (PLI) schemes.',
    duration: 2.0
  },
  {
    id: 'chandrayaan',
    year: '2023',
    title: 'Chandrayaan-3 Moon Landing',
    subtitle: 'India Touches the Lunar South Pole',
    chapter: 'Milestones',
    chapterColor: '#E74C3C',
    modelPosition: { x: 1.2, y: 1.2, z: -0.6 },
    modelRotation: { x: 0, y: Math.PI / 3, z: 0 },
    cameraPosition: { x: 0, y: 2.8, z: 8.2 },
    backgroundColor: '#0b1329',
    media: {
      type: 'image',
      url: '/media/images/chandrayaan-3.svg',
      caption: 'Shiv Shakti Point: First country in human history to land at Moon\'s south pole'
    },
    quote: "When we see such historic moments, we realize that human capability knows no bounds. India has touched the Moon.",
    achievements: [
      'National Space Day declared on August 23rd',
      'Executed at a benchmark mission cost of $75M',
      'Paved way for Gaganyaan human spaceflight mission'
    ],
    duration: 2.5
  },
  {
    id: 'g20',
    year: '2023',
    title: 'G20 Presidency',
    subtitle: 'Vasudhaiva Kutumbakam: One Earth, One Family, One Future',
    chapter: 'Diplomacy',
    chapterColor: '#9B59B6',
    modelPosition: { x: -1.5, y: 0.6, z: 0.8 },
    modelRotation: { x: 0, y: -Math.PI / 4, z: 0 },
    cameraPosition: { x: -2.0, y: 1.8, z: 6.8 },
    backgroundColor: '#0d1117',
    media: {
      type: 'image',
      url: '/media/images/g20-summit.svg',
      caption: 'New Delhi Leaders Summit at Bharat Mandapam - 100% consensus achieved'
    },
    achievements: [
      'Induction of the 55-nation African Union as a permanent G20 member',
      'India-Middle East-Europe Economic Corridor (IMEC) announced',
      'Global Biofuels Alliance founded'
    ],
    duration: 2.4
  },
  {
    id: 'pm-2024',
    year: '2024',
    title: 'Historic Third Term',
    subtitle: 'Viksit Bharat 2047 Roadmap',
    chapter: 'Governance',
    chapterColor: '#2ECC71',
    modelPosition: { x: 0, y: 0, z: 0 },
    modelRotation: { x: 0, y: 0, z: 0 },
    cameraPosition: { x: 0, y: 1.8, z: 6.2 },
    backgroundColor: '#09101e',
    media: {
      type: 'image',
      url: '/media/images/pm-oath-2024.svg',
      caption: 'June 9, 2024: First Prime Minister since 1962 to win three consecutive terms'
    },
    vision: [
      'Developed India (Viksit Bharat) by centenary of independence in 2047',
      'Transition from 5th to 3rd largest world economy',
      'Next-generation high-speed rail, green hydrogen & semiconductor hubs'
    ],
    duration: 2.6
  },
  {
    id: 'epilogue',
    year: '2024 & Beyond',
    title: 'The Legacy Continues',
    subtitle: '1.4 Billion Indians Strong',
    chapter: 'Epilogue',
    chapterColor: '#FFD700',
    modelPosition: { x: 0, y: 0, z: 0 },
    modelRotation: { x: 0, y: Math.PI * 2, z: 0 },
    cameraPosition: { x: 0, y: 1.2, z: 7.5 },
    backgroundColor: '#0a0e1a',
    media: null,
    quote: "Sabka Saath, Sabka Vikas, Sabka Vishwas, Sabka Prayas — For an inclusive, prosperous, and developed nation.",
    duration: 1.8
  }
];

export const chapters = [
  { id: 'prologue', name: 'Prologue', color: '#E67E22', sectionIndex: 0 },
  { id: 'early-life', name: 'Early Life', color: '#E67E22', sectionIndex: 1 },
  { id: 'governance', name: 'Governance', color: '#2ECC71', sectionIndex: 3 },
  { id: 'milestones', name: 'Milestones', color: '#E74C3C', sectionIndex: 8 },
  { id: 'diplomacy', name: 'Diplomacy', color: '#9B59B6', sectionIndex: 9 },
  { id: 'epilogue', name: 'Epilogue', color: '#FFD700', sectionIndex: 11 }
];

export default scrollSections;
