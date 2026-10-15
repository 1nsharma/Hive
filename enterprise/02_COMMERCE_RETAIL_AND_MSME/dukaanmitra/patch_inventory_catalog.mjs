import fs from 'fs';
let code = fs.readFileSync('src/components/InventoryTab.tsx', 'utf8');

const newCode = `  const handleGenerateCatalog = async () => {
    setGeneratingCatalog(true);
    setError("");
    try {
      const authData = localStorage.getItem("dukaanmitra_auth");
      const token = authData ? JSON.parse(authData).token : "";
      
      const response = await fetch("/api/ai/suggest-catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": \`Bearer \${token}\`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate catalog");
      }
      
      const data = await response.json();
      setAiCatalogData(data);
    } catch (err: any) {
      console.error(err);
      setError("AI Catalog generation failed.");
    } finally {
      setGeneratingCatalog(false);
    }
  };

  const handleApplyAICatalogItem = (item: any) => {
    setNewName(item.name);
    setNewUnit(item.unit || "pcs");
    setNewPrice(item.suggestedPrice || 0);
    setNewCostPrice(item.suggestedCostPrice || 0);
    setNewStock(10);
    setNewThreshold(5);
    setShowAICatalogModal(false);
    setShowAddModal(true);
  };

  // Handle Add Product`;

code = code.replace(`  // Handle Add Product`, newCode);
fs.writeFileSync('src/components/InventoryTab.tsx', code);
