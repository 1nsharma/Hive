import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Moon, Flame, ShieldCheck, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { generateDailyTelemetry, calculateTelemetrySummary, ActivityDataPoint } from '../lib/healthTelemetry';

interface PetHealthAnalyticsProps {
  petName?: string;
  breed?: string;
}

export const PetHealthAnalytics: React.FC<PetHealthAnalyticsProps> = ({
  petName = 'Bruno',
  breed = 'Golden Retriever'
}) => {
  const [data] = useState<ActivityDataPoint[]>(() => generateDailyTelemetry());
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const summary = calculateTelemetrySummary(data);

  // Render activity curve on Canvas (D3 / Chart.js pattern)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let y = 30; y < height - 20; y += 35) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Draw Bar Chart for Walk/Play/Sprint
    const barWidth = 18;
    const step = (width - 70) / data.length;

    data.forEach((p, i) => {
      const x = 50 + i * step;

      // Draw Rest (light stone)
      const restH = (p.restMinutes / 180) * 45;
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(x, height - 30 - restH, barWidth, restH);

      // Draw Walk (brand green)
      const walkH = (p.walkMinutes / 60) * 40;
      ctx.fillStyle = '#10B981';
      ctx.fillRect(x, height - 30 - restH - walkH, barWidth, walkH);

      // Draw Play (amber)
      const playH = (p.playMinutes / 40) * 35;
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(x, height - 30 - restH - walkH - playH, barWidth, playH);

      // Draw Sprint (coral)
      const sprintH = (p.sprintMinutes / 20) * 20;
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(x, height - 30 - restH - walkH - playH - sprintH, barWidth, sprintH);

      // X-axis label
      ctx.fillStyle = '#64748B';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.time, x + barWidth / 2, height - 10);
    });

    // Draw Heart Rate line curve on top
    ctx.beginPath();
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2.5;

    data.forEach((p, i) => {
      const x = 50 + i * step + barWidth / 2;
      // Map HR (60 to 140) to height
      const y = height - 40 - ((p.heartRateAvg - 60) / 80) * 90;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Heart Rate data dots
    data.forEach((p, i) => {
      const x = 50 + i * step + barWidth / 2;
      const y = height - 40 - ((p.heartRateAvg - 60) / 80) * 90;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#DC2626';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

  }, [data]);

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 text-[#175741] rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              {petName}'s Smart Health &amp; Activity Telemetry
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Real-time biometrics, activity ring, and preventative health timeline for {breed}
          </p>
        </div>

        {/* Time-range toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-bold">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-[#175741] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Activity Goal */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Activity Goal</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950">
            {summary.dailyActivityGoalPercentage}%
          </div>
          <span className="text-[11px] text-emerald-700 mt-1">
            {summary.totalActiveMinutes} of 90 min goal ({summary.activityTier})
          </span>
        </div>

        {/* Sleep Quality */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sleep Quality</span>
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-950">
            {summary.sleepQualityScore}/100
          </div>
          <span className="text-[11px] text-indigo-700 mt-1">
            Restful deep sleep phase
          </span>
        </div>

        {/* Avg Heart Rate */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resting HR</span>
            <Heart className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-rose-950">
            {summary.avgRestingHeartRate} <span className="text-sm font-semibold">BPM</span>
          </div>
          <span className="text-[11px] text-rose-700 mt-1">
            Normal range (65-115 BPM)
          </span>
        </div>

        {/* Active Calories */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Burn</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950">
            {summary.caloriesBurned} <span className="text-sm font-semibold">kcal</span>
          </div>
          <span className="text-[11px] text-amber-700 mt-1">
            Optimal for canine metabolism
          </span>
        </div>
      </div>

      {/* Canvas Chart */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-stone-700">
            24-Hour Activity Telemetry &amp; Vitals Pulse
          </span>
          {/* Chart Legend */}
          <div className="flex items-center gap-3 text-[11px] text-stone-600 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> Walk
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> Play
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-xs" /> Sprint
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-red-600 rounded-xs" /> Heart Rate
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <canvas 
            ref={canvasRef} 
            width={640} 
            height={200} 
            className="w-full h-48 block"
          />
        </div>
      </div>

      {/* Vaccine & Preventive Care Meter */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              Rabies &amp; DHPPi Immunity Protected
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                100% UP TO DATE
              </span>
            </div>
            <div className="text-xs text-emerald-200/80 mt-0.5">
              Next scheduled deworming due on 2 Nov 2025. Automated WhatsApp reminder enabled.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => alert("WhatsApp reminder confirmed for Bruno's upcoming deworming checkup!")}
            className="px-3 py-1.5 bg-white text-[#175741] text-xs font-black rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Manage Care Schedule
          </button>
        </div>
      </div>

    </div>
  );
};
