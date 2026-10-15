import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Make sure that auth token is available immediately
content = content.replace("const handleLoginSuccess = async (shopName: string, phone: string, isGuest?: boolean) => {", "const handleLoginSuccess = async (shopName: string, phone: string, isGuest?: boolean) => {\n    // Small delay to ensure localStorage is flushed\n    await new Promise(r => setTimeout(r, 100));")

with open("src/App.tsx", "w") as f:
    f.write(content)
