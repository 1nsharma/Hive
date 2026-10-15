import re

with open("src/App.tsx", "r") as f:
    content = f.read()

new_refresh = """  const handleRefreshDB = async () => {
    setDbLoading(true);
    setDbError("");
    try {
      const db = await fetchDB();
      setCustomers(db.customers || []);
      setProducts(db.products || []);
      setTransactions(db.transactions || []);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
         localStorage.removeItem("dukaanmitra_auth");
         localStorage.removeItem("dukaanmitra_user");
         setUser(null);
         return;
      }
      setDbError("सर्वर से डेटा लोड करने में त्रुटि: " + err.message);
    } finally {
      setDbLoading(false);
    }
  };"""

content = re.sub(r'  const handleRefreshDB = async \(\) => \{.*?setDbLoading\(false\);\n    \}\n  \};', new_refresh, content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)
