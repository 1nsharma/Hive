const fs = require('fs');

const ledgerCode = `import { useState } from "react";
import { formatRupees } from "../../utils";

export default function LedgerTab({ customers, transactions, onRefreshDB }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const totalDue = customers.reduce((sum: number, c: any) => sum + (c.balance > 0 ? c.balance : 0), 0);
  const dueCustomers = customers.filter((c: any) => c.balance > 0).length;
  const settledCustomers = customers.filter((c: any) => c.balance <= 0).length;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredCustomers = customers.filter((c: any) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    if (!matchesSearch) return false;
    if (filter === 'due') return c.balance > 0;
    if (filter === 'settled') return c.balance <= 0;
    return true;
  });

  if (selectedCustomer) {
    const custTx = transactions.filter((t: any) => t.customerId === selectedCustomer.id).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
      <div className="content h-full overflow-y-auto pb-[90px] p-4 hide-scrollbar">
        <div className="top-h">
          <div className="icon-btn" onClick={() => setSelectedCustomer(null)}>←</div>
          <div className="icon-btn" onClick={() => alert('Message via WhatsApp')}>💬</div>
        </div>
        <div className="stack-avatar">
          <div className="big-av">{getInitials(selectedCustomer.name)}</div>
          <div>
            <h2 className="h" style={{margin: 0}}>{selectedCustomer.name}</h2>
            <div className="sub" style={{margin: 0}}>{selectedCustomer.phone}</div>
          </div>
        </div>

        <div className="card hero" style={{padding: '14px 16px'}}>
          <div className="label">Outstanding balance</div>
          <div className="big" style={{color: selectedCustomer.balance > 0 ? '#f4b7ac' : '#fff'}}>{formatRupees(selectedCustomer.balance)}</div>
        </div>

        <div style={{display: 'flex', gap: '10px', margin: '14px 0'}}>
          <button className="btn wa" style={{flex: 1, padding: '11px', fontSize: '13px'}} onClick={() => alert('Reminder feature coming soon')}>💬 Send reminder</button>
          <button className="btn dark" style={{flex: 1, padding: '11px', fontSize: '13px'}}>Mark paid</button>
        </div>

        <div className="eyebrow">Ledger history</div>
        <div className="card">
          {custTx.length > 0 ? custTx.map((t: any, index: number) => (
            <div className="ledger-line" key={t.id} style={{borderBottom: index === custTx.length - 1 ? 'none' : ''}}>
              <span className="l">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — {t.type === 'payment' ? 'Payment' : 'Sale'}</span>
              <span className={\`amt \${t.type === 'sale' ? 'red' : 'green'}\`}>{t.type === 'sale' ? '+' : '−'} {formatRupees(t.amount)}</span>
            </div>
          )) : (
            <div className="text-sm text-[var(--ink-soft)] text-center py-2">No history</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="content h-full overflow-y-auto pb-[90px] p-4 hide-scrollbar">
      <h2 className="h">Khata book</h2>
      <p className="sub">Every customer's running ledger, in one place.</p>

      <div className="card hero" style={{padding: '14px 16px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div><div className="label">Total to collect</div><div className="big" style={{fontSize: '24px'}}>{formatRupees(totalDue)}</div></div>
          <div style={{textAlign: 'right'}}><div className="label">Customers with due</div><div className="big" style={{fontSize: '24px'}}>{dueCustomers}</div></div>
        </div>
      </div>

      <div className="searchbar">
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="Search customer name or number" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--ink)'}}
        />
      </div>
      <div className="chips">
        <div className={\`chip \${filter === 'all' ? 'on' : ''}\`} onClick={() => setFilter('all')}>All ({customers.length})</div>
        <div className={\`chip \${filter === 'due' ? 'on' : ''}\`} onClick={() => setFilter('due')}>Due ({dueCustomers})</div>
        <div className={\`chip \${filter === 'settled' ? 'on' : ''}\`} onClick={() => setFilter('settled')}>Settled ({settledCustomers})</div>
      </div>

      <div className="card" style={{padding: '4px 16px'}}>
        {filteredCustomers.length > 0 ? filteredCustomers.map((c: any) => (
          <div className="list-item" key={c.id} onClick={() => setSelectedCustomer(c)} style={{cursor: 'pointer'}}>
            <div className="avatar" style={c.balance <= 0 ? {background: 'var(--green-soft)', color: 'var(--green)'} : {}}>{getInitials(c.name)}</div>
            <div style={{flex: 1}}>
              <div className="li-name">{c.name}</div>
              <div className="li-sub">{c.phone}</div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div className={\`amt \${c.balance > 0 ? 'red' : 'green'}\`}>{formatRupees(c.balance)}</div>
              <span className={\`badge \${c.balance > 0 ? 'due' : 'paid'}\`}>{c.balance > 0 ? 'Due' : 'Paid'}</span>
            </div>
          </div>
        )) : (
          <div className="text-sm text-[var(--ink-soft)] text-center py-4">No customers found</div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/features/ledger/LedgerTab.tsx', ledgerCode);
