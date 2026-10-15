export type HeritageGameId = 
  | 'kanche'
  | 'gilli_danda'
  | 'pitthu_lagori'
  | 'rasoi_rush'
  | 'gully_cricket'
  | 'chaiwala_tycoon'
  | 'kabaddi_rumble'
  | 'auto_rickshaw_drift';

export interface GamingTrend {
  id: string;
  source: 'Reddit' | 'Steam India' | 'Google Play' | 'App Store' | 'Discord' | 'Twitter/X';
  topic: string;
  category: 'Cricket' | 'Cooking/Cozy' | 'Regional Culture' | 'Monetization' | 'Mechanics' | 'Multiplayer' | 'Traditional/Heritage';
  sentiment: 'high_engagement' | 'viral_growth' | 'positive' | 'monetization_peak';
  engagementScore: number; // 1-100
  sampleSnippet: string;
  suggestedGame: HeritageGameId;
  suggestedFeature: string;
  timestamp: string;
  keywords: string[];
}

export interface GDScriptFeature {
  id: string;
  gameId: string;
  gameName: string;
  featureTitle: string;
  description: string;
  targetTrendTopic: string;
  filePath: string;
  code: string;
  commitMsg: string;
  branchName: string;
  createdAt: string;
  tests: GUTTest[];
}

export interface GUTTest {
  testName: string;
  description: string;
  passed: boolean;
  executionTimeMs: number;
  errorMessage?: string;
  codeSnippet: string;
}

export interface GitHubPR {
  id: string;
  number: number;
  title: string;
  branch: string;
  baseBranch: string;
  status: 'open' | 'merged' | 'closed' | 'healing';
  author: string;
  createdAt: string;
  commitMsg: string;
  filePath: string;
  newCode: string;
  baseCode: string;
  summary: string;
  testResults: {
    passed: boolean;
    total: number;
    passedCount: number;
    failedCount: number;
    logs: string[];
  };
  comments: PRComment[];
  healingHistory: HealingStep[];
  discordNotificationSent?: boolean;
  discordNotificationTimestamp?: string;
  commitSha?: string;
}

export interface PRComment {
  id: string;
  author: string;
  avatar: string;
  role: 'bot' | 'lead_dev' | 'qa_engineer';
  message: string;
  timestamp: string;
}

export interface HealingStep {
  step: string;
  status: 'pending' | 'running' | 'fixed' | 'failed';
  details: string;
  timestamp: string;
  fixCommitSha?: string;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description: string;
  url?: string;
  color: number;
  fields: DiscordEmbedField[];
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  thumbnail?: {
    url: string;
  };
  timestamp?: string;
}

export interface DiscordNotificationMessage {
  id: string;
  prId: string;
  prNumber: number;
  title: string;
  targetGame: string;
  commitSha: string;
  commitMsg: string;
  prUrl: string;
  author: string;
  timestamp: string;
  delivered: boolean;
  channelName: string;
  serverName: string;
  embed: DiscordEmbed;
}

export interface DiscordWebhookConfig {
  webhookUrl: string;
  serverName: string;
  channelName: string;
  botUsername: string;
  enabled: boolean;
  notifyOnPrCreation: boolean;
  notifyOnPrMerge: boolean;
  notifyOnSelfHealing: boolean;
}

export interface LiveOpsConfig {
  kanche: {
    circle_radius_cm: number;
    glass_rebound_coefficient: number;
    trending_marble_skin: string;
    wind_gust_modifier: number;
    tournament_jackpot_coins: number;
    special_goli_strike_bonus: boolean;
  };
  gilli_danda: {
    street_wind_speed_kmh: number;
    danda_strike_power_multiplier: number;
    pavement_bounce_damping: number;
    crowd_applaud_cheer_db: number;
    distance_record_meters: number;
  };
  pitthu_lagori: {
    seven_stones_balance_factor: number;
    rubber_ball_throw_velocity: number;
    dodge_roll_agility_buff: number;
    rebuild_timer_sec: number;
    team_revive_active: boolean;
  };
  rasoi_rush: {
    trending_recipe: string;
    festival_event: string;
    multiplier: number;
    customer_patience_sec: number;
    active_buff: string;
    special_ingredient: string;
    rush_hour_active: boolean;
  };
  gully_cricket: {
    trending_stadium: string;
    weather_override: string;
    pitch_condition: string;
    swing_multiplier: number;
    crowd_noise_db: number;
    ipl_fever_boost: boolean;
    night_match_lighting: boolean;
  };
  chaiwala_tycoon: {
    festival_rush: string;
    spice_demand_multiplier: number;
    cutting_chai_price_inr: number;
    monsoon_pakora_combo: boolean;
  };
  auto_rickshaw_drift: {
    road_condition: string;
    traffic_density: string;
    nitro_surge_multiplier: number;
    meter_fare_rate: number;
  };
  lastUpdated: string;
  version: number;
}

export interface ScraperDaemonState {
  isRunning: boolean;
  intervalHours: number;
  lastScraped: string;
  nextScheduledScrape: string;
  totalTrendsCollected: number;
  activeSources: string[];
  logs: ScraperLog[];
}

export interface ScraperLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface DiscordConfig {
  webhookUrl: string;
  serverName: string;
  activeChannel: string;
  botUsername: string;
  botAvatarUrl: string;
  autoNotifyOnMerge: boolean;
  autoNotifyOnSynthesis: boolean;
  autoNotifyOnLiveOps: boolean;
  mentionRoles: string[];
  isConnected: boolean;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description: string;
  url?: string;
  color: number;
  fields: DiscordEmbedField[];
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

export interface DiscordNotification {
  id: string;
  timestamp: string;
  event: 'pr_merged' | 'pr_synthesized' | 'liveops_broadcast' | 'test_ping';
  channel: string;
  prId?: string;
  prNumber?: number;
  prTitle?: string;
  commitMsg?: string;
  commitSha?: string;
  author: string;
  targetGame: string;
  prUrl: string;
  embed: DiscordEmbed;
  deliveryStatus: 'delivered' | 'simulated' | 'failed';
  reactions?: { emoji: string; count: number }[];
}

export interface AgencyCommand {
  id: string;
  commandName: string;
  category: 'Infrastructure' | 'AI Training' | 'Monetization' | 'LiveOps' | 'Testing' | 'Community & Discord';
  description: string;
  status: 'idle' | 'executing' | 'completed' | 'failed';
  outputLogs: string[];
  artifacts?: {
    filename: string;
    content: string;
    language: string;
  }[];
}

export interface HeritageGame {
  id: string;
  name: string;
  nativeName: string;
  state: string;
  region: 'North' | 'South' | 'East & Northeast' | 'West & Central';
  demographic: 'Kids' | 'Ladies / Family' | 'Teens & Young Adults';
  genre: string;
  icon: string;
  mechanicSummary: string;
  culturalLore: string;
  suggestedGodotNode: string;
  trendingScore: number;
}




