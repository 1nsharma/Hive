const fs = require('fs');

const inventoryCode = `import { useState } from "react";
import { formatRupees } from "../../utils";

export default function InventoryTab({ products, onRefreshDB }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const lowStockCount = products.filter((p: any) => p.stock <= (p.lowStockThreshold || 10)).length;

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'low') return p.stock <= (p.lowStockThreshold || 10);
    return true;
  });

  return (
    <div className="content h-full overflow-y-auto pb-[90px] p-4 hide-scrollbar">
      <h2 className="h">Inventory</h2>
      <p className="sub">{products.length} items · {lowStockCount} running low</p>

      <div className="searchbar">
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="Search item" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--ink)'}}
        />
      </div>
      <div className="chips">
        <div className={\`chip \${filter === 'all' ? 'on' : ''}\`} onClick={() => setFilter('all')}>All</div>
        <div className={\`chip \${filter === 'low' ? 'on' : ''}\`} onClick={() => setFilter('low')}>Low stock ({lowStockCount})</div>
      </div>

      <div className="card" style={{padding: '4px 16px'}}>
        {filteredProducts.length > 0 ? filteredProducts.map((p: any, idx: number) => {
          const isLow = p.stock <= (p.lowStockThreshold || 10);
          const percent = Math.min(100, Math.max(0, (p.stock / (p.lowStockThreshold || 10) * 100) / 2));
          return (
            <div className="item-row" key={p.id} style={{borderBottom: idx === filteredProducts.length - 1 ? 'none' : ''}}>
              <div className="item-thumb" style={{background: isLow ? 'var(--red-soft)' : 'var(--gold-soft)'}}></div>
              <div style={{flex: 1}}>
                <div className="li-name">{p.name} · {p.unit}</div>
                <div className="li-sub" style={isLow ? {color: 'var(--red)'} : {}}>
                  {isLow ? \`Only \${p.stock} left — reorder\` : \`\${p.stock} in stock\`}
                </div>
                {isLow && (
                  <div className="stock-bar"><div style={{width: \`\${percent}%\`, background: 'var(--red)'}}></div></div>
                )}
              </div>
              <div className="amt ink">{formatRupees(p.price)}</div>
            </div>
          );
        }) : (
          <div className="text-sm text-[var(--ink-soft)] text-center py-4">No items found</div>
        )}
      </div>
      <button className="btn dark" onClick={() => alert("Add product UI coming soon")}>+ Add new item</button>
    </div>
  );
}
`;

fs.writeFileSync('src/features/inventory/InventoryTab.tsx', inventoryCode);
