export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'facebook' | 'headless';

export interface DesignTokens {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  spacingUnit: string;
}

export interface BrandKit {
  id: string;
  name: string;
  logoUrl: string;
  tagline: string;
  tokens: DesignTokens;
  toneOfVoice: string[];
  guidelines: string;
  targetAudience: string;
}

export interface InstagramPost {
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  aspectRatio: '1:1' | '9:16';
  callToAction: string;
  visualOverlayText: string;
}

export interface TikTokPost {
  title: string;
  scriptHook: string;
  videoBodyScript: string;
  audioSoundtrack: string;
  voiceoverText: string;
  subtitleStyle: string;
  estimatedDurationSec: number;
  visualCues: string[];
}

export interface LinkedInCarouselSlide {
  slideNumber: number;
  title: string;
  content: string;
}

export interface LinkedInPost {
  headline: string;
  body: string;
  keyTakeaways: string[];
  carouselSlides: LinkedInCarouselSlide[];
  callToAction: string;
  hashtags: string[];
}

export interface FacebookPost {
  mainText: string;
  linkPreviewTitle: string;
  linkPreviewDescription: string;
  communityQuestionHook: string;
  bannerConcept: string;
}

export interface HeadlessContent {
  title: string;
  summary: string;
  heroImagePrompt: string;
  rawMarkdown: string;
  reactComponentSnippet: string;
  jsonPayload: Record<string, unknown>;
}

export interface ABVariant {
  label: string;
  hook: string;
  score: number; // 0-100
  predictedCTR: string;
  predictedConversion: string;
}

export interface ABTestingData {
  variantA: ABVariant;
  variantB: ABVariant;
  recommendedWinner: 'variantA' | 'variantB';
  reasoning: string;
}

export interface AdaptedCampaign {
  id: string;
  masterPrompt: string;
  campaignTitle: string;
  targetAudience: string;
  goal: string;
  createdAt: string;
  status: 'draft' | 'scheduled' | 'published';
  brandKitName: string;
  instagram: InstagramPost;
  tiktok: TikTokPost;
  linkedin: LinkedInPost;
  facebook: FacebookPost;
  headless: HeadlessContent;
  abTesting: ABTestingData;
}

export interface ChatbotPersona {
  id: string;
  name: string;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'all';
  avatarUrl: string;
  tone: string;
  systemPrompt: string;
  triggerKeywords: string[];
  autoReplyDM: boolean;
  autoReplyComments: boolean;
  sampleConvos: { role: 'user' | 'assistant'; text: string }[];
}

export interface ScheduledPost {
  id: string;
  campaignTitle: string;
  platform: Platform;
  scheduledTime: string;
  status: 'queued' | 'publishing' | 'published' | 'failed';
  accountName: string;
  accountType: 'personal' | 'public';
  postPreview: string;
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  handle: string;
  accountName: string;
  avatarUrl: string;
  followers: string;
  type: 'personal' | 'public';
  status: 'connected' | 'reauth_required';
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  accent: string;
  previewAudioUrl?: string;
}
