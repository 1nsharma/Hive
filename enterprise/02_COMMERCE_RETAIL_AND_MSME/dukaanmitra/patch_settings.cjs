const fs = require('fs');

const settingsCode = `import { formatRupees } from "../../utils";

export default function SettingsTab({ user, transactions, customers, onLogout, setActiveTab }: any) {
  const shopName = user?.shopName || "My Shop";
  const ownerName = user?.ownerName || "Shopkeeper";
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthTx = transactions.filter((t: any) => t.date.startsWith(currentMonth));
  
  const totalSales = monthTx.filter((t: any) => t.type === 'sale').reduce((sum: number, t: any) => sum + t.amount, 0);
  
  // udhaar given logic would depend on transactions with paymentMode = 'khata'
  const udhaarGiven = monthTx.filter((t: any) => t.type === 'sale' && t.paymentMode === 'khata').reduce((sum: number, t: any) => sum + t.amount, 0);
  
  // udhaar collected logic would depend on type === 'payment'
  const udhaarCollected = monthTx.filter((t: any) => t.type === 'payment').reduce((sum: number, t: any) => sum + t.amount, 0);

  return (
    <div className="content h-full overflow-y-auto pb-[90px] p-4 hide-scrollbar">
      <h2 className="h">More</h2>
      <div className="stack-avatar">
        <div className="big-av">{getInitials(ownerName)}</div>
        <div>
          <div className="li-name" style={{fontSize: '16px'}}>{ownerName}</div>
          <div className="li-sub">{shopName}</div>
        </div>
      </div>

      <div className="eyebrow">Business</div>
      <div className="card" style={{padding: '4px 16px'}}>
        <div className="list-item cursor-pointer" onClick={() => setActiveTab('reports')}><span style={{width: '20px'}}>📊</span><div className="li-name" style={{flex: 1}}>Reports & analytics</div>›</div>
        <div className="list-item cursor-pointer" onClick={() => setActiveTab('ledger')}><span style={{width: '20px'}}>👥</span><div className="li-name" style={{flex: 1}}>Customers</div>›</div>
        <div className="list-item cursor-pointer"><span style={{width: '20px'}}>🧾</span><div className="li-name" style={{flex: 1}}>All bills</div>›</div>
        <div className="list-item cursor-pointer" style={{borderBottom: 'none'}} onClick={() => setActiveTab('whatsapp')}><span style={{width: '20px'}}>💬</span><div className="li-name" style={{flex: 1}}>WhatsApp settings</div>›</div>
      </div>

      <div className="eyebrow">This month</div>
      <div className="card">
        <div className="ledger-line"><span className="l">Total sales</span><span className="amt green">{formatRupees(totalSales)}</span></div>
        <div className="ledger-line"><span className="l">Udhaar given</span><span className="amt red">{formatRupees(udhaarGiven)}</span></div>
        <div className="ledger-line" style={{borderBottom: 'none'}}><span className="l">Udhaar collected</span><span className="amt ink">{formatRupees(udhaarCollected)}</span></div>
      </div>

      <div className="eyebrow">App</div>
      <div className="card" style={{padding: '4px 16px'}}>
        <div className="list-item cursor-pointer"><span style={{width: '20px'}}>🌐</span><div className="li-name" style={{flex: 1}}>Language — हिंदी / English</div>›</div>
        <div className="list-item cursor-pointer" onClick={() => alert("Settings coming soon")}><span style={{width: '20px'}}>🔒</span><div className="li-name" style={{flex: 1}}>Account & security</div>›</div>
        <div className="list-item cursor-pointer" style={{borderBottom: 'none'}} onClick={onLogout}><span style={{width: '20px'}}>🚪</span><div className="li-name text-rose-600" style={{flex: 1}}>Sign Out</div></div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/features/settings/SettingsTab.tsx', settingsCode);
