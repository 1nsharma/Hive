import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# We need to update `handleLoginSuccess` to fetch the user's configuration if it exists.
# We also need to log the authentication details properly.

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
          
          // Parallel fetch for user info and db
          const [meRes, dbRes] = await Promise.all([
             fetchWithAuth("/api/auth/me"),
             fetchWithAuth("/api/db") // Just to check if there is data, wait we already have fetchDB
          ]);
          
          if (meRes.ok) {
            const data = await meRes.json();
            isAdmin = data.isAdmin;
          }
          
          // Try to fetch DB right now to see if we have an existing shop name / config
          // For now we don't have a dedicated settings table in schema.ts, but let's assume
          // we can determine if they have data based on customers/products count
          try {
             const db = await fetchDB();
             if ((db.customers && db.customers.length > 0) || (db.products && db.products.length > 0)) {
                // User has data, bypass onboarding by setting a dummy config if not present
                businessConfig = { businessName: shopName, skipOnboarding: true };
             }
          } catch(e) {}
          
        } catch (e) {
          console.error("Failed to check admin status", e);
        }
      }
    }

    const newUser = { shopName: finalShopName, phone, isGuest: !!isGuest, isAdmin, businessConfig };
    
    localStorage.setItem("dukaanmitra_user", JSON.stringify(newUser));
"""

content = re.sub(
    r'  const handleLoginSuccess = async \(shopName: string, phone: string, isGuest\?: boolean\) => \{.*?const newUser = \{ shopName, phone, isGuest: !!isGuest, isAdmin \};\n\n    localStorage\.setItem\("dukaanmitra_user", JSON\.stringify\(newUser\)\);',
    new_handle_login,
    content,
    flags=re.DOTALL
)

with open("src/App.tsx", "w") as f:
    f.write(content)
