import React, { useState } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Save, 
  Code2, 
  Check, 
  Copy, 
  Sparkles, 
  CloudRain, 
  Sun, 
  Moon, 
  Sliders, 
  Send, 
  Activity, 
  Eye
} from 'lucide-react';
import { LiveOpsConfig } from '../types';
import { PlaytestSimulator } from './PlaytestSimulator';

interface LiveOpsManagerModuleProps {
  liveOpsConfig: LiveOpsConfig;
  onUpdateLiveOps: (updatedConfig: Partial<LiveOpsConfig>) => Promise<void>;
  isUpdating: boolean;
}

export const LiveOpsManagerModule: React.FC<LiveOpsManagerModuleProps> = ({
  liveOpsConfig,
  onUpdateLiveOps,
  isUpdating
}) => {
  // Local form state
  const [rasoiRecipe, setRasoiRecipe] = useState(liveOpsConfig.rasoi_rush.trending_recipe);
  const [rasoiFestival, setRasoiFestival] = useState(liveOpsConfig.rasoi_rush.festival_event);
  const [rasoiMultiplier, setRasoiMultiplier] = useState(liveOpsConfig.rasoi_rush.multiplier);
  const [rasoiPatience, setRasoiPatience] = useState(liveOpsConfig.rasoi_rush.customer_patience_sec);

  const [cricketStadium, setCricketStadium] = useState(liveOpsConfig.gully_cricket.trending_stadium);
  const [cricketWeather, setCricketWeather] = useState(liveOpsConfig.gully_cricket.weather_override);
  const [cricketSwing, setCricketSwing] = useState(liveOpsConfig.gully_cricket.swing_multiplier);
  const [cricketLights, setCricketLights] = useState(liveOpsConfig.gully_cricket.night_match_lighting);

  const [chaiFestival, setChaiFestival] = useState(liveOpsConfig.chaiwala_tycoon.festival_rush);
  const [chaiPrice, setChaiPrice] = useState(liveOpsConfig.chaiwala_tycoon.cutting_chai_price_inr);

  const [showGodotScript, setShowGodotScript] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [rawApiJson, setRawApiJson] = useState<string>('');

  const stadiums = ['Wankhede Night Match', 'Eden Gardens Monsoon Super-Over', 'Chinnaswamy Sixer Fest', 'Gully Concrete Back-Alley'];
  const weathers = ['Monsoon Rain & Dew', 'Clear Night Floodlights', 'Summer Heatwave (Fast Tarmac)', 'Foggy Winter Morning'];
  const recipes = ['Mango Lassi & Kaju Katli', 'Ganesh Modak Special', 'Pani Puri Speedrun Platter', 'Samosa Chaat & Adrak Chai'];

  const handleSaveConfig = async () => {
    await onUpdateLiveOps({
      rasoi_rush: {
        ...liveOpsConfig.rasoi_rush,
        trending_recipe: rasoiRecipe,
        festival_event: rasoiFestival,
        multiplier: rasoiMultiplier,
        customer_patience_sec: rasoiPatience
      },
      gully_cricket: {
        ...liveOpsConfig.gully_cricket,
        trending_stadium: cricketStadium,
        weather_override: cricketWeather,
        swing_multiplier: cricketSwing,
        night_match_lighting: cricketLights
      },
      chaiwala_tycoon: {
        ...liveOpsConfig.chaiwala_tycoon,
        festival_rush: chaiFestival,
        cutting_chai_price_inr: chaiPrice
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFetchLiveEndpoint = async () => {
    try {
      const res = await fetch('/api/liveops/trends');
      const data = await res.json();
      setRawApiJson(JSON.stringify(data, null, 2));
    } catch (e) {
      setRawApiJson(JSON.stringify(liveOpsConfig, null, 2));
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Concept Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Radio className="w-4 h-4" />
              <span>Module 3: LiveOps Dynamic Content & Remote Config</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              No-Patch Real-Time Game Overrides (Godot HTTPRequest)
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Instead of rebuilding APKs or Godot binaries, connected games poll <code className="text-emerald-300 font-mono">/api/liveops/trends</code>. When you update weather, recipes, or multipliers here, players experience the update instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowGodotScript(!showGodotScript)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>{showGodotScript ? 'Hide Godot GDScript' : 'View LiveOpsManager.gd'}</span>
            </button>

            <button
              onClick={handleSaveConfig}
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Broadcasted to Games!' : 'Push LiveOps Update'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Godot 4 Client Integration Script View */}
      {showGodotScript && (
        <div className="rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">
              games/gully_cricket/scripts/LiveOpsManager.gd (Godot 4.x Client Node)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              @export var trend_url: String = "/api/liveops/trends"
            </span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 bg-slate-950 overflow-x-auto leading-relaxed max-h-72">
{`extends Node

@export var trend_url: String = "https://api.desiarcade.in/api/liveops/trends"

func _ready():
	fetch_trends()

func fetch_trends():
	var http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(_on_request_completed)
	http_request.request(trend_url)

func _on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		if json and json.has("gully_cricket"):
			var cricket_trends = json["gully_cricket"]
			apply_trends(cricket_trends)

func apply_trends(trends: Dictionary):
	print("🔄 Applying LiveOps Update...")
	# Dynamically change the game state without a patch!
	if trends.has("weather_override"):
		WeatherSystem.set_weather(trends["weather_override"])
		
	if trends.has("trending_stadium"):
		StadiumManager.load_map(trends["trending_stadium"])`}
          </pre>
        </div>
      )}

      {/* Main Grid: Live Controls & Playtest Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Remote Config Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Gully Cricket Config */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <span>🏏 Gully Cricket Pro Live Config</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Live</span>
            </h3>

            {/* Stadium Select */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Trending Stadium Map</label>
              <select
                value={cricketStadium}
                onChange={(e) => setCricketStadium(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {stadiums.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Weather Select */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Weather & Lighting Override</label>
              <select
                value={cricketWeather}
                onChange={(e) => setCricketWeather(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {weathers.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Swing Multiplier Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Ball Swing Multiplier</span>
                <span className="text-emerald-400 font-mono">{cricketSwing}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={cricketSwing}
                onChange={(e) => setCricketSwing(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Rasoi Rush Config */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <span>🥘 Rasoi Rush Live Config</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Live</span>
            </h3>

            {/* Recipe Select */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Active Trending Recipe</label>
              <select
                value={rasoiRecipe}
                onChange={(e) => setRasoiRecipe(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {recipes.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Festival Event Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Festival / Seasonal Event Name</label>
              <input
                type="text"
                value={rasoiFestival}
                onChange={(e) => setRasoiFestival(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Multiplier Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Coin Reward Multiplier</span>
                <span className="text-amber-400 font-mono">{rasoiMultiplier}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={rasoiMultiplier}
                onChange={(e) => setRasoiMultiplier(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* JSON Inspector Action */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Endpoint: /api/liveops/trends</span>
            <button
              onClick={handleFetchLiveEndpoint}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect API JSON</span>
            </button>
          </div>

          {rawApiJson && (
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 max-h-48 overflow-y-auto">
              {rawApiJson}
            </pre>
          )}

        </div>

        {/* Right Side: Interactive Playtest Canvas Simulator (7 cols) */}
        <div className="lg:col-span-7">
          <PlaytestSimulator liveOpsConfig={liveOpsConfig} />
        </div>

      </div>
    </div>
  );
};
