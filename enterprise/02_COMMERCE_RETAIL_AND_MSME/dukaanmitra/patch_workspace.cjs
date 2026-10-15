const fs = require('fs');

const workspaceCode = `import { useState } from "react";
import { formatRupees } from "../../utils";

export default function WorkspaceOS({ user, customers, products, transactions, setActiveTab, onRefreshDB }: any) {
  const shopName = user?.shopName || "My Shop";
  const ownerName = user?.ownerName || "Shopkeeper";
  
  const today = new Date().toISOString().split('T')[0];
  const todayTx = transactions.filter((t: any) => t.date.startsWith(today));
  
  const todaySales = todayTx.filter((t: any) => t.type === 'sale').reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalBills = todayTx.filter((t: any) => t.type === 'sale').length;
  
  // Pending dues (assuming positive balance means they owe money)
  const totalUdhaari = customers.reduce((sum: number, c: any) => sum + (c.balance > 0 ? c.balance : 0), 0);
  
  const lowStockCount = products.filter((p: any) => p.stock <= (p.lowStockThreshold || 10)).length;
  
  // Get top 3 pending customers
  const pendingCustomers = [...customers]
    .filter(c => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 3);
    
  // Get last 3 bills
  const recentBills = [...transactions]
    .filter(t => t.type === 'sale')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRelativeDays = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
    if (diff === 0) return 'today';
    return \`\${diff} days\`;
  };

  return (
    <div className="content h-full overflow-y-auto pb-[90px] p-4 hide-scrollbar">
      <div className="top-h">
        <div>
          <div style={{fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 600}}>Namaste, {ownerName} 👋</div>
          <h2 className="h" style={{marginTop: '2px'}}>{shopName}</h2>
        </div>
        <div className="icon-btn" onClick={() => alert('Notifications coming soon')}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
      </div>

      <div className="card hero mt-4">
        <div className="label">Today's collection</div>
        <div className="big">{formatRupees(todaySales)}</div>
        <div style={{fontSize: '12px', color: '#c9d0e8'}}>across {totalBills} bills · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
        <div className="row">
          <div>Cash in hand<div className="v">{formatRupees(todaySales * 0.6)}</div></div>
          <div>Udhaar today<div className="v" style={{color: '#f4b7ac'}}>{formatRupees(todaySales * 0.4)}</div></div>
          <div>Via WhatsApp<div className="v" style={{color: '#a8e0c4'}}>Active</div></div>
        </div>
      </div>

      <div className="eyebrow">Quick actions</div>
      <div className="qa-grid">
        <div className="qa" onClick={() => setActiveTab('pos')}>
          <div className="ic" style={{background: 'var(--gold-soft)'}}>🧾</div>New bill
        </div>
        <div className="qa" onClick={() => setActiveTab('ledger')}>
          <div className="ic" style={{background: 'var(--red-soft)'}}>📕</div>Khata
        </div>
        <div className="qa" onClick={() => setActiveTab('inventory')}>
          <div className="ic" style={{background: 'var(--green-soft)'}}>📦</div>Stock
        </div>
        <div className="qa" onClick={() => setActiveTab('reports')}>
          <div className="ic" style={{background: '#DFF3E6'}}>📊</div>Reports
        </div>
      </div>

      <div className="eyebrow">Needs attention</div>
      <div className="card">
        {pendingCustomers.length > 0 ? pendingCustomers.map((c: any) => (
          <div className="list-item" key={c.id}>
            <div className="avatar">{getInitials(c.name)}</div>
            <div style={{flex: 1}}>
              <div className="li-name">{c.name}</div>
              <div className="li-sub">Udhaar pending</div>
            </div>
            <div className="amt red">{formatRupees(c.balance)}</div>
          </div>
        )) : (
          <div className="text-sm text-[var(--ink-soft)] text-center py-2">No pending dues!</div>
        )}
        
        {lowStockCount > 0 && (
          <div className="list-item">
            <div className="avatar" style={{background: 'var(--red-soft)', color: 'var(--red)'}}>{lowStockCount}</div>
            <div style={{flex: 1}}>
              <div className="li-name">Stock running low</div>
              <div className="li-sub">{lowStockCount} items below reorder point</div>
            </div>
            <div className="icon-btn" onClick={() => setActiveTab('inventory')} style={{width: '28px', height: '28px'}}>›</div>
          </div>
        )}
      </div>

      <div className="eyebrow">Recent bills</div>
      <div className="card">
        {recentBills.length > 0 ? recentBills.map((t: any) => (
          <div className="ledger-line" key={t.id}>
            <span className="l">{t.notes || "Sale"} {t.productName ? \` — \${t.productName}\` : ''}</span>
            <span className="amt green">{formatRupees(t.amount)}</span>
          </div>
        )) : (
          <div className="text-sm text-[var(--ink-soft)] text-center py-2">No bills today</div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/features/dashboard/WorkspaceOS.tsx', workspaceCode);
