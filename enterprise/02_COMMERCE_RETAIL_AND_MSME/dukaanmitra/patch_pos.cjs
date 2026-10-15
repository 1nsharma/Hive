const fs = require('fs');

const posCode = `import { useState } from "react";
import { formatRupees, addTransaction, addCustomer } from "../../utils";

export default function POSTab({ customers, products, onRefreshDB, user }: any) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const filteredCustomers = customers.filter((c: any) => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredProducts = products.filter((p: any) => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, {...product, quantity: 1}];
    });
    setProductSearch("");
  };

  const handleSaveBill = async () => {
    if (cart.length === 0) return alert("Add items to bill");
    
    let cId = selectedCustomerId;
    if (!cId && customerSearch) {
      // create quick customer
      const newC = await addCustomer({ name: customerSearch, phone: "", address: "" });
      cId = newC.id;
    }

    if (paymentMethod === 'khata' && !cId) {
      return alert("Select customer for Khata");
    }

    // record sale
    for (const item of cart) {
      await addTransaction({
        type: 'sale',
        amount: item.price * item.quantity,
        notes: \`Bill - \${item.name} (\${item.quantity})\`,
        customerId: cId || undefined,
        productId: item.id,
        paymentMode: paymentMethod
      });
    }

    alert("Bill saved successfully!");
    setCart([]);
    setCustomerSearch("");
    setSelectedCustomerId("");
    onRefreshDB();
  };

  return (
    <div className="content h-full overflow-y-auto pb-[90px] p-4 hide-scrollbar">
      <h2 className="h">New bill</h2>
      <p className="sub">Fill it in manually or pick items.</p>

      <div className="field text">
        <label>Customer</label>
        <input 
          type="text" 
          placeholder="Search or type name" 
          value={customerSearch}
          onChange={(e) => {
            setCustomerSearch(e.target.value);
            const found = customers.find((c: any) => c.name.toLowerCase() === e.target.value.toLowerCase());
            if (found) setSelectedCustomerId(found.id);
            else setSelectedCustomerId("");
          }}
        />
        {customerSearch && !selectedCustomerId && filteredCustomers.length > 0 && (
          <div className="card" style={{marginTop: '4px', padding: '8px', zIndex: 10}}>
            {filteredCustomers.slice(0,3).map((c: any) => (
              <div key={c.id} className="py-2 border-b border-[var(--paper-line)] last:border-0 cursor-pointer text-sm" onClick={() => {
                setCustomerSearch(c.name);
                setSelectedCustomerId(c.id);
              }}>
                {c.name} - {c.phone}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="eyebrow" style={{marginTop: '4px'}}>Items in Bill</div>
      {cart.length > 0 ? (
        <div className="card" style={{padding: '4px 16px'}}>
          {cart.map((item, idx) => (
            <div className="ledger-line" key={idx} style={{borderBottom: idx === cart.length - 1 ? 'none' : ''}}>
              <span className="l">{item.name} · {item.quantity} {item.unit}</span>
              <span className="amt ink">{formatRupees(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{padding: '16px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: '13px'}}>
          No items added yet
        </div>
      )}

      <div className="field text mt-4">
        <input 
          type="text" 
          placeholder="+ Search product to add" 
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
        />
        {productSearch && filteredProducts.length > 0 && (
          <div className="card" style={{marginTop: '4px', padding: '8px'}}>
            {filteredProducts.slice(0,5).map((p: any) => (
              <div key={p.id} className="py-2 border-b border-[var(--paper-line)] last:border-0 cursor-pointer flex justify-between text-sm" onClick={() => addToCart(p)}>
                <span>{p.name} (₹{p.price})</span>
                <span className="text-[var(--ink-soft)]">{p.stock} in stock</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="field mt-4">
        <label>Total amount</label>
        <input type="text" value={formatRupees(total)} readOnly />
      </div>

      <div className="eyebrow">Payment</div>
      <div className="chips">
        <div className={\`chip \${paymentMethod === 'cash' ? 'on' : ''}\`} onClick={() => setPaymentMethod('cash')}>Cash</div>
        <div className={\`chip \${paymentMethod === 'khata' ? 'on' : ''}\`} onClick={() => setPaymentMethod('khata')}>Add to Khata</div>
        <div className={\`chip \${paymentMethod === 'upi' ? 'on' : ''}\`} onClick={() => setPaymentMethod('upi')}>UPI</div>
      </div>

      <button className="btn primary" onClick={handleSaveBill} disabled={cart.length === 0}>Save bill</button>
      <button className="btn wa" style={{marginTop: '10px'}} onClick={handleSaveBill} disabled={cart.length === 0}>💬 Save & send on WhatsApp</button>
    </div>
  );
}
`;

fs.writeFileSync('src/features/pos/POSTab.tsx', posCode);
