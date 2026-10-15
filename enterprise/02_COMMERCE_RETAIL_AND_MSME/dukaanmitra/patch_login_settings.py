import re

with open("src/App.tsx", "r") as f:
    content = f.read()

new_handle_login = """
  const handleLoginSuccess = async (shopName: string, phone: string, isGuest?: boolean) => {
    let isAdmin = false;
    let businessConfig = undefined;
    let finalShopName = shopName;
    
    if (!isGuest) {
      // Check admin status and fetch existing data
      const token = localStorage.getItem("dukaanmitra_auth");
      if (token) {
        try {
          const authData = JSON.parse(token);
          
          const [meRes, settingsRes] = await Promise.all([
             fetchWithAuth("/api/auth/me").catch(() => null),
             fetchWithAuth("/api/settings").catch(() => null)
          ]);
          
          if (meRes && meRes.ok) {
            const data = await meRes.json();
            isAdmin = data.isAdmin;
          }
          
          if (settingsRes && settingsRes.ok) {
             const settingsData = await settingsRes.json();
             if (settingsData.settings && settingsData.settings.businessName) {
                finalShopName = settingsData.settings.businessName;
                businessConfig = {
                   businessName: settingsData.settings.businessName,
                   phone: settingsData.settings.phone,
                   skipOnboarding: true
                };
             } else {
                 // Try to fetch DB right now to see if we have an existing shop name / config (for backward compatibility before settings table)
                 try {
                     const db = await fetchDB();
                     if ((db.customers && db.customers.length > 0) || (db.products && db.products.length > 0)) {
                         businessConfig = { businessName: shopName, skipOnboarding: true };
                     }
                 } catch(e) {}
             }
          }
          
        } catch (e) {
          console.error("Failed to fetch user configuration", e);
        }
      }
    }

    const newUser = { shopName: finalShopName, phone, isGuest: !!isGuest, isAdmin, businessConfig };
    localStorage.setItem("dukaanmitra_user", JSON.stringify(newUser));
"""

content = re.sub(
    r'  const handleLoginSuccess = async \(shopName: string, phone: string, isGuest\?: boolean\) => \{.*?const newUser = \{ shopName, phone, isGuest: !!isGuest, isAdmin \};\n    localStorage\.setItem\("dukaanmitra_user", JSON\.stringify\(newUser\)\);',
    new_handle_login,
    content,
    flags=re.DOTALL
)

with open("src/App.tsx", "w") as f:
    f.write(content)
