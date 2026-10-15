import re

with open("src/components/AdminConsole.tsx", "r") as f:
    content = f.read()

if "const [aiLogs, setAiLogs]" not in content:
    content = content.replace("const [activeTab, setActiveTab] = useState(\"overview\");", "const [activeTab, setActiveTab] = useState(\"overview\");\n  const [aiLogs, setAiLogs] = useState<any[]>([]);")

with open("src/components/AdminConsole.tsx", "w") as f:
    f.write(content)

with open("server.ts", "r") as f:
    server = f.read()
    
server = server.replace("const shopName = req.dbUser!.name || \"DukaanMitra Shop\";", "const shopName = \"DukaanMitra Shop\";")
    
with open("server.ts", "w") as f:
    f.write(server)
