import React, { useState, useEffect } from 'react';
import { Shop, Membership, Product, Order, UserProfile } from '../types/database';
import { 
  Layers, 
  Users, 
  Package, 
  ShoppingCart, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Check, 
  X,
  AlertCircle,
  Building
} from 'lucide-react';

interface MultiTenantManagerProps {
  currentShop: Shop;
  currentUser: UserProfile;
  shops: Shop[];
  onShopCreated: () => void;
  isShopOwner: boolean;
  isSuperAdmin: boolean;
}

export const MultiTenantManager: React.FC<MultiTenantManagerProps> = ({
  currentShop,
  currentUser,
  shops,
  onShopCreated,
  isShopOwner,
  isSuperAdmin,
}) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'products' | 'orders' | 'new-tenant'>('members');

  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('49.00');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Tenant Shop Form
  const [newShopName, setNewShopName] = useState('');
  const [newShopSlug, setNewShopSlug] = useState('');
  const [newShopPlan, setNewShopPlan] = useState<'starter' | 'growth' | 'enterprise'>('starter');

  // Fetch tenant data
  const fetchTenantData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      // 1. Memberships
      const memRes = await fetch(`/api/shops/${currentShop.id}/memberships`);
      if (memRes.ok) {
        const memData = await memRes.json();
        setMemberships(memData);
      } else {
        setMemberships([]);
      }

      // 2. Products (RLS applied)
      const prodRes = await fetch(`/api/shops/${currentShop.id}/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.data || []);
      }

      // 3. Orders (RLS applied)
      const ordRes = await fetch(`/api/shops/${currentShop.id}/orders`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching tenant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [currentShop.id, currentUser.id]);

  // Handle Add Product (guarded by shop_id and RLS)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    try {
      const priceCents = Math.round(parseFloat(newProductPrice) * 100);
      const res = await fetch(`/api/shops/${currentShop.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          sku: newProductSku.toUpperCase(),
          priceCents,
          stockQuantity: 25,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess(`Product "${data.name}" provisioned for tenant "${currentShop.name}" with shop_id constraint.`);
      setNewProductName('');
      setNewProductSku('');
      fetchTenantData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Handle Create New Tenant Shop
  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newShopName,
          slug: newShopSlug,
          plan: newShopPlan,
          currency: 'USD',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess(`New Tenant Shop "${data.shop.name}" provisioned! Owner membership automatically granted.`);
      setNewShopName('');
      setNewShopSlug('');
      onShopCreated();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Active Tenant Overview Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-zinc-100">
                Multi-Tenant Architecture & Data Isolation Inspector
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Every table enforces <code className="text-indigo-300 font-mono">shop_id UUID</code> foreign keys. 
              PostgreSQL Row Level Security strictly partitions tenant data at the storage layer.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Plan:</span>
            <span className="font-mono text-indigo-300 uppercase font-medium">{currentShop.plan}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">Currency:</span>
            <span className="font-mono text-zinc-300">{currentShop.currency}</span>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('members')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'members'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Store Memberships ({memberships.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'products'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Scoped Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'orders'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Scoped Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('new-tenant')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'new-tenant'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Provision New Tenant Shop</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-lg text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* SubTab 1: Memberships */}
      {activeSubTab === 'members' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-zinc-200">
                Tenant Membership Roster (Owner vs Staff RBAC)
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Regulated by <code className="text-zinc-300 font-mono">memberships_select_policy</code> and <code className="text-zinc-300 font-mono">memberships_update_policy</code>.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Tenant ID: {currentShop.id}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-2 px-3">Member</th>
                  <th className="py-2 px-3">Membership Role</th>
                  <th className="py-2 px-3">Scoped Permissions</th>
                  <th className="py-2 px-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {memberships.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-850/40">
                    <td className="py-2.5 px-3 text-zinc-200">
                      <div className="font-sans font-medium">{m.user?.full_name || m.user_id}</div>
                      <div className="text-[10px] text-zinc-500">{m.user?.email}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-mono uppercase text-[10px] font-semibold ${
                          m.role === 'owner' ? 'text-indigo-400' : 'text-cyan-400'
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400 text-[10px]">
                      {m.permissions.join(', ')}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[10px]">
                      {new Date(m.created_at).toISOString().split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Products */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          {/* Add Product Form */}
          <form
            onSubmit={handleAddProduct}
            className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 text-xs"
          >
            <div className="font-semibold text-zinc-200 mb-3 flex items-center justify-between">
              <span>Insert Tenant Product (Mandatory shop_id Foreign Key)</span>
              <span className="text-zinc-500 font-mono text-[11px]">RLS: products_insert_policy</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ergonomic Grip Barbell"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">SKU Code</label>
                <input
                  type="text"
                  placeholder="e.g. APX-GB-099"
                  value={newProductSku}
                  onChange={(e) => setNewProductSku(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Product to {currentShop.name}</span>
              </button>
            </div>
          </form>

          {/* Product List */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-3 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200">
                Products Partitioned for Tenant: {currentShop.name}
              </span>
              <span className="font-mono text-zinc-500 text-[11px]">{products.length} catalog items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-2 px-3">Product Name</th>
                    <th className="py-2 px-3">SKU</th>
                    <th className="py-2 px-3">Price</th>
                    <th className="py-2 px-3">Stock</th>
                    <th className="py-2 px-3">shop_id Foreign Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-850/40">
                      <td className="py-2.5 px-3 font-sans font-medium text-zinc-200">
                        {p.name}
                      </td>
                      <td className="py-2.5 px-3 text-indigo-400">{p.sku}</td>
                      <td className="py-2.5 px-3 text-emerald-400">
                        ${(p.price_cents / 100).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400">{p.stock_quantity} in stock</td>
                      <td className="py-2.5 px-3 text-zinc-500 text-[10px]">{p.shop_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Orders */}
      {activeSubTab === 'orders' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-3 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-200">
              Orders Scoped for Tenant: {currentShop.name}
            </span>
            <span className="text-zinc-500 font-mono text-[11px]">
              RLS: orders_select_policy (customer_id = auth.uid() OR is_shop_member)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-2 px-3">Order Number</th>
                  <th className="py-2 px-3">Customer ID</th>
                  <th className="py-2 px-3">Total Amount</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-850/40">
                    <td className="py-2.5 px-3 text-zinc-200 font-medium">{o.order_number}</td>
                    <td className="py-2.5 px-3 text-zinc-400 text-[10px]">
                      {o.customer_id || 'Guest Checkout'}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400">
                      ${(o.total_cents / 100).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-amber-400 uppercase text-[10px] font-semibold">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[10px]">
                      {new Date(o.created_at).toISOString().split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 4: Provision New Tenant Shop */}
      {activeSubTab === 'new-tenant' && (
        <form
          onSubmit={handleCreateShop}
          className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 text-xs space-y-4 max-w-xl"
        >
          <div>
            <h3 className="font-semibold text-zinc-200">
              Provision New Tenant Storefront
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              RLS Policy <code className="text-zinc-300 font-mono">shops_insert_policy</code> requires merchant or super_admin system role. 
              The calling actor automatically receives the Owner role on the new tenant.
            </p>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Tenant Business Name</label>
            <input
              type="text"
              placeholder="e.g. Velocity Carbon Bikes"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Unique Store Slug</label>
            <input
              type="text"
              placeholder="e.g. velocity-bikes"
              value={newShopSlug}
              onChange={(e) => setNewShopSlug(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Subscription Plan</label>
            <select
              value={newShopPlan}
              onChange={(e) => setNewShopPlan(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Building className="h-3.5 w-3.5" />
              <span>Create Tenant & Assign Owner Role</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
