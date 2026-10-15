import fs from 'fs';
let content = fs.readFileSync('src/components/POSTab.tsx', 'utf-8');

// The handleAddProduct is missing in the code, let's inject it before the return statement

if (!content.includes('const handleAddProduct')) {
  const insertIndex = content.lastIndexOf('return (');
  
  const handleMethod = `
  const handleAddProduct = async (e: any) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    setIsAddingProduct(true);
    try {
      const pPrice = Number(newProdPrice);
      const pStock = Number(newProdStock) || 0;
      await addProduct(newProdName, pStock, "piece", pPrice, pPrice * 0.8, 5);
      if (onRefreshDB) onRefreshDB();
      setShowAddProduct(false);
      setNewProdName("");
      setNewProdPrice("");
      setNewProdStock("");
    } catch (err) {
      alert("उत्पाद जोड़ने में विफल।");
    } finally {
      setIsAddingProduct(false);
    }
  };

  `;
  
  content = content.slice(0, insertIndex) + handleMethod + content.slice(insertIndex);
  fs.writeFileSync('src/components/POSTab.tsx', content);
}
