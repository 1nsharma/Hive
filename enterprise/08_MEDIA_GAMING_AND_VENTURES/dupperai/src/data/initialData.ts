import { BrandKit, AdaptedCampaign, ChatbotPersona, ScheduledPost, SocialAccount, VoiceOption } from '../types';

export const initialBrandKit: BrandKit = {
  id: 'brand-dukaanmitra',
  name: 'Dukaanmitra (Local Store Ecosystem)',
  logoUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5842823?auto=format&fit=crop&w=120&q=80',
  tagline: 'Empowering local shopkeepers with instant digital inventory & AI sales',
  tokens: {
    primaryColor: '#0F766E', // Teal 700
    secondaryColor: '#3B82F6', // Blue 500
    accentColor: '#F59E0B', // Amber 500
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    borderRadius: '12px',
    spacingUnit: '16px',
  },
  toneOfVoice: ['Empowering', 'Accessible', 'Tech-Forward', 'Trustworthy', 'Actionable'],
  guidelines: 'Use high-contrast visuals showing real local retailers. Highlight time saved, sales increase, and ease of smartphone management.',
  targetAudience: 'Small retail store owners, Kirana merchants, local service providers, digital entrepreneurs',
};

export const sampleCampaigns: AdaptedCampaign[] = [
  {
    id: 'camp-1',
    masterPrompt: 'Launch Dukaanmitra AI POS & Mobile Inventory feature: Shopkeepers can scan items with phone camera and build a online catalog in 60 seconds.',
    campaignTitle: '60-Second Digital Store Setup with AI Scanning',
    targetAudience: 'Retail shop owners, local vendors',
    goal: 'App Downloads & Merchant Onboarding',
    createdAt: '2026-08-10',
    status: 'scheduled',
    brandKitName: 'Dukaanmitra',
    instagram: {
      caption: '🚀 Transform your retail shop into an online marketplace in just 60 seconds! No barcode scanners required — just point your smartphone camera and let Dukaanmitra AI catalog everything automatically. \n\nStop losing customers to big e-commerce. Take control today! 👇\n\nLink in bio to start free trial.',
      hashtags: ['#Dukaanmitra', '#LocalBusiness', '#DigitalStore', '#RetailTech', '#KiranaTech'],
      imagePrompt: 'A proud local grocery shopkeeper holding up a glowing smartphone displaying a clean digital store inventory list with green success checkmarks.',
      aspectRatio: '1:1',
      callToAction: 'Tap link in bio to download Dukaanmitra AI App',
      visualOverlayText: 'SCAN & SELL IN 60 SECONDS 📱✨',
    },
    tiktok: {
      title: 'How local shops compete with e-commerce in 2026',
      scriptHook: 'Wait! If you own a local shop, you are losing 40% of sales if you don\'t have a phone catalog...',
      videoBodyScript: 'Watch me scan 5 items in 10 seconds. Item 1: Biscuit pack. Item 2: Shampoo. The AI auto-fills price, photo, and title instantly! Customers can now order directly via WhatsApp or App.',
      audioSoundtrack: 'Upbeat Energetic Tech Lo-Fi Beats',
      voiceoverText: 'Transform your physical store into a 24/7 online shop. Download Dukaanmitra today.',
      subtitleStyle: 'Bold Yellow Highlight with Dynamic Word Bounce',
      estimatedDurationSec: 28,
      visualCues: [
        'Close-up camera scan on product package',
        'Pop-up AI recognition effect with green outline',
        'Split screen showing WhatsApp order arriving',
      ],
    },
    linkedin: {
      headline: 'The Digital Transformation of 12 Million Small Retailers: Why Camera AI is the New Barcode Scanner',
      body: 'For decades, point-of-sale equipment required heavy hardware investments ($2,000+). Small merchants couldn\'t afford it. Today, computer vision on standard mobile processors is disrupting store management.\n\nAt Dukaanmitra, we\'ve enabled over 45,000 Kirana merchants to build full digital inventories in under 3 minutes.',
      keyTakeaways: [
        'Camera AI reduces barcode setup cost by 98%',
        'Merchant onboarding time drops from 3 days to 60 seconds',
        'Omnichannel WhatsApp sales increase monthly revenue by +34%',
      ],
      carouselSlides: [
        { slideNumber: 1, title: 'Hardware vs. Phone AI', content: 'Traditional POS ($2,500) vs. Mobile Camera AI ($0 upfront)' },
        { slideNumber: 2, title: 'Instant Catalog Setup', content: 'Auto-detect product name, category, and standard retail price' },
        { slideNumber: 3, title: 'WhatsApp Store Sync', content: 'Auto-generate customer payment links in real-time' },
      ],
      callToAction: 'Read the full retail tech report or join our beta program.',
      hashtags: ['#RetailTech', '#DigitalTransformation', '#Fintech', '#SaaS'],
    },
    facebook: {
      mainText: 'Is your local shop losing customers after store hours? 🏪 With Dukaanmitra, your neighborhood customers can browse your items on WhatsApp and order anytime.',
      linkPreviewTitle: 'Download Dukaanmitra AI Store Manager (Free Trial)',
      linkPreviewDescription: 'Turn your smartphone into a smart barcode scanner and online catalog generator in 60 seconds.',
      communityQuestionHook: 'Shopkeepers: How many hours do you spend on manual inventory stock counting every week?',
      bannerConcept: 'Clean split banner with store front on left and sleek mobile app interface on right.',
    },
    headless: {
      title: 'Dukaanmitra AI Catalog Engine',
      summary: 'Automated cataloging system for web and mobile storefronts.',
      heroImagePrompt: 'Futuristic retail mobile store concept illustration in clean emerald teal palette.',
      rawMarkdown: `# Dukaanmitra AI Merchant Engine\n\nExperience single-tap inventory creation powered by computer vision.`,
      reactComponentSnippet: `export function MerchantBanner() {
  return (
    <div className="bg-teal-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
      <div>
        <span className="text-xs uppercase font-bold text-teal-300 tracking-wider">AI Feature Spotlight</span>
        <h3 className="text-2xl font-extrabold mt-1">Scan & Build Catalog</h3>
        <p className="text-teal-200 text-sm mt-1">Turn smartphone camera into instant POS</p>
      </div>
      <button className="bg-amber-400 text-teal-950 px-5 py-2.5 rounded-xl font-bold hover:bg-amber-300">
        Try Live Demo
      </button>
    </div>
  );
}`,
      jsonPayload: {
        campaign_id: 'camp-1',
        feature_slug: 'camera-ai-inventory',
        target_cta_url: 'https://dukaanmitra.ai/download',
        theme_tokens: {
          primary: '#0F766E',
          accent: '#F59E0B',
        },
      },
    },
    abTesting: {
      variantA: {
        label: 'Variant A (Tech & Speed Focused)',
        hook: 'Scan your store in 60 seconds with phone camera AI!',
        score: 88,
        predictedCTR: '4.8%',
        predictedConversion: '12.4%',
      },
      variantB: {
        label: 'Variant B (Revenue & Loss Aversion)',
        hook: 'Stop losing 40% of sales to online competitors today!',
        score: 94,
        predictedCTR: '6.2%',
        predictedConversion: '15.8%',
      },
      recommendedWinner: 'variantB',
      reasoning: 'Variant B leverages loss aversion and direct revenue impact, which resonates 2.1x better with retail business owners based on historical conversion models.',
    },
  },
];

export const samplePersonas: ChatbotPersona[] = [
  {
    id: 'bot-1',
    name: 'Dukaanmitra Sales Assistant',
    platform: 'all',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    tone: 'Helpful, polite, professional, and persuasive local retail advisor',
    systemPrompt: 'You are the official AI representative for Dukaanmitra. Assist merchants asking about pricing, catalog features, WhatsApp store setup, and app setup.',
    triggerKeywords: ['PRICE', 'SETUP', 'DEMO', 'WHATSAPP', 'CATALOG', 'COST'],
    autoReplyDM: true,
    autoReplyComments: true,
    sampleConvos: [
      { role: 'user', text: 'How much does Dukaanmitra cost for small Kirana shops?' },
      { role: 'assistant', text: 'Hello! 👋 Dukaanmitra starts with a 100% Free Trial for 14 days. After that, basic cataloging is just $9/month with unlimited camera scans! Would you like a download link sent to your phone?' },
    ],
  },
  {
    id: 'bot-2',
    name: 'Instagram VIP Concierge',
    platform: 'instagram',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    tone: 'Energetic, modern, casual with emojis',
    systemPrompt: 'Respond instantly to Instagram post comments and DMs asking for product links or trial access.',
    triggerKeywords: ['LINK', 'TRY', 'INFO', 'APP', 'DM ME'],
    autoReplyDM: true,
    autoReplyComments: true,
    sampleConvos: [
      { role: 'user', text: 'Can I get the app link?' },
      { role: 'assistant', text: 'Hey there! 📱✨ Just sent the direct download link to your DMs! Check your inbox!' },
    ],
  },
];

export const sampleAccounts: SocialAccount[] = [
  {
    id: 'acc-ig-1',
    platform: 'instagram',
    accountName: 'Dukaanmitra Official (Public)',
    handle: '@dukaanmitra.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=100&q=80',
    followers: '48.2K',
    type: 'public',
    status: 'connected',
  },
  {
    id: 'acc-li-1',
    platform: 'linkedin',
    accountName: 'Founder Personal Profile',
    handle: 'Amit Sharma (Founder)',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    followers: '18.9K',
    type: 'personal',
    status: 'connected',
  },
  {
    id: 'acc-tk-1',
    platform: 'tiktok',
    accountName: 'Dukaanmitra ShortClips',
    handle: '@dukaanmitra_tech',
    avatarUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=100&q=80',
    followers: '92.4K',
    type: 'public',
    status: 'connected',
  },
  {
    id: 'acc-fb-1',
    platform: 'facebook',
    accountName: 'Dukaanmitra Retailers Community',
    handle: 'fb.com/dukaanmitra',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    followers: '31.5K',
    type: 'public',
    status: 'connected',
  },
];

export const sampleScheduledPosts: ScheduledPost[] = [
  {
    id: 'sched-1',
    campaignTitle: '60-Second Digital Store Setup with AI Scanning',
    platform: 'instagram',
    scheduledTime: 'Today at 6:30 PM',
    status: 'queued',
    accountName: 'Dukaanmitra Official (Public)',
    accountType: 'public',
    postPreview: '🚀 Transform your retail shop into an online marketplace in just 60 seconds! No barcode scanners required...',
  },
  {
    id: 'sched-2',
    campaignTitle: '60-Second Digital Store Setup with AI Scanning',
    platform: 'linkedin',
    scheduledTime: 'Tomorrow at 9:00 AM',
    status: 'queued',
    accountName: 'Founder Personal Profile',
    accountType: 'personal',
    postPreview: 'The Digital Transformation of 12 Million Small Retailers: Why Camera AI is the New Barcode Scanner...',
  },
  {
    id: 'sched-3',
    campaignTitle: '60-Second Digital Store Setup with AI Scanning',
    platform: 'tiktok',
    scheduledTime: 'Tomorrow at 1:15 PM',
    status: 'queued',
    accountName: 'Dukaanmitra ShortClips',
    accountType: 'public',
    postPreview: 'How local shops compete with e-commerce in 2026. Watch camera scan 5 items in 10 seconds!',
  },
];

export const voiceOptions: VoiceOption[] = [
  { id: 'Kore', name: 'Kore', gender: 'Female', accent: 'Warm Professional' },
  { id: 'Puck', name: 'Puck', gender: 'Male', accent: 'Upbeat Tech' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'Female', accent: 'Narrative Corporate' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Male', accent: 'Authoritative Deep' },
  { id: 'Charon', name: 'Charon', gender: 'Male', accent: 'Calm Conversational' },
];
