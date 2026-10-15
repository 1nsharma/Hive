import re

with open("src/components/WhatsAppConnection.tsx", "r") as f:
    content = f.read()

new_content = content.replace('const res = await fetch("/api/whatsapp/status", { headers });', 'const res = await fetchWithAuth("/api/whatsapp/status");')
new_content = new_content.replace('const res = await fetch("/api/whatsapp/connect", { \n        method: "POST",\n        headers\n      });', 'const res = await fetchWithAuth("/api/whatsapp/connect", { \n        method: "POST"\n      });')
new_content = new_content.replace('await fetch("/api/whatsapp/disconnect", { \n        method: "POST",\n        headers\n      });', 'await fetchWithAuth("/api/whatsapp/disconnect", { \n        method: "POST"\n      });')

new_content = new_content.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect } from "react";\nimport { fetchWithAuth } from "../utils";')

# Remove headers variables and references to token if they are no longer needed
new_content = re.sub(r'const headers: Record<string, string> = { "Content-Type": "application/json" };\n\s*if \(token\) headers\["Authorization"\] = `Bearer \${token}`;\n\s*', '', new_content)

with open("src/components/WhatsAppConnection.tsx", "w") as f:
    f.write(new_content)
