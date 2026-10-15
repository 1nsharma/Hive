export const timelineData = [
  {
    id: 1,
    year: 1950,
    title: "Birth in Vadnagar",
    date: "September 17, 1950",
    description: "Born in Vadnagar, a historic town in Mehsana district of Gujarat",
    category: "life",
    position: { x: -40, y: 0, z: 0 },
    cameraPosition: { x: -35, y: 8, z: 25 },
    color: "#FF9933",
    media: {
      type: "image",
      url: "/media/images/vadnagar.svg",
      caption: "Vadnagar - Ancient town with rich cultural heritage"
    },
    details: {
      earlyLife: "Grew up in a modest family, helped father at railway station tea stall",
      education: "Completed MA in Political Science from Gujarat University"
    }
  },
  {
    id: 2,
    year: 1971,
    title: "RSS Full-time Worker",
    date: "1971",
    description: "Joined Rashtriya Swayamsevak Sangh as a dedicated full-time worker (pracharak)",
    category: "career",
    position: { x: -28, y: 2, z: 4 },
    cameraPosition: { x: -24, y: 10, z: 25 },
    color: "#FF6B6B",
    media: {
      type: "image",
      url: "/media/images/rss.svg",
      caption: "Grassroots organization and social service across India"
    },
    achievements: [
      "Extensive nationwide travel connecting with grassroots communities",
      "Key coordinator during the 1975-77 democracy movement",
      "Organized relief efforts during the 1979 Morbi dam failure"
    ]
  },
  {
    id: 3,
    year: 2001,
    title: "Chief Minister of Gujarat",
    date: "October 7, 2001",
    description: "Sworn in as the 14th Chief Minister of Gujarat, serving four consecutive terms until 2014",
    category: "governance",
    position: { x: -16, y: 3, z: 6 },
    cameraPosition: { x: -12, y: 12, z: 28 },
    color: "#4ECDC4",
    media: {
      type: "image",
      url: "/media/images/gujarat-cm.svg",
      caption: "Pioneering the Gujarat Development Model"
    },
    achievements: [
      "Vibrant Gujarat Summit - Catalyzed global investment into India",
      "Jyotigram Yojana - Provided 24x7 3-phase electricity to all villages",
      "Kanya Kelavani - Massive push for girl child primary education",
      "Sujalam Sufalam - Transforming agriculture through canal networks"
    ],
    decisions: [
      { name: "Jyotigram Yojana", impact: "24/7 power supply to 18,000+ villages" },
      { name: "Vibrant Gujarat Summits", impact: "Attracted $400B+ global investments" }
    ]
  },
  {
    id: 4,
    year: 2014,
    title: "Prime Minister - First Term",
    date: "May 26, 2014",
    description: "Elected as 14th Prime Minister of India with historic first single-party majority in 30 years",
    category: "governance",
    position: { x: -4, y: 4, z: 8 },
    cameraPosition: { x: 0, y: 14, z: 30 },
    color: "#FFA07A",
    media: {
      type: "image",
      url: "/media/images/pm-oath-2014.svg",
      caption: "Oath taking ceremony at Rashtrapati Bhavan before SAARC leaders"
    },
    achievements: [
      "Make in India - Transforming India into a global manufacturing powerhouse",
      "Swachh Bharat Abhiyan - 110M+ household toilets built across the nation",
      "Digital India & JAM Trinity - Direct benefit transfers saving billions",
      "Pradhan Mantri Jan Dhan Yojana - 500M+ zero-balance bank accounts opened"
    ],
    decisions: [
      { name: "Demonetization (Nov 2016)", impact: "₹500 & ₹1000 notes phased out to formalize economy" },
      { name: "GST Implementation (July 2017)", impact: "Unified indirect tax system under 'One Nation One Tax'" },
      { name: "Insolvency & Bankruptcy Code", impact: "Modern corporate recovery framework" }
    ],
    socialMedia: {
      twitter: "@narendramodi",
      followers: "100M+",
      notablePosts: [
        { date: "2014-05-26", content: "Honored to serve India as PM. Dedicated to 1.4 billion citizens.", engagement: "2.5M+" }
      ]
    }
  },
  {
    id: 5,
    year: 2016,
    title: "Demonetization & Digital Leap",
    date: "November 8, 2016",
    description: "Bold monetary step to combat unaccounted cash and accelerate the digital payments revolution",
    category: "governance",
    position: { x: 8, y: 4, z: 8 },
    cameraPosition: { x: 12, y: 12, z: 28 },
    color: "#95E1D3",
    media: {
      type: "image",
      url: "/media/images/digital-leap.svg",
      caption: "The catalyst for India's world-leading FinTech ecosystem"
    },
    impact: {
      digitalPayments: "UPI transactions grew from 1M to over 13 Billion per month",
      taxBase: "Individual and corporate taxpayer base doubled",
      formalization: "Unprecedented shift to formalized banking accounts"
    }
  },
  {
    id: 6,
    year: 2019,
    title: "Prime Minister - Second Term",
    date: "May 30, 2019",
    description: "Re-elected with an overwhelming 303 seats - first non-Congress PM with consecutive full terms",
    category: "governance",
    position: { x: 20, y: 5, z: 10 },
    cameraPosition: { x: 24, y: 14, z: 32 },
    color: "#F38181",
    media: {
      type: "image",
      url: "/media/images/pm-oath-2019.svg",
      caption: "Second term oath ceremony with BIMSTEC world leaders"
    },
    achievements: [
      "Article 370 Abrogation - Full constitutional integration of Jammu & Kashmir",
      "PM Kisan Samman Nidhi - Direct ₹6,000/yr financial support to 110M+ farmers",
      "Ayushman Bharat PM-JAY - World's largest government healthcare plan (500M+ beneficiaries)",
      "Jal Jeevan Mission - Tap water to over 150 million rural households"
    ],
    decisions: [
      { name: "Article 370 (Aug 2019)", impact: "Ended temporary special status, booming tourism and development" },
      { name: "Citizenship Amendment Act", impact: "Protection for persecuted minorities from neighbouring countries" },
      { name: "National Education Policy 2020", impact: "Holistic 21st-century multidisciplinary curriculum" }
    ]
  },
  {
    id: 7,
    year: 2020,
    title: "Atmanirbhar Bharat & Covid Response",
    date: "May 12, 2020",
    description: "₹20 Lakh Crore economic package for self-reliant India and the world's largest digital vaccine rollout",
    category: "governance",
    position: { x: 32, y: 5, z: 10 },
    cameraPosition: { x: 36, y: 13, z: 30 },
    color: "#AA96DA",
    media: {
      type: "image",
      url: "/media/images/atmanirbhar.svg",
      caption: "Self-reliant India and Vaccine Maitri humanitarian initiative"
    },
    impact: {
      package: "₹20 Lakh Crore economic stimulus (10% of India's GDP)",
      vaccination: "2.2 Billion+ indigenous vaccine doses administered via CoWIN",
      foodSecurity: "PM Garib Kalyan Anna Yojana feeding 800M+ citizens freely"
    }
  },
  {
    id: 8,
    year: 2022,
    title: "75 Years of Independence",
    date: "August 15, 2022",
    description: "Azadi Ka Amrit Mahotsav - Vision for 'Viksit Bharat @ 2047' and Panch Pran commitments",
    category: "milestone",
    position: { x: 44, y: 6, z: 12 },
    cameraPosition: { x: 48, y: 15, z: 35 },
    color: "#FCBAD3",
    media: {
      type: "image",
      url: "/media/images/azadi-ka-amrit-mahotsav.svg",
      caption: "Red Fort address - 75th Independence Day and Har Ghar Tiranga"
    },
    achievements: [
      "Har Ghar Tiranga - Over 200 million national flags hoisted across homes",
      "Kartavya Path inauguration & Netaji Subhas Chandra Bose statue",
      "INS Vikrant commissioned - First indigenous aircraft carrier",
      "Panch Pran (Five Pledges) to transform India into a developed nation by 2047"
    ]
  },
  {
    id: 9,
    year: 2023,
    title: "Chandrayaan-3 Moon Landing",
    date: "August 23, 2023",
    description: "India becomes the 4th nation to soft-land on the Moon and 1st at the lunar South Pole",
    category: "milestone",
    position: { x: 56, y: 7, z: 15 },
    cameraPosition: { x: 60, y: 16, z: 38 },
    color: "#A8D8EA",
    media: {
      type: "image",
      url: "/media/images/chandrayaan-3.svg",
      caption: "Shiv Shakti Point - Historic moment in global space exploration"
    },
    achievements: [
      "Declared August 23 as National Space Day",
      "Named landing site 'Shiv Shakti Point'",
      "Remarkable mission budget of $75M (fraction of global counterparts)",
      "Followed immediately by Aditya-L1 solar observation mission"
    ]
  },
  {
    id: 10,
    year: 2023,
    title: "G20 Presidency & Bharat Mandapam",
    date: "September 9-10, 2023",
    description: "Led the G20 New Delhi Leaders' Declaration with 100% consensus and African Union induction",
    category: "diplomacy",
    position: { x: 68, y: 6, z: 12 },
    cameraPosition: { x: 72, y: 14, z: 34 },
    color: "#FFD93D",
    media: {
      type: "image",
      url: "/media/images/g20-summit.svg",
      caption: "Vasudhaiva Kutumbakam: One Earth, One Family, One Future"
    },
    achievements: [
      "Historic inclusion of the 55-nation African Union as a permanent G20 member",
      "India-Middle East-Europe Economic Corridor (IMEC) launch",
      "Global Biofuels Alliance founded",
      "G20 meetings hosted across 60+ Indian cities celebrating democracy"
    ]
  },
  {
    id: 11,
    year: 2024,
    title: "Prime Minister - Third Term",
    date: "June 9, 2024",
    description: "Historic third consecutive term - First Prime Minister since 1962 to win 3 consecutive terms",
    category: "governance",
    position: { x: 80, y: 8, z: 16 },
    cameraPosition: { x: 84, y: 16, z: 38 },
    color: "#6BCB77",
    media: {
      type: "image",
      url: "/media/images/pm-oath-2024.svg",
      caption: "Third term swearing-in at Rashtrapati Bhavan with world leaders"
    },
    achievements: [
      "World's 5th largest economy, rapidly advancing to 3rd position",
      "Massive highway & high-speed Vande Bharat rail modernization",
      "Semiconductor manufacturing hub approvals (Tata, Micron)",
      "Viksit Bharat 2047 comprehensive roadmap implementation"
    ]
  },
  {
    id: 12,
    year: 2024,
    title: "UPI & Digital Public Infrastructure",
    date: "2024",
    description: "India's UPI and digital public infrastructure (India Stack) expands to 50+ partner countries",
    category: "digital",
    position: { x: 92, y: 7, z: 14 },
    cameraPosition: { x: 96, y: 15, z: 36 },
    color: "#4D96FF",
    media: {
      type: "image",
      url: "/media/images/upi-global.svg",
      caption: "Digital India: World's highest real-time payment volume (46% of global transactions)"
    },
    achievements: [
      "13+ Billion monthly transactions processed seamlessly",
      "Accepted in France (Eiffel Tower), UAE, Singapore, Sri Lanka, Mauritius",
      "Empowered street vendors and small businesses nationwide",
      "Recognized by IMF and World Bank as a global digital transformation benchmark"
    ]
  }
];

export const socialMediaPosts = [
  {
    id: 1,
    platform: "X (Twitter)",
    date: "2024-01-26",
    content: "On this Republic Day, let us reaffirm our commitment to building a strong, prosperous and inclusive India. Jai Hind! 🇮🇳",
    likes: "850K+",
    retweets: "125K+",
    image: "/media/images/republic-day.svg"
  },
  {
    id: 2,
    platform: "X (Twitter)",
    date: "2023-08-23",
    content: "India has touched the Moon! Chandrayaan-3's successful landing is a testament to the spirit of New India. Proud of our scientists! 🌙🇮🇳",
    likes: "2.1M+",
    retweets: "380K+",
    image: "/media/images/chandrayaan-3.svg"
  },
  {
    id: 3,
    platform: "Instagram",
    date: "2023-09-10",
    content: "Historic G20 Summit concludes. India's voice for the Global South heard loud and clear. Vasudhaiva Kutumbakam! 🌍",
    likes: "3.2M+",
    comments: "45K+",
    image: "/media/images/g20-summit.svg"
  },
  {
    id: 4,
    platform: "X (Twitter)",
    date: "2024-06-09",
    content: "Grateful for the immense trust reposed in me by 1.4 billion Indians. Committed to serving our nation with 24x7 dedication in this third term. 🙏",
    likes: "1.9M+",
    retweets: "290K+",
    image: "/media/images/pm-oath-2024.svg"
  }
];

export const categoryFilters = [
  { id: "all", label: "All Milestones", color: "#FFFFFF" },
  { id: "life", label: "Early Life", color: "#FF9933" },
  { id: "career", label: "Career & Grassroots", color: "#FF6B6B" },
  { id: "governance", label: "Governance & Terms", color: "#138808" },
  { id: "diplomacy", label: "Global Diplomacy", color: "#FFD93D" },
  { id: "digital", label: "Digital Tech", color: "#00BFFF" },
  { id: "milestone", label: "National Milestones", color: "#FCBAD3" }
];

export default timelineData;
