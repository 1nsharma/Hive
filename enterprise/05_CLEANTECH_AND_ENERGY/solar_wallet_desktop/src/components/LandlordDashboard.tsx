// src/components/LandlordDashboard.tsx
// SolarSync -- Multi-tenant Landlord Dashboard
// Full React/TypeScript port of the SolarSync HTML prototype

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip as ChartTooltip, Legend, Filler,
} from 'chart.js';
import { Chart as ReactChart, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, ChartTooltip, Legend, Filler
);

// ---- Types ----------------------------------------------------------------
interface TenantData {
  id: string; name: string; color: string; base: number; kwh: number; paid: boolean;
}
interface Props {
  solarProduction?: number;
  consumerLoad?: number;
  batterySOC?: number;
  voltage?: number;
  onNavigate?: (screen: string) => void;
}

// ---- Constants ------------------------------------------------------------
const RATE = 8.0;
const INITIAL_TENANTS: TenantData[] = [
  { id: 'R1', name: 'Room 1 - Aryan', color: '#fbbf24', base: 0.45, kwh: 85, paid: true  },
  { id: 'R2', name: 'Room 2 - Priya', color: '#10b981', base: 0.30, kwh: 62, paid: true  },
  { id: 'R3', name: 'Room 3 - Rohan', color: '#3b82f6', base: 0.55, kwh: 94, paid: false },
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const GEN_24H = HOURS.map(h => {
  if (h < 6) return 0;
  if (h < 8)  return parseFloat((0.5 + (h-6)*0.8).toFixed(2));
  if (h < 11) return parseFloat((2 + (h-8)*0.4 + Math.random()*0.3).toFixed(2));
  if (h < 14) return parseFloat((3 + Math.random()*0.5).toFixed(2));
  if (h < 17) return parseFloat((2.5 + Math.random()*0.4).toFixed(2));
  if (h < 19) return parseFloat((1.5 - (h-17)*0.4).toFixed(2));
  return 0;
});
const LOAD_24H = HOURS.map(h => {
  const n = (h<6||h>22) ? 0.5 : 1;
  const c = ((h>=7&&h<=9)||(h>=19&&h<=21)) ? 1.8 : 1;
  return parseFloat((n * c * (0.8 + Math.random()*0.3)).toFixed(2));
});
const SPARKLINES = INITIAL_TENANTS.map(t => HOURS.map(h => {
  const n = (h<6||h>22) ? 0.6 : 1;
  const c = ((h>=7&&h<=9)||(h>=19&&h<=21)) ? 1.6 : 1;
  return parseFloat((t.base * n * c * (0.7 + Math.random()*0.6)).toFixed(2));
}));

// ---- Helpers --------------------------------------------------------------
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function pad2(n: number) { return n.toString().padStart(2, '0'); }

// ---- Primitive sub-components --------------------------------------------
function Chip({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ' +
      'border border-white/[0.08] bg-white/[0.03] text-slate-300 ' + className
    }>{children}</span>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />;
}

function Badge({ variant, children }: { variant: 'green'|'amber'|'red'|'blue'; children: React.ReactNode }) {
  const m = {
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    red:   'bg-red-500/15 text-red-300 border-red-500/30',
    blue:  'bg-blue-500/15 text-blue-300 border-blue-500/30',
  };
  return (
    <span className={'text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide border ' + m[variant]}>
      {children}
    </span>
  );
}

function PBar({ pct, grad }: { pct: number; grad: string }) {
  return (
    <div className="h-2 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <span
        className="block h-full rounded-full transition-all duration-700"
        style={{ width: clamp(pct, 0, 100) + '%', background: grad }}
      />
    </div>
  );
}

function Glass({ children, className='', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={'rounded-2xl border border-white/[0.08] ' + className}
      style={{
        background: 'linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',
        backdropFilter: 'blur(10px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---- Animated SVG energy-flow --------------------------------------------
const PATH_DEFS: Record<string, string> = {
  si: 'M 110 170 L 280 170',
  it: 'M 380 170 C 500 170, 560 90, 700 90',
  ib: 'M 380 170 L 700 170',
  ig: 'M 380 170 C 500 170, 560 250, 700 250',
};

interface Particle { id: number; pathKey: string; t: number; color: string; }

function FlowDiagram({
  solarKW, loadKW, batKW, gridKW, soc, batDir,
}: { solarKW: number; loadKW: number; batKW: number; gridKW: number; soc: number; batDir: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const pid = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const a: Particle[] = [];
      if (solarKW > 0.2) {
        a.push({ id: pid.current++, pathKey: 'si', t: 0, color: '#fbbf24' });
        if (loadKW > 0.1)           a.push({ id: pid.current++, pathKey: 'it', t: 0, color: '#10b981' });
        if (Math.abs(batKW) > 0.05) a.push({ id: pid.current++, pathKey: 'ib', t: 0, color: '#3b82f6' });
        if (gridKW > 0.05)          a.push({ id: pid.current++, pathKey: 'ig', t: 0, color: '#60a5fa' });
      }
      setParticles(p => [...p, ...a]);
    }, 1200);
    return () => clearInterval(id);
  }, [solarKW, loadKW, batKW, gridKW]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setParticles(p =>
        p.map(x => ({ ...x, t: x.t + 0.009 + Math.random() * 0.004 })).filter(x => x.t < 1)
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function getPos(key: string, t: number) {
    if (!svgRef.current) return { x: 0, y: 0 };
    const el = svgRef.current.querySelector<SVGPathElement>('#lpf_' + key);
    if (!el) return { x: 0, y: 0 };
    const p = el.getPointAtLength(t * el.getTotalLength());
    return { x: p.x, y: p.y };
  }

  const mw = Math.max(2, (soc / 100) * 34);
  const off = (314 * (1 - soc / 100)).toFixed(1);

  return (
    <svg ref={svgRef} viewBox="0 0 900 340" className="w-full h-[340px]" style={{ overflow: 'visible' }}>
      <defs>
        {Object.entries(PATH_DEFS).map(([k, d]) => (
          <path key={k} id={'lpf_' + k} d={d} fill="none" stroke="none" />
        ))}
        <radialGradient id="ldSun" cx="30%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#fff7cc" />
          <stop offset="45%"  stopColor="#fbbf24" />
          <stop offset="75%"  stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>

      {Object.values(PATH_DEFS).map((d, i) => (
        <path key={i} d={d} stroke="rgba(255,255,255,0.10)" strokeWidth="2" fill="none" />
      ))}

      <g transform="translate(70,130)">
        <circle cx="40" cy="40" r="38" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.30)" />
        <circle cx="40" cy="40" r="26" fill="url(#ldSun)" style={{ filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.8))' }} />
        <text x="40" y="52" textAnchor="middle" fill="#fcd34d" fontSize="11" fontWeight="700">{solarKW.toFixed(2)} kW</text>
        <text x="40" y="105" textAnchor="middle" fill="#fcd34d" fontSize="12" fontWeight="700">SOLAR</text>
        <text x="40" y="122" textAnchor="middle" fill="#94a3b8" fontSize="10">PV Array</text>
      </g>

      <g transform="translate(280,130)">
        <rect x="0" y="0" width="120" height="80" rx="14" fill="#0f1730" stroke="rgba(255,255,255,0.12)" />
        <rect x="0" y="0" width="120" height="22" rx="14" fill="rgba(251,191,36,0.12)" />
        <text x="60" y="16" textAnchor="middle" fill="#fcd34d" fontSize="10" fontWeight="700">LUMINOUS 3kVA</text>
        <text x="60" y="48" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">INVERTER</text>
        <text x="60" y="66" textAnchor="middle" fill="#94a3b8" fontSize="10">Efficiency 96.2%</text>
      </g>

      <g transform="translate(660,50)">
        <rect x="0" y="0" width="160" height="80" rx="14" fill="#0f1730" stroke="rgba(16,185,129,0.30)" />
        <text x="14" y="22" fill="#6ee7b7" fontSize="11" fontWeight="700">TENANTS</text>
        <text x="14" y="44" fill="#fff" fontSize="14" fontWeight="700">{loadKW.toFixed(2)} kW</text>
        <text x="14" y="62" fill="#94a3b8" fontSize="10">3 rooms smart metered</text>
        <circle cx="140" cy="20" r="6" fill="#10b981" />
      </g>

      <g transform="translate(660,130)">
        <rect x="0" y="0" width="160" height="80" rx="14" fill="#0f1730" stroke="rgba(59,130,246,0.30)" />
        <text x="14" y="22" fill="#93c5fd" fontSize="11" fontWeight="700">BATTERY</text>
        <text x="14" y="44" fill="#fff" fontSize="14" fontWeight="700">{Math.abs(batKW).toFixed(2)} kW</text>
        <text x="14" y="62" fill="#94a3b8" fontSize="10">{batDir} {Math.round(soc)}%</text>
        <rect x="110" y="10" width="38" height="18" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" />
        <rect x="112" y="12" width={mw} height="14" rx="3" fill="#3b82f6" />
      </g>

      <g transform="translate(660,210)">
        <rect x="0" y="0" width="160" height="80" rx="14" fill="#0f1730" stroke="rgba(148,163,184,0.25)" />
        <text x="14" y="22" fill="#cbd5e1" fontSize="11" fontWeight="700">GRID (KESCo)</text>
        <text x="14" y="44" fill="#fff" fontSize="14" fontWeight="700">{gridKW.toFixed(2)} kW</text>
        <text x="14" y="62" fill="#94a3b8" fontSize="10">Import Rs 8.20/kWh</text>
      </g>

      {particles.map(p => {
        const pos = getPos(p.pathKey, p.t);
        return (
          <circle
            key={p.id} cx={pos.x} cy={pos.y} r="4" fill={p.color}
            style={{ filter: 'drop-shadow(0 0 6px ' + p.color + 'cc)' }}
          />
        );
      })}
    </svg>
  );
}

// ---- Tenant card ---------------------------------------------------------
function TenantCard({
  tenant, sparkData, onTogglePaid,
}: { tenant: TenantData; sparkData: number[]; onTogglePaid: () => void }) {
  const charge = (tenant.kwh * RATE).toFixed(2);
  const sd = {
    labels: HOURS.map(String),
    datasets: [{
      data: sparkData, borderColor: tenant.color,
      backgroundColor: tenant.color + '22',
      fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
    }],
  };
  const so = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    animation: { duration: 0 },
  } as const;

  return (
    <div
      className="rounded-2xl p-4 border border-white/[0.08] hover:-translate-y-0.5 transition-transform"
      style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-900 text-sm shrink-0"
          style={{ background: tenant.color }}
        >{tenant.id}</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white truncate">{tenant.name}</div>
          <div className="text-[11px] text-slate-400">
            Smart meter <span className="font-mono">{tenant.base.toFixed(2)}</span> kW
          </div>
        </div>
        <Badge variant={tenant.paid ? 'green' : 'red'}>{tenant.paid ? 'Paid' : 'Due'}</Badge>
      </div>
      <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div>
          <div className="text-slate-400 text-[10px]">This month</div>
          <div className="font-semibold font-mono">{tenant.kwh} kWh</div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px]">Charge</div>
          <div className="font-semibold text-amber-300 font-mono">Rs {charge}</div>
        </div>
      </div>
      <div className="mt-3 h-10"><Line data={sd} options={so} /></div>
      <div className="mt-2 flex items-center justify-between">
        <button className="text-[11px] text-slate-400 hover:text-white">View details</button>
        <button
          onClick={onTogglePaid}
          className="text-[11px] px-2 py-1 rounded-md border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {tenant.paid ? 'Mark unpaid' : 'Mark paid'}
        </button>
      </div>
    </div>
  );
}

// ---- Main export ---------------------------------------------------------
export default function LandlordDashboard({
  solarProduction, consumerLoad, batterySOC, voltage: vp, onNavigate,
}: Props) {
  const [clock, setClock] = useState('--:--:--');
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setClock(pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const [st, setSt] = useState({
    solarKW:    solarProduction != null ? solarProduction / 1000 : 2.4,
    loadKW:     consumerLoad   != null ? consumerLoad   / 1000 : 1.3,
    batKW:      0.8,
    gridKW:     0.3,
    soc:        batterySOC ?? 72,
    genDay:     18.4,
    loadDay:    12.2,
    batDay:     4.1,
    gridImpDay: 2.1,
    volt:       vp ?? 231,
  });

  const [sideView, setSideView] = useState('dashboard');
  const [tenants, setTenants] = useState<TenantData[]>(INITIAL_TENANTS);
  const [billingTab, setBillingTab] = useState<'live'|'month'>('live');

  const tick = useCallback(() => {
    setSt(prev => {
      const sol = solarProduction != null ? solarProduction / 1000
        : clamp(prev.solarKW + (Math.random() - 0.5) * 0.25, 0.2, 3.2);
      const lo = consumerLoad != null ? consumerLoad / 1000
        : clamp(prev.loadKW + (Math.random() - 0.5) * 0.15, 0.3, 2.5);
      const rem = sol - lo;
      const bk  = rem > 0 ? Math.min(1.5, rem * 0.8) : Math.max(-1.2, rem * 0.6);
      const gk  = rem > 0 ? Math.max(0, rem - bk) : Math.abs(rem + Math.abs(bk));
      const sc  = batterySOC != null ? batterySOC : clamp(prev.soc + (bk > 0 ? 0.3 : -0.3), 10, 98);
      const vo  = vp ?? parseFloat((228 + Math.random() * 6).toFixed(1));
      return { ...prev, solarKW: sol, loadKW: lo, batKW: bk, gridKW: gk, soc: sc, volt: vo };
    });
    setTenants(prev =>
      prev.map(t => ({ ...t, base: clamp(t.base + (Math.random() - 0.5) * 0.05, 0.1, 1.2) }))
    );
  }, [solarProduction, consumerLoad, batterySOC, vp]);

  useEffect(() => { const id = setInterval(tick, 1200); return () => clearInterval(id); }, [tick]);

  const batDir  = st.batKW >= 0 ? 'Charging' : 'Discharging';
  const gridDir = st.gridKW > 0.05 ? 'Importing' : 'Idle';
  const selfPct = Math.round((st.loadDay / st.genDay) * 100);
  const savedRs = (st.loadDay * RATE).toFixed(0);
  const co2     = (st.genDay * 0.82).toFixed(1);
  const socOff  = (314 * (1 - st.soc / 100)).toFixed(1);
  const totB    = tenants.reduce((s, t) => s + t.kwh * RATE, 0);
  const totC    = tenants.filter(t => t.paid).reduce((s, t) => s + t.kwh * RATE, 0);
  const vPct    = Math.min(100, ((st.volt - 200) / 40) * 100);
  const batV    = (11.8 + (st.soc / 100) * 1.6).toFixed(1);
  const batA    = Math.abs(st.batKW > 0 ? st.batKW * 8 : st.batKW * 6).toFixed(1);

  const c24d = {
    labels: HOURS.map(String),
    datasets: [
      { type: 'bar' as const,  label: 'Solar', data: GEN_24H,  backgroundColor: 'rgba(251,191,36,0.85)', borderRadius: 4, barPercentage: 0.7, order: 2 },
      { type: 'line' as const, label: 'Load',  data: LOAD_24H, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2, order: 1 },
    ],
  };
  const c24o = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cbd5e1', boxWidth: 10, font: { size: 11 } } },
      tooltip: { backgroundColor: '#0b1020', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
      y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  } as const;

  const NavBtn = ({ v, label }: { v: string; label: string }) => (
    <button
      onClick={() => setSideView(v)}
      className={'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ' +
        (sideView === v ? 'text-white border border-amber-400/25' : 'text-slate-400 hover:text-white')}
      style={sideView === v ? { background: 'rgba(251,191,36,0.12)' } : {}}
    >
      {label}
    </button>
  );

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: [
          'radial-gradient(1200px 600px at 10% -10%, rgba(251,191,36,0.10), transparent 60%)',
          'radial-gradient(900px 500px at 110% 10%, rgba(59,130,246,0.10), transparent 60%)',
          'radial-gradient(800px 500px at 50% 120%, rgba(16,185,129,0.08), transparent 60%)',
          '#0b1020',
        ].join(','),
        color: '#e5e7eb',
      }}
    >
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 p-4 border-r border-white/5">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base"
            style={{ background: 'radial-gradient(circle at 30% 30%,#fff7cc,#fbbf24 45%,#f59e0b 75%,#b45309 100%)', boxShadow: '0 0 20px rgba(251,191,36,0.4)' }}>
            S
          </div>
          <div>
            <div className="font-bold text-white tracking-tight">SolarSync</div>
            <div className="text-[11px] text-slate-400">Multi-tenant Energy OS</div>
          </div>
        </div>
        <div className="mt-6 text-[10px] uppercase tracking-widest text-slate-500 px-2">Workspace</div>
        <nav className="mt-2 space-y-1">
          <NavBtn v="dashboard" label="Dashboard" />
          <NavBtn v="tenants"   label="Tenants" />
          <NavBtn v="billing"   label="Billing" />
          <NavBtn v="battery"   label="Battery" />
          <NavBtn v="grid"      label="Grid" />
        </nav>
        <div className="mt-6 text-[10px] uppercase tracking-widest text-slate-500 px-2">System</div>
        <nav className="mt-2 space-y-1">
          <NavBtn v="devices"  label="Devices" />
          <NavBtn v="settings" label="Settings" />
        </nav>
        <Glass className="mt-8 p-3">
          <div className="text-[11px] text-slate-400">Site</div>
          <div className="text-sm font-semibold text-white">Sharma Niwas</div>
          <div className="text-[11px] text-slate-400 mt-1">Luminous 3kVA - 3 Tenants</div>
          <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Gateway</span>
            <Chip><Dot color="#34d399" /> Online</Chip>
          </div>
        </Glass>
        {onNavigate && (
          <button
            onClick={() => onNavigate('provider')}
            className="mt-4 w-full py-2 rounded-xl text-[11px] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            Back to Solar Hub
          </button>
        )}
        <div className="mt-4 text-[10px] text-slate-500 px-2">Prototype v0.1 - Pilot mode</div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <header
          className="sticky top-0 z-20 border-b border-white/5"
          style={{ backdropFilter: 'blur(12px)', background: 'rgba(11,16,32,0.70)' }}
        >
          <div className="flex items-center gap-3 px-5 py-3 flex-wrap">
            <div>
              <div className="text-[11px] text-slate-400">Dashboard</div>
              <div className="text-lg font-semibold text-white">Live Energy Overview</div>
            </div>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <Chip><Dot color="#34d399" /><span className="animate-pulse">Live 5s</span></Chip>
              <Chip>Clear 32 C</Chip>
              <Chip className="hidden md:inline-flex">{clock}</Chip>
              <button className="px-3 py-2 rounded-lg text-sm bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* KPI row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 pt-5">
          <Glass className="p-4" style={{ boxShadow: '0 0 0 1px rgba(251,191,36,0.2), 0 10px 30px -10px rgba(251,191,36,0.35)' }}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Solar Generation</div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)' }}>S</div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white font-mono">{st.solarKW.toFixed(2)}</div>
              <div className="text-sm text-slate-400">kW</div>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Today: <span className="text-amber-300 font-semibold font-mono">{st.genDay.toFixed(1)}</span> kWh
            </div>
          </Glass>
          <Glass className="p-4" style={{ boxShadow: '0 0 0 1px rgba(16,185,129,0.2), 0 10px 30px -10px rgba(16,185,129,0.35)' }}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Tenant Load</div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>H</div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white font-mono">{st.loadKW.toFixed(2)}</div>
              <div className="text-sm text-slate-400">kW</div>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Today: <span className="text-emerald-300 font-semibold font-mono">{st.loadDay.toFixed(1)}</span> kWh
            </div>
          </Glass>
          <Glass className="p-4" style={{ boxShadow: '0 0 0 1px rgba(59,130,246,0.2), 0 10px 30px -10px rgba(59,130,246,0.35)' }}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Battery</div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>B</div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white font-mono">{Math.round(st.soc)}</div>
              <div className="text-sm text-slate-400">% SOC</div>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-blue-300 font-semibold">{batDir}</span>{' '}
              <span className="font-mono">{Math.abs(st.batKW).toFixed(2)}</span> kW
            </div>
          </Glass>
          <Glass className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Grid</div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.15)' }}>G</div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white font-mono">{st.gridKW.toFixed(2)}</div>
              <div className="text-sm text-slate-400">kW</div>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-slate-300 font-semibold">{gridDir}</span>
            </div>
          </Glass>
        </section>

        {/* Flow + Balance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-5 pt-4">
          <Glass className="p-4 lg:col-span-2">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div>
                <div className="text-sm font-semibold text-white">Energy Flow</div>
                <div className="text-[11px] text-slate-400">Real-time routing: inverter to tenants / battery / grid</div>
              </div>
              <div className="flex items-center gap-2">
                <Chip><Dot color="#fbbf24" /> Solar</Chip>
                <Chip><Dot color="#10b981" /> Load</Chip>
                <Chip><Dot color="#3b82f6" /> Battery</Chip>
              </div>
            </div>
            <FlowDiagram
              solarKW={st.solarKW} loadKW={st.loadKW}
              batKW={st.batKW}    gridKW={st.gridKW}
              soc={st.soc}        batDir={batDir}
            />
          </Glass>
          <Glass className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Energy Balance</div>
                <div className="text-[11px] text-slate-400">Gen = Load + Battery + Grid</div>
              </div>
              <Badge variant="green">Balanced</Badge>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400"><span>Generated</span><span className="text-amber-300 font-mono">{st.genDay.toFixed(1)} kWh</span></div>
                <PBar pct={100} grad="linear-gradient(90deg,#fbbf24,#f59e0b)" />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-400"><span>Tenants</span><span className="text-emerald-300 font-mono">{st.loadDay.toFixed(1)} kWh</span></div>
                <PBar pct={(st.loadKW / (st.solarKW || 1)) * 100} grad="linear-gradient(90deg,#10b981,#059669)" />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-400"><span>Battery</span><span className="text-blue-300 font-mono">{st.batDay.toFixed(1)} kWh</span></div>
                <PBar pct={(Math.abs(st.batKW) / (st.solarKW || 1)) * 100} grad="linear-gradient(90deg,#3b82f6,#1d4ed8)" />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-400"><span>Grid</span><span className="text-slate-300 font-mono">{st.gridImpDay.toFixed(1)} kWh</span></div>
                <PBar pct={(st.gridKW / (st.solarKW || 1)) * 100} grad="linear-gradient(90deg,#94a3b8,#475569)" />
              </div>
            </div>
            <div className="h-px my-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-[10px] text-slate-400">Self-use</div>
                <div className="text-sm font-bold text-white font-mono">{isFinite(selfPct) ? selfPct : 0}%</div>
              </div>
              <div className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-[10px] text-slate-400">Saved</div>
                <div className="text-sm font-bold text-emerald-300 font-mono">Rs{savedRs}</div>
              </div>
              <div className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-[10px] text-slate-400">CO2</div>
                <div className="text-sm font-bold text-white font-mono">{co2} kg</div>
              </div>
            </div>
          </Glass>
        </section>

        {/* Tenants + Chart */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-5 pt-4">
          <Glass className="p-4 lg:col-span-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-sm font-semibold text-white">Tenant Metering and Billing</div>
                <div className="text-[11px] text-slate-400">
                  Per-room smart meters Rate: <span className="text-amber-300 font-semibold">Rs {RATE.toFixed(2)}/kWh</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {(['live', 'month'] as const).map(t => (
                  <button key={t} onClick={() => setBillingTab(t)}
                    className={'px-3.5 py-1.5 rounded-xl text-[13px] capitalize transition-colors ' + (billingTab === t ? 'text-white' : 'text-slate-400 hover:text-white')}
                    style={billingTab === t ? { background: 'rgba(255,255,255,0.06)' } : {}}>
                    {t === 'live' ? 'Live' : 'Month'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {tenants.map((t, i) => (
                <TenantCard key={t.id} tenant={t} sparkData={SPARKLINES[i]}
                  onTogglePaid={() => setTenants(prev => prev.map(x => x.id === t.id ? { ...x, paid: !x.paid } : x))} />
              ))}
            </div>
          </Glass>
          <Glass className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">24h Generation vs Load</div>
                <div className="text-[11px] text-slate-400">Hourly kWh</div>
              </div>
              <Chip>Today</Chip>
            </div>
            <div className="mt-3 h-[230px]"><ReactChart type='bar' data={c24d as any} options={c24o} /></div>
          </Glass>
        </section>

        {/* Billing + Battery + Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-5 pt-4 pb-8">
          <Glass className="p-4">
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-semibold text-white">Billing Summary</div><div className="text-[11px] text-slate-400">September 2026</div></div>
              <Badge variant="amber">Auto-calculated</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {tenants.map(t => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-slate-900 text-[12px] shrink-0" style={{ background: t.color }}>{t.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{t.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{t.kwh} kWh x Rs{RATE.toFixed(2)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white font-mono">Rs{(t.kwh * RATE).toFixed(2)}</div>
                    <div className="mt-1"><Badge variant={t.paid ? 'green' : 'red'}>{t.paid ? 'Paid' : 'Due'}</Badge></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px my-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="flex items-center justify-between">
              <div><div className="text-[11px] text-slate-400">Total billed</div><div className="text-2xl font-bold text-white font-mono">Rs{totB.toFixed(2)}</div></div>
              <div className="text-right"><div className="text-[11px] text-slate-400">Collected</div><div className="text-lg font-bold text-emerald-300 font-mono">Rs{totC.toFixed(2)}</div></div>
            </div>
            <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
              Download Invoices (PDF)
            </button>
          </Glass>

          <Glass className="p-4">
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-semibold text-white">Battery Health</div><div className="text-[11px] text-slate-400">Luminous 150Ah Lead-acid</div></div>
              <Badge variant="green">Healthy</Badge>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                  <circle cx="60" cy="60" r="50" stroke="#3b82f6" strokeWidth="10" fill="none"
                    strokeLinecap="round" strokeDasharray="314" strokeDashoffset={socOff}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-white font-mono">{Math.round(st.soc)}%</div>
                  <div className="text-[10px] text-slate-400">State of Charge</div>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-slate-400">Voltage</span><span className="font-semibold font-mono">{batV} V</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Current</span><span className="font-semibold font-mono">{batA} A</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Temp</span><span className="font-semibold font-mono">31 C</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Cycles</span><span className="font-semibold font-mono">142</span></div>
              </div>
            </div>
            <div className="h-px my-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="text-[11px] text-slate-400 mb-2">Cells</div>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => {
                const h = 70 + Math.random() * 25;
                const c = h > 85 ? '#10b981' : h > 60 ? '#3b82f6' : '#f59e0b';
                return <div key={i} className="h-3.5 rounded-md overflow-hidden border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.05)' }}><span className="block h-full rounded-md" style={{ width: h + '%', background: c }} /></div>;
              })}
            </div>
          </Glass>

          <Glass className="p-4">
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-semibold text-white">Grid (KESCo)</div><div className="text-[11px] text-slate-400">Official DISCOM meter - read-only</div></div>
              <Badge variant="blue">Import</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-[10px] text-slate-400">Import today</div>
                <div className="text-xl font-bold text-white font-mono">{st.gridImpDay.toFixed(1)} kWh</div>
                <div className="text-[10px] text-slate-400">Rs{(st.gridImpDay * 8.2).toFixed(2)}</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-[10px] text-slate-400">Export today</div>
                <div className="text-xl font-bold text-white font-mono">0.0 kWh</div>
                <div className="text-[10px] text-slate-400">Not billed to tenants</div>
              </div>
            </div>
            <div className="h-px my-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="text-[11px] text-slate-400 mb-2">Voltage (L-N)</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <span className="block h-full rounded-full transition-all duration-700" style={{ width: vPct + '%', background: 'linear-gradient(90deg,#3b82f6,#60a5fa)' }} />
              </div>
              <div className="font-mono text-sm font-semibold">{st.volt.toFixed(0)} V</div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              Note: SolarSync does not sell to grid. Grid billing remains with KESCo.
            </div>
          </Glass>
        </section>
      </main>
    </div>
  );
}