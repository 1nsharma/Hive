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
             fetchWithAuth("/api/auth/me"),
             fetchWithAuth("/api/settings")
          ]);
          
          if (meRes.ok) {
            const data = await meRes.json();
            isAdmin = data.isAdmin;
          }
          
          if (settingsRes.ok) {
             const settingsData = await settingsRes.json();
             if (settingsData.settings) {
                finalShopName = settingsData.settings.businessName;
                businessConfig = {
                   businessName: settingsData.settings.businessName,
                   phone: settingsData.settings.phone,
                   skipOnboarding: true
                };
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
    r'  const handleLoginSuccess = async \(shopName: string, phone: string, isGuest\?: boolean\) => \{.*?const newUser = \{ shopName: finalShopName, phone, isGuest: !!isGuest, isAdmin, businessConfig \};\n    \n    localStorage\.setItem\("dukaanmitra_user", JSON\.stringify\(newUser\)\);',
    new_handle_login,
    content,
    flags=re.DOTALL
)

with open("src/App.tsx", "w") as f:
    f.write(content)
