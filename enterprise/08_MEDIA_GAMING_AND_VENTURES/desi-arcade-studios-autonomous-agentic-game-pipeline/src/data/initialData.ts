import { GamingTrend, GitHubPR, LiveOpsConfig, AgencyCommand, DiscordNotificationMessage, DiscordWebhookConfig } from '../types';

export const INITIAL_TRENDS: GamingTrend[] = [
  {
    id: 'trend-kanche-1',
    source: 'Reddit',
    topic: 'Kanche / Goli Precision Shooter nostalgic surge on r/IndianGaming',
    category: 'Traditional/Heritage',
    sentiment: 'viral_growth',
    engagementScore: 96,
    sampleSnippet: '90s kids nostalgic threads requesting Carrom & 8-Ball Pool style physics shooters for local street Kanche with colorful glass marbles and chalk circle ring outs.',
    suggestedGame: 'kanche',
    suggestedFeature: 'Physics Impulse Aim & Ring Strike mechanics with sound feedback for glass marble collisions.',
    timestamp: '5 mins ago',
    keywords: ['kanche', 'goli', 'marbles', 'nostalgia', 'physics_shooter', 'street_games']
  },
  {
    id: 'trend-gilli-1',
    source: 'Steam India',
    topic: 'Gilli Danda timing arcade sports simulation trending in Asian regional indie spotlight',
    category: 'Traditional/Heritage',
    sentiment: 'high_engagement',
    engagementScore: 93,
    sampleSnippet: 'Timing-based click mechanics to flick the tapered wooden gilli in mid-air followed by a full-power danda strike for maximum distance across the mohalla street.',
    suggestedGame: 'gilli_danda',
    suggestedFeature: 'Dynamic wind shear and sweet-spot precision swing timing with distance leaderboards.',
    timestamp: '15 mins ago',
    keywords: ['gilli_danda', 'arcade_timing', 'street_cricket', 'heritage', 'distance_record']
  },
  {
    id: 'trend-pitthu-1',
    source: 'Discord',
    topic: 'Pitthu / Lagori (7 Stones) 3D Action & Dodgeball gameplay concepts viral in Desi dev servers',
    category: 'Multiplayer',
    sentiment: 'viral_growth',
    engagementScore: 90,
    sampleSnippet: 'Fast-paced dodge mechanics where players knock down 7 flat stones with projectile ball aim, then sprint to rebuild the stack while dodging opponent laser throws.',
    suggestedGame: 'pitthu_lagori',
    suggestedFeature: '7-Stone Physics Tower with dynamic dodge roll cooldowns and teammate revive beacons.',
    timestamp: '30 mins ago',
    keywords: ['pitthu', 'lagori', '7_stones', 'dodgeball', 'action', 'nostalgia']
  },
  {
    id: 'trend-1',
    source: 'Reddit',
    topic: 'Monsoon Chai & Pakora Cozy Craze on r/IndianGaming',
    category: 'Cooking/Cozy',
    sentiment: 'viral_growth',
    engagementScore: 94,
    sampleSnippet: 'Players are sharing screenshots of cozy rainy evening cooking games with lo-fi Bollywood beats and dynamic tea-brewing physics.',
    suggestedGame: 'rasoi_rush',
    suggestedFeature: 'Rainy Day Monsoon Street Stall Event with Adrak Chai & Onion Pakora Combo',
    timestamp: '40 mins ago',
    keywords: ['monsoon', 'pakora', 'chai', 'cozy', 'rain']
  },
  {
    id: 'trend-2',
    source: 'Steam India',
    topic: 'Cricket World Championship Finals Fever & Night Match Surge',
    category: 'Cricket',
    sentiment: 'high_engagement',
    engagementScore: 98,
    sampleSnippet: 'Cricket casual and simulation games experiencing a 340% surge in night-time gameplay during IPL / World Cup knockout weeks.',
    suggestedGame: 'gully_cricket',
    suggestedFeature: 'Wankhede Floodlight Super-Over Mode with Dynamic Ball Dew & Reverse Swing',
    timestamp: '1 hour ago',
    keywords: ['cricket', 'wankhede', 'ipl', 'night_match', 'super_over']
  },
  {
    id: 'trend-3',
    source: 'Google Play',
    topic: 'Ludo King & Teen Patti Real-Time Tournament Pass Monetization',
    category: 'Monetization',
    sentiment: 'monetization_peak',
    engagementScore: 91,
    sampleSnippet: 'Top Indian grossing casual charts show dynamic 24-hour flash passes with localized animated avatars driving 2.8x higher conversions.',
    suggestedGame: 'chaiwala_tycoon',
    suggestedFeature: 'Desi Darbar Daily Battle Pass with dynamic Razorpay festive tier unlocks',
    timestamp: '1.5 hours ago',
    keywords: ['battle_pass', 'monetization', 'iap', 'tournaments']
  },
  {
    id: 'trend-4',
    source: 'App Store',
    topic: 'Ganesh Chaturthi Festive Food Rush: Modak & Sweets Crafting',
    category: 'Regional Culture',
    sentiment: 'high_engagement',
    engagementScore: 89,
    sampleSnippet: 'Festival searches in Mumbai, Pune, and Bangalore spiking for festival-themed seasonal events and temple rush mechanics.',
    suggestedGame: 'rasoi_rush',
    suggestedFeature: 'Ganesh Utsav 10-Day Modak Frenzy with Golden Steamers & Aarti Time Bonus',
    timestamp: '2 hours ago',
    keywords: ['ganesh_chaturthi', 'modak', 'sweets', 'festival', 'bonus']
  },
  {
    id: 'trend-5',
    source: 'Discord',
    topic: 'Mumbai Local & Auto Rickshaw Drifting Physics in Desi Modding Hubs',
    category: 'Mechanics',
    sentiment: 'viral_growth',
    engagementScore: 86,
    sampleSnippet: 'Clips of 3-wheeler auto rickshaw two-wheel drifting around Marine Drive potholes getting 1.2M views on reels.',
    suggestedGame: 'auto_rickshaw_drift',
    suggestedFeature: 'Pothole Slalom & Wet Tarmac Nitro Hydroplane Physics Controller',
    timestamp: '3 hours ago',
    keywords: ['auto_rickshaw', 'drift', 'nitro', 'marine_drive', 'physics']
  },
  {
    id: 'trend-6',
    source: 'Twitter/X',
    topic: 'Pro Kabaddi League Super Raid Timing & Hyper-Tension Mechanics',
    category: 'Multiplayer',
    sentiment: 'positive',
    engagementScore: 83,
    sampleSnippet: 'Discussions around 30-second raid timers, do-or-die clutch buzzer beats, and vocal "Kabaddi-Kabaddi" breath stamina meters.',
    suggestedGame: 'kabaddi_rumble',
    suggestedFeature: 'Do-or-Die Raid Clock with Dynamic Breath Stamina Bar & Ankle Hold Counter',
    timestamp: '4 hours ago',
    keywords: ['kabaddi', 'super_raid', 'stamina', 'clutch', 'pothole']
  }
];

export const INITIAL_LIVEOPS_CONFIG: LiveOpsConfig = {
  kanche: {
    circle_radius_cm: 60,
    glass_rebound_coefficient: 0.88,
    trending_marble_skin: 'Emerald Cat-Eye Glass',
    wind_gust_modifier: 0.15,
    tournament_jackpot_coins: 500,
    special_goli_strike_bonus: true
  },
  gilli_danda: {
    street_wind_speed_kmh: 8.5,
    danda_strike_power_multiplier: 1.5,
    pavement_bounce_damping: 0.72,
    crowd_applaud_cheer_db: 88,
    distance_record_meters: 142.5
  },
  pitthu_lagori: {
    seven_stones_balance_factor: 0.95,
    rubber_ball_throw_velocity: 24.0,
    dodge_roll_agility_buff: 1.35,
    rebuild_timer_sec: 30,
    team_revive_active: true
  },
  rasoi_rush: {
    trending_recipe: 'Mango Lassi & Kaju Katli',
    festival_event: 'Ganesh Chaturthi Sweet Frenzy',
    multiplier: 1.75,
    customer_patience_sec: 28,
    active_buff: 'Monsoon Sizzle +25% Gold',
    special_ingredient: 'Organic Saffron & Cardamom',
    rush_hour_active: true
  },
  gully_cricket: {
    trending_stadium: 'Wankhede Night Match',
    weather_override: 'Monsoon Rain & Dew',
    pitch_condition: 'Damp Green Top',
    swing_multiplier: 1.45,
    crowd_noise_db: 92,
    ipl_fever_boost: true,
    night_match_lighting: true
  },
  chaiwala_tycoon: {
    festival_rush: 'Monsoon Pakora Craze',
    spice_demand_multiplier: 2.1,
    cutting_chai_price_inr: 15,
    monsoon_pakora_combo: true
  },
  auto_rickshaw_drift: {
    road_condition: 'Wet Marine Drive Asphalt',
    traffic_density: 'Peak Dadar Rush',
    nitro_surge_multiplier: 1.8,
    meter_fare_rate: 28.5
  },
  lastUpdated: new Date().toISOString(),
  version: 4
};

export const INITIAL_DISCORD_CONFIG: DiscordWebhookConfig = {
  webhookUrl: 'https://discord.com/api/webhooks/1283948291029384920/desi-arcade-evolution-secret-key',
  serverName: 'Desi Arcade (Official)',
  channelName: '#pr-deployments',
  botUsername: 'Desi Arcade Autonomous Agent',
  enabled: true,
  notifyOnPrCreation: true,
  notifyOnPrMerge: true,
  notifyOnSelfHealing: true
};

export const INITIAL_DISCORD_MESSAGES: DiscordNotificationMessage[] = [
  {
    id: 'disc-msg-1',
    prId: 'pr-102',
    prNumber: 102,
    title: '🎉 PR #102 Merged: feat(kanche): Marble Collision Impulse & Precision Ring-Out System',
    targetGame: 'Kanche (Marbles / Goli)',
    commitSha: '9e7b21a',
    commitMsg: 'feat(kanche): add 2D physics impulse trajectory and glass marble sound resonance',
    prUrl: 'https://github.com/desi-arcade-studios/core-games/pull/102',
    author: 'desi-arcade-research-agent[bot]',
    timestamp: '2 hours ago',
    delivered: true,
    channelName: '#pr-deployments',
    serverName: 'Desi Arcade (Official)',
    embed: {
      title: '🎉 Feature Merged: feat(kanche): Marble Collision Impulse & Precision Ring-Out System',
      description: 'The autonomous pipeline has verified GUT tests and successfully merged a new AI-synthesized mechanic into `main` branch.',
      url: 'https://github.com/desi-arcade-studios/core-games/pull/102',
      color: 16750848,
      fields: [
        { name: '🎮 Target Game', value: '`Kanche (Marbles / Goli)`', inline: true },
        { name: '🔀 Branch', value: '`ai-evolution-1725164200`', inline: true },
        { name: '🤖 Author', value: 'desi-arcade-research-agent[bot]', inline: true },
        { name: '📝 Commit Details', value: '`feat(kanche): add 2D physics impulse trajectory and glass marble sound resonance`', inline: false },
        { name: '📁 GDScript File', value: '`games/kanche/scripts/MarblePhysicsController.gd`', inline: true },
        { name: '🧪 GUT Test Status', value: '🟢 4/4 Passed (100% Green)', inline: true },
        { name: '🌐 LiveOps Remote Sync', value: 'Deployed to `/api/liveops/trends` (Version 4)', inline: false }
      ],
      footer: {
        text: 'Desi Arcade Studios • Autonomous Evolution Pipeline v4.8'
      },
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  }
];

export const INITIAL_DISCORD_NOTIFICATIONS = INITIAL_DISCORD_MESSAGES;



export const INITIAL_PRS: GitHubPR[] = [
  {
    id: 'pr-104',
    number: 104,
    title: '🤖 Auto-Research: feat(rasoi): Mango Lassi & Festive Modak dynamic cooking loop',
    branch: 'ai-evolution-1725184920',
    baseBranch: 'main',
    status: 'open',
    author: 'desi-arcade-research-agent[bot]',
    createdAt: '45 minutes ago',
    commitMsg: 'feat(rasoi): AI-generated Ganesh festival sweet mechanics & Mango Lassi multiplier',
    filePath: 'games/rasoi_rush/scripts/TrendFeature.gd',
    newCode: `extends Node
class_name RasoiTrendFeature

# Auto-generated by Desi Arcade Research Agent (Qwen/Gemini Synthesizer)
# Trend Target: Ganesh Chaturthi Sweet Frenzy + Mango Lassi High Demand

@export var base_recipe_multiplier: float = 1.75
@export var active_festival: String = "Ganesh Chaturthi Sweets"
@export var modak_steamer_capacity: int = 6

signal festival_order_completed(recipe_name: String, coins_earned: int)
signal modak_rush_triggered(duration_sec: float)

var _is_rush_active: bool = false
var _liveops_url: String = "/api/liveops/trends"

func _ready() -> void:
	print("🥘 [RasoiRush] Initializing Trend Feature: ", active_festival)
	sync_liveops_remote_config()

func sync_liveops_remote_config() -> void:
	var http := HTTPRequest.new()
	add_child(http)
	http.request_completed.connect(_on_remote_config_received)
	http.request(_liveops_url)

func _on_remote_config_received(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	if response_code == 200:
		var json_str := body.get_string_from_utf8()
		var parsed = JSON.parse_string(json_str)
		if parsed and parsed.has("rasoi_rush"):
			var config: Dictionary = parsed["rasoi_rush"]
			base_recipe_multiplier = config.get("multiplier", 1.5)
			active_festival = config.get("festival_event", active_festival)
			print("✅ [RasoiRush] LiveOps Synced! Multiplier is now: ", base_recipe_multiplier)

func cook_festival_dish(recipe_name: String, base_price: int) -> int:
	var final_reward: int = int(float(base_price) * base_recipe_multiplier)
	if recipe_name == "Modak" or recipe_name == "Mango Lassi":
		final_reward += 50 # Festive celebration bonus tip
		emit_signal("festival_order_completed", recipe_name, final_reward)
	return final_reward
`,
    baseCode: `extends Node
class_name RasoiTrendFeature

# Base version before trend evolution
@export var base_recipe_multiplier: float = 1.0
@export var active_festival: String = "Standard Kitchen"

func cook_festival_dish(recipe_name: String, base_price: int) -> int:
	return base_price
`,
    summary: 'Auto-synthesized GDScript node that integrates LiveOps remote config for Ganesh Chaturthi festive dishes, adds the Mango Lassi speed multiplier, and connects festival order completion signals.',
    testResults: {
      passed: true,
      total: 4,
      passedCount: 4,
      failedCount: 0,
      logs: [
        'Running GUT (Godot Unit Tests) v4.2...',
        'PASS: test_initialization() - Node initialized with festival config',
        'PASS: test_liveops_sync_fallback() - Graceful fallback when remote config unavailable',
        'PASS: test_multiplier_calculation() - Multiplier 1.75x calculated accurately',
        'PASS: test_signal_emission() - festival_order_completed emitted with correct payload',
        'Result: 4 Passed, 0 Failed, 0 Skipped in 0.28s'
      ]
    },
    comments: [
      {
        id: 'c-1',
        author: 'desi-arcade-research-agent[bot]',
        avatar: '🤖',
        role: 'bot',
        message: 'This feature was auto-generated based on Reddit & Play Store top trends for Indian festival sweets. GUT test suite generated and verified 100% green.',
        timestamp: '45 mins ago'
      },
      {
        id: 'c-2',
        author: 'Vikram Mehta',
        avatar: '👨‍💻',
        role: 'lead_dev',
        message: 'LGTM! Clean signal definitions and proper fallback handling on HTTPRequest.',
        timestamp: '30 mins ago'
      }
    ],
    healingHistory: []
  },
  {
    id: 'pr-103',
    number: 103,
    title: '🤖 Auto-Research: feat(cricket): Monsoon Rain Dynamic Swing & Stadium Overrides',
    branch: 'ai-evolution-1725178400',
    baseBranch: 'main',
    status: 'open',
    author: 'desi-arcade-research-agent[bot]',
    createdAt: '2 hours ago',
    commitMsg: 'feat(cricket): dynamic pitch dew, cloud cover shaders, and reverse swing mechanics',
    filePath: 'games/gully_cricket/scripts/LiveOpsManager.gd',
    newCode: `extends Node
class_name GullyCricketLiveOpsManager

# Target: Monsoon Cricket Craze & Wankhede Night Floodlight Mode
@export var trend_url: String = "/api/liveops/trends"
@export var default_swing: float = 1.0

var current_weather: String = "Sunny"
var current_stadium: String = "Gully Street"
var is_dew_active: bool = false

func _ready() -> void:
	print("🏏 [GullyCricket] Initializing LiveOps Manager...")
	fetch_trends()

func fetch_trends() -> void:
	var http_request := HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(_on_request_completed)
	http_request.request(trend_url)

func _on_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	if response_code == 200:
		var json_str := body.get_string_from_utf8()
		var json = JSON.parse_string(json_str)
		if json and json.has("gully_cricket"):
			var cricket_trends: Dictionary = json["gully_cricket"]
			apply_trends(cricket_trends)

func apply_trends(trends: Dictionary) -> void:
	print("🔄 [GullyCricket] Applying LiveOps Overrides without patch...")
	if trends.has("weather_override"):
		current_weather = str(trends["weather_override"])
		# Configure wet ball physics and cloud density
		if current_weather.contains("Rain") or current_weather.contains("Monsoon"):
			is_dew_active = true
			default_swing = trends.get("swing_multiplier", 1.4)
			print("🌧️ Monsoon weather applied! Swing boosted to: ", default_swing)
	
	if trends.has("trending_stadium"):
		current_stadium = str(trends["trending_stadium"])
		print("🏟️ Active Stadium loaded: ", current_stadium)
`,
    baseCode: `extends Node
class_name GullyCricketLiveOpsManager

@export var trend_url: String = "/api/liveops/trends"

func _ready() -> void:
	pass
`,
    summary: 'Instantly applies monsoon rain, wet-ball swing physics, and stadium floodlight overrides directly from the `/api/liveops/trends` endpoint without requiring a client update.',
    testResults: {
      passed: true,
      total: 3,
      passedCount: 3,
      failedCount: 0,
      logs: [
        'Running GUT (Godot Unit Tests) v4.2...',
        'PASS: test_weather_override_parsing() - Parsed "Monsoon Rain" and set dew flag',
        'PASS: test_stadium_loader() - Correct stadium string updated',
        'PASS: test_swing_multiplier() - Swing physics modifier applied cleanly',
        'Result: 3 Passed, 0 Failed in 0.21s'
      ]
    },
    comments: [
      {
        id: 'c-3',
        author: 'desi-arcade-research-agent[bot]',
        avatar: '🤖',
        role: 'bot',
        message: 'Auto-synthesized from Steam India trending searches on nighttime floodlight stadium matches.',
        timestamp: '2 hours ago'
      }
    ],
    healingHistory: []
  }
];

export const AGENCY_COMMANDS: AgencyCommand[] = [
  {
    id: 'cmd-lambda',
    commandName: 'Deploy Trend Radar to AWS Lambda / Serverless Worker',
    category: 'Infrastructure',
    description: 'Packages the Python Beautiful Soup & Reddit/Steam scraper into an event-driven AWS Lambda function with CloudWatch 12-hour cron triggers.',
    status: 'idle',
    outputLogs: [
      'Packaging scraper dependencies (bs4, requests, schedule, boto3)...',
      'Generating serverless.yml & Dockerfile for containerized Lambda execution...',
      'Setting up CloudWatch Event Rule: cron(0 */12 * * ? *)...',
      'Target endpoint: S3 /research/trend_data.json -> Synced with Desi Arcade Hub API.'
    ],
    artifacts: [
      {
        filename: 'serverless_scraper_lambda.py',
        language: 'python',
        content: `import json
import boto3
import urllib.request
from bs4 import BeautifulSoup

s3 = boto3.client('s3')
BUCKET_NAME = 'desi-arcade-research-pipeline'

def lambda_handler(event, context):
    print("🛰️ [AWS Lambda] Executing Desi Arcade 12-Hour Trend Radar...")
    trends = []
    
    # Scrape Reddit r/IndianGaming
    req = urllib.request.Request(
        "https://old.reddit.com/r/IndianGaming/top/?t=week",
        headers={'User-Agent': 'DesiArcadeServerlessBot/2.0'}
    )
    with urllib.request.urlopen(req) as response:
        html = response.read()
        soup = BeautifulSoup(html, 'html.parser')
        for thing in soup.find_all('div', class_='thing')[:15]:
            title_elem = thing.find('a', class_='title')
            if title_elem:
                title = title_elem.text
                trends.append({
                    "source": "Reddit",
                    "topic": title,
                    "sentiment": "high_engagement",
                    "timestamp": "auto-scraped"
                })

    # Save directly to S3 Bucket
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key='research/trend_data.json',
        Body=json.dumps(trends, indent=2),
        ContentType='application/json'
    )
    return {"statusCode": 200, "body": f"Successfully scraped {len(trends)} trends."}
`
      }
    ]
  },
  {
    id: 'cmd-styleguide',
    commandName: 'Train AI on Desi Arcade Godot 4 Style Guide & GDScript AST Rules',
    category: 'AI Training',
    description: 'Injects strict studio coding standards into the agent prompt (static typing `@export var`, typed signals, memory safe nodes, frame-independent `_physics_process`).',
    status: 'idle',
    outputLogs: [
      'Compiling Desi Arcade Godot 4.3 GDScript Architectural Manifesto...',
      'Enforcing strict static typing: no untyped variants allowed in generated classes.',
      'Configuring AST linting rules: signals must use past-tense (`order_completed`), nodes must free properly with `queue_free()`.',
      'Prompt embedding updated for Gemini Synthesizer.'
    ],
    artifacts: [
      {
        filename: 'godot_style_guide.md',
        language: 'markdown',
        content: `# Desi Arcade Studios - Godot 4.x Coding Standards

1. **Class Names & Typing**: Every script MUST define \`class_name\` in PascalCase. All variables must have explicit static types (e.g., \`var speed: float = 250.0\`).
2. **Signals**: Must be snake_case with past-tense action (e.g., \`signal samosa_fried(quality_score: int)\`).
3. **LiveOps Contract**: All remote config listeners MUST gracefully handle network timeouts without crashing the game loop.
4. **Localization**: Dynamic strings must query \`TranslationServer.translate()\` with Hindi/Tamil/Bengali/Telugu localization keys.
`
      }
    ]
  },
  {
    id: 'cmd-razorpay',
    commandName: 'Connect Razorpay Dynamic Pricing Engine for Festive Flash Sales',
    category: 'Monetization',
    description: 'Integrates Razorpay UPI payment webhooks with the LiveOps remote config to trigger surge and discount pricing dynamically during festival hours.',
    status: 'idle',
    outputLogs: [
      'Initializing Razorpay SDK route handlers (/api/payments/razorpay)...',
      'Configuring dynamic price surge matrix based on LiveOps festival multiplier...',
      'Setting up Instant UPI Auto-Refund & GPay/PhonePe deep links in Godot web builds.',
      'Webhooks registered for dynamic coin pass provisioning.'
    ],
    artifacts: [
      {
        filename: 'RazorpayLiveOpsBridge.js',
        language: 'javascript',
        content: `const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_desiarcade',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

async function createDynamicFestiveOrder(gameId, festivalMultiplier) {
  // Base 100 Gems pack normally INR 49 -> Adjusted dynamically for festival sale
  const basePriceINR = 49;
  const discountedPriceINR = Math.max(19, Math.round(basePriceINR / festivalMultiplier));
  
  const options = {
    amount: discountedPriceINR * 100, // paise
    currency: "INR",
    receipt: \`rcpt_\${gameId}_\${Date.now()}\`,
    notes: {
      game: gameId,
      festival_event: "Ganesh_Chaturthi_Sale",
      discount_applied: \`\${Math.round((1 - discountedPriceINR/basePriceINR)*100)}%\`
    }
  };
  
  return await razorpay.orders.create(options);
}

module.exports = { createDynamicFestiveOrder };
`
      }
    ]
  },
  {
    id: 'cmd-ipl',
    commandName: 'Trigger IPL 2026 Live Match Dynamic Stadium & Jersey Injection',
    category: 'LiveOps',
    description: 'Injects real-time stadium mood, live broadcast commentary lines, and team jersey colors into Gully Cricket and Stadium mode based on ongoing cricket matches.',
    status: 'idle',
    outputLogs: [
      'Connecting Cricbuzz / ESPN Cricinfo Live Data Stream...',
      'Detected Ongoing Match: Mumbai Indians vs Chennai Super Kings (Wankhede Stadium)...',
      'Updating LiveOps config: Weather -> "Clear Night", Lighting -> "Wankhede Floodlight Super-Over", Crowd -> 98dB.',
      'Broadcasting payload to all connected Godot game instances.'
    ]
  },
  {
    id: 'cmd-discord-broadcast',
    commandName: 'Broadcast AI Feature Merge Summary to Discord #ai-pr-merges',
    category: 'Community & Discord',
    description: 'Dispatches rich embed notifications with PR links, commit SHAs, and LiveOps telemetry to the "Desi Arcade" Discord guild.',
    status: 'idle',
    outputLogs: [
      'Querying latest merged PRs from GitHub master branch...',
      'Formatting Discord Webhook payload with embed color #F59E0B and Godot GUT telemetry...',
      'POST /api/webhooks/desi-arcade/ai-pr-merges -> 204 No Content (Delivered).',
      'Notification dispatched to 14,200 server members in #ai-pr-merges.'
    ],
    artifacts: [
      {
        filename: 'discord_webhook_payload.json',
        language: 'json',
        content: JSON.stringify({
          username: "Desi Arcade Autonomous Bot",
          avatar_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150",
          embeds: [
            {
              title: "🚀 [FEATURE MERGED] Rasoi Rush: Mango Lassi & Modak Festival Loop",
              url: "https://github.com/desi-arcade-studios/desi-arcade-master/pull/104",
              color: 16096779,
              description: "The autonomous research agent synthesized and merged new GDScript mechanics based on live Reddit & Steam India trends.",
              fields: [
                { name: "PR Link", value: "[PR #104](https://github.com/desi-arcade-studios/desi-arcade-master/pull/104)", inline: true },
                { name: "Commit SHA", value: "`sha-4a9f2c8`", inline: true },
                { name: "Target Game", value: "🥘 Rasoi Rush (Godot 4.3)", inline: true },
                { name: "GUT Unit Tests", value: "✅ 4/4 Passed (0.28s)", inline: true },
                { name: "LiveOps Remote Config", value: "🟢 Synced to `/api/liveops/trends`", inline: true },
                { name: "Commit Message", value: "feat(rasoi): AI-generated Ganesh festival sweet mechanics & Mango Lassi multiplier", inline: false }
              ],
              footer: { text: "Desi Arcade Studios • Autonomous CI/CD Pipeline" },
              timestamp: new Date().toISOString()
            }
          ]
        }, null, 2)
      }
    ]
  }
];

export const HERITAGE_GAMES_CATALOG = [
  {
    id: 'kanche',
    name: 'Kanche / Goli Shootout',
    nativeName: 'कंचे / गोटी',
    state: 'Delhi, UP, Rajasthan, Punjab',
    region: 'North',
    demographic: 'Kids & Teens',
    genre: '2D Physics Marble Shooter',
    icon: '🔮',
    mechanicSummary: 'Chalk circle boundaries, marble impulse vectors, glass clink audio synthesis, ring-out bounty scoring.',
    culturalLore: 'Played on dusty neighborhood lanes where players use their middle finger to propel glass marbles into opponent rings.',
    suggestedGodotNode: 'RigidBody2D + PhysicsMaterial (Friction 0.15, Bounce 0.85)',
    trendingScore: 96
  },
  {
    id: 'gilli_danda',
    name: 'Gilli Danda Street Ace',
    nativeName: 'गिल्ली डंडा',
    state: 'Punjab, Haryana, Bihar, UP',
    region: 'North',
    demographic: 'Teens & Young Adults',
    genre: 'Arcade Timing & Long-Distance Strike',
    icon: '🪵',
    mechanicSummary: 'Two-stage hit mechanic: tap to flip gilli into air, frame-perfect power swing for maximum alley distance.',
    culturalLore: 'Ancient Indian street game that laid the historical roots for modern cricket and baseball batting instincts.',
    suggestedGodotNode: 'Area2D sweetspot trigger + Vector2 trajectory arc calculator',
    trendingScore: 93
  },
  {
    id: 'pallanguzhi',
    name: 'Pallanguzhi / Ali Guli Mane',
    nativeName: 'பல்லாங்குழி / ಅಳಿ ಗುಳಿ ಮನೆ',
    state: 'Tamil Nadu, Karnataka, Kerala, AP',
    region: 'South',
    demographic: 'Ladies / Family',
    genre: 'Strategic Mancala Pit Math',
    icon: '🐚',
    mechanicSummary: '14 wooden cups, cowrie shells / tamarind seeds distribution, capture empty cup cascades, speed memory math.',
    culturalLore: 'A centuries-old board game popular among women and families to sharpen quick mental arithmetic and strategic sharing.',
    suggestedGodotNode: 'Node2D Array manager + seed count state machine',
    trendingScore: 91
  },
  {
    id: 'pitthu_lagori',
    name: 'Pitthu / Lagori (7 Stones)',
    nativeName: 'पिट्ठू / सात पत्थर',
    state: 'Rajasthan, MP, Haryana, Maharashtra',
    region: 'North',
    demographic: 'Kids & Teens',
    genre: 'Action Dodgeball & Tower Rebuild',
    icon: '🧱',
    mechanicSummary: 'Knock down stone stack with tennis ball, race to rebuild while dodging seeker throws, agility duck-and-roll.',
    culturalLore: 'The quintessential street sport played in every school compound and residential colony across India.',
    suggestedGodotNode: 'Stack RigidBody2D tower + rubber ball raycast projectile',
    trendingScore: 89
  },
  {
    id: 'rasoi_rush',
    name: 'Rasoi Rush (Indian Cooking Sim)',
    nativeName: 'रसोई रश',
    state: 'Maharashtra, Gujarat, Delhi, Bengal',
    region: 'West & Central',
    demographic: 'Ladies / Family',
    genre: 'Time-Management Culinary Sim',
    icon: '🥘',
    mechanicSummary: 'Multi-burner tawa management, spice blending (garam masala, tadka), customer patience timers, festive sweet platters.',
    culturalLore: 'Brings authentic home-style Indian kitchen chaos to life, from crispy dosas and adrak chai to Diwali sweets.',
    suggestedGodotNode: 'Timer + Queue order manager + Recipe multiplier nodes',
    trendingScore: 95
  },
  {
    id: 'gully_cricket',
    name: 'Gully Cricket Pro',
    nativeName: 'गली क्रिकेट',
    state: 'Pan-India (Maharashtra, Bengal, Karnataka)',
    region: 'North',
    demographic: 'Teens & Young Adults',
    genre: 'Sports / Casual Timing',
    icon: '🏏',
    mechanicSummary: 'One-tip one-hand catch rules, electric wire roof hazards, dynamic ball dew, floodlight night super-overs.',
    culturalLore: 'India’s heartbeat: street cricket where tennis balls are wrapped in electrical tape for lethal reverse swing.',
    suggestedGodotNode: 'CharacterBody2D batsman + BallPhysics3D projection',
    trendingScore: 98
  },
  {
    id: 'kabaddi_rumble',
    name: 'Kabaddi Rumble Pro',
    nativeName: 'कबड्डी',
    state: 'Punjab, Haryana, Tamil Nadu, Maharashtra',
    region: 'North',
    demographic: 'Teens & Young Adults',
    genre: 'High-Stakes Raid & Tackle Duel',
    icon: '🤼',
    mechanicSummary: '30-second raid clock, "Kabaddi-Kabaddi" breath stamina bar, ankle hold counter timing, bonus line toe touch.',
    culturalLore: 'India’s indigenous combat sport rooted in ancient warrior strategy and lung endurance.',
    suggestedGodotNode: 'Kinematic raider + 7-defender AI chain behavior tree',
    trendingScore: 88
  },
  {
    id: 'patangbaazi',
    name: 'Patangbaazi (Kite Duel 3D)',
    nativeName: 'पतंगबाज़ी',
    state: 'Gujarat, Delhi, UP, Punjab',
    region: 'West & Central',
    demographic: 'Kids, Teens & Young Adults',
    genre: 'Physics Kite Flying & Line Cutting',
    icon: '🪁',
    mechanicSummary: 'Wind thermals, manjha line friction tension, "Dheel" release vs "Khinch" pull mechanics, rooftop crowd shouts.',
    culturalLore: 'Celebrated during Makar Sankranti and Independence Day with colorful kites dotting the skyline.',
    suggestedGodotNode: 'SpringBone wind node + Line2D manjha cord simulator',
    trendingScore: 87
  }
];

