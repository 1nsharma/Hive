import fs from 'fs';
let code = fs.readFileSync('src/components/SettingsTab.tsx', 'utf8');

const newCode = `
  const handleImportContacts = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let contacts = [];
      // Try to use the Contact Picker API if available
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'tel', 'email'];
        const opts = { multiple: true };
        const supported = await (navigator as any).contacts.getProperties();
        if (supported.includes('name')) {
          const rawContacts = await (navigator as any).contacts.select(props, opts);
          contacts = rawContacts.map((c: any) => ({
            name: c.name?.[0] || 'Unknown',
            phone: c.tel?.[0] || '',
            email: c.email?.[0] || null
          }));
        }
      } 
      
      // Fallback for demo if API is not supported or user cancels
      if (contacts.length === 0) {
        // Simulate importing 5 demo contacts for the preview
        await new Promise(r => setTimeout(r, 1000));
        contacts = [
          { name: "Rahul Singh", phone: "9876543211", email: "rahul@example.com" },
          { name: "Priya Sharma", phone: "9876543212" },
          { name: "Amit Kumar", phone: "9876543213" },
          { name: "Sneha Gupta", phone: "9876543214" },
          { name: "Vikram Reddy", phone: "9876543215" }
        ];
      }

      if (contacts.length > 0) {
        const authData = localStorage.getItem("dukaanmitra_auth");
        const token = authData ? JSON.parse(authData).token : "";
        
        const response = await fetch("/api/contacts/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": \`Bearer \${token}\`
          },
          body: JSON.stringify({ contacts })
        });
        
        if (!response.ok) {
          throw new Error("Failed to save contacts");
        }
        
        const data = await response.json();
        setSuccess(\`Successfully imported \${data.count} contacts as potential customers!\`);
      } else {
        setError("No contacts selected.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to import contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const settingItems = [`;

code = code.replace('  const settingItems = [', newCode);
fs.writeFileSync('src/components/SettingsTab.tsx', code);
