import { useMemo, useState } from 'react';
import { BadgeCheck, Box, ChevronRight, CircleHelp, ClipboardList, IndianRupee, PackageCheck, Plus, Search, ShieldCheck, Store, Truck, Upload } from 'lucide-react';

type VendorStage = 'overview' | 'catalog' | 'orders' | 'learn';

const metrics = [
  { label: 'Today’s sales', value: '₹12,480', detail: '+18% vs. yesterday', icon: IndianRupee, tone: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  { label: 'Orders to pack', value: '08', detail: 'Pickup before 5:00 PM', icon: PackageCheck, tone: 'text-amber-800 bg-amber-50 border-amber-100' },
  { label: 'Low-stock items', value: '03', detail: 'Restock to keep listing live', icon: Box, tone: 'text-rose-700 bg-rose-50 border-rose-100' },
];

const sampleProducts = [
  { name: 'Reflective QR Safety Collar', sku: 'PJ-COL-QR-01', stock: 42, price: '₹499', status: 'Live' },
  { name: 'Salmon Care Kibble — 1 kg', sku: 'PJ-FOD-SLM-01', stock: 8, price: '₹899', status: 'Live' },
  { name: 'Calming Grooming Kit', sku: 'PJ-GRM-CAL-02', stock: 0, price: '₹1,299', status: 'Needs stock' },
];

export function VendorHub() {
  const [stage, setStage] = useState<VendorStage>('overview');
  const [query, setQuery] = useState('');
  const catalog = useMemo(() => sampleProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())), [query]);

  const nav: Array<{ id: VendorStage; label: string; icon: typeof Store }> = [
    { id: 'overview', label: 'Overview', icon: Store },
    { id: 'catalog', label: 'Catalog', icon: Box },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'learn', label: 'Seller guides', icon: CircleHelp },
  ];

  return (
    <div className="pb-20 space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-[#0e3d2f] text-white shadow-lg" style={{ borderColor: '#175741' }}>
        <div className="p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified seller workspace
            </div>
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">Build your pet business on PetJanu.</h1>
            <p className="text-sm leading-relaxed text-emerald-50/80">Manage products, prices, inventory, orders, pickups and customer trust from one place.</p>
          </div>
          <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f0a21e] px-4 py-3 text-xs font-black text-[#0a2c21] transition-transform hover:-translate-y-0.5" onClick={() => setStage('catalog')}>
            <Plus className="h-4 w-4" /> Add a product
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="rounded-3xl border bg-white p-3 shadow-xs" style={{ borderColor: '#E5DFD3' }}>
          <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-widest text-stone-400">Seller center</p>
          <div className="space-y-1">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setStage(id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${stage === id ? 'bg-[#175741] text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
            <ShieldCheck className="mb-2 h-4 w-4 text-amber-700" />
            <p className="font-bold">Listings are reviewed before they go live.</p>
            <p className="mt-1 text-[11px] leading-relaxed">This protects customers and strengthens your store’s trust badge.</p>
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          {stage === 'overview' && <>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map(({ label, value, detail, icon: Icon, tone }) => <div key={label} className="rounded-2xl border bg-white p-4 shadow-xs" style={{ borderColor: '#E5DFD3' }}>
                <div className={`mb-3 inline-flex rounded-xl border p-2 ${tone}`}><Icon className="h-4 w-4" /></div>
                <p className="text-xs font-semibold text-stone-500">{label}</p><p className="mt-0.5 text-xl font-black text-stone-900">{value}</p><p className="mt-1 text-[10px] font-semibold text-stone-400">{detail}</p>
              </div>)}
            </div>
            <div className="rounded-3xl border bg-white p-5 shadow-xs" style={{ borderColor: '#E5DFD3' }}>
              <div className="flex items-center justify-between gap-3"><div><h2 className="font-black text-stone-900">Today’s fulfilment queue</h2><p className="text-xs text-stone-500">Accept, pack and schedule Shiprocket pickup before the cutoff.</p></div><button onClick={() => setStage('orders')} className="text-xs font-black text-[#175741]">View orders</button></div>
              <div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-stone-50 p-3"><p className="text-[10px] font-black uppercase text-stone-400">New</p><p className="mt-1 text-lg font-black text-stone-900">05</p></div><div className="rounded-2xl bg-amber-50 p-3"><p className="text-[10px] font-black uppercase text-amber-700">Ready to ship</p><p className="mt-1 text-lg font-black text-amber-900">03</p></div><div className="rounded-2xl bg-emerald-50 p-3"><p className="text-[10px] font-black uppercase text-emerald-700">In transit</p><p className="mt-1 text-lg font-black text-emerald-900">14</p></div></div>
            </div>
          </>}

          {stage === 'catalog' && <div className="rounded-3xl border bg-white p-5 shadow-xs" style={{ borderColor: '#E5DFD3' }}>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-black text-stone-900">Your product catalog</h2><p className="text-xs text-stone-500">SKU, price and stock stay under your control.</p></div><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#175741] px-3 py-2 text-xs font-black text-white"><Upload className="h-3.5 w-3.5" /> Add product</button></div>
            <label className="relative mt-5 block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#175741]" style={{ borderColor: '#E5DFD3' }} placeholder="Search your catalog" /></label>
            <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[540px] text-left text-xs"><thead className="border-b text-[10px] uppercase tracking-wider text-stone-400"><tr><th className="pb-3">Product</th><th className="pb-3">SKU</th><th className="pb-3">Stock</th><th className="pb-3">Price</th><th className="pb-3">Status</th></tr></thead><tbody>{catalog.map((product) => <tr key={product.sku} className="border-b last:border-0" style={{ borderColor: '#F0EBE1' }}><td className="py-3 font-bold text-stone-900">{product.name}</td><td className="py-3 font-mono text-stone-500">{product.sku}</td><td className="py-3 font-bold text-stone-700">{product.stock}</td><td className="py-3 font-bold text-stone-900">{product.price}</td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-black ${product.status === 'Live' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{product.status}</span></td></tr>)}</tbody></table></div>
          </div>}

          {stage === 'orders' && <div className="rounded-3xl border bg-white p-5 shadow-xs" style={{ borderColor: '#E5DFD3' }}><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-2 text-blue-700"><Truck className="h-5 w-5" /></div><div><h2 className="font-black text-stone-900">Fulfilment is ready to connect</h2><p className="text-xs text-stone-500">Payment-confirmed orders will appear here for Shiprocket pickup and tracking.</p></div></div><button className="mt-5 inline-flex items-center gap-1 text-xs font-black text-[#175741]" onClick={() => setStage('learn')}>Open shipping setup guide <ChevronRight className="h-4 w-4" /></button></div>}

          {stage === 'learn' && <div className="rounded-3xl border bg-white p-5 shadow-xs" style={{ borderColor: '#E5DFD3' }}><h2 className="font-black text-stone-900">Seller knowledge centre</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{['Create high-trust product listings', 'Prepare your first Shiprocket pickup', 'Price products with platform commission', 'Returns and customer support'].map((title) => <button key={title} className="flex items-center justify-between rounded-2xl border p-4 text-left text-xs font-bold text-stone-700 hover:border-[#175741]" style={{ borderColor: '#E5DFD3' }}>{title}<ChevronRight className="h-4 w-4 text-[#175741]" /></button>)}</div></div>}
        </section>
      </div>
    </div>
  );
}
