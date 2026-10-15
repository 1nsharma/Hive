import re

with open("src/App.tsx", "r") as f:
    content = f.read()

new_interval = """      const interval = setInterval(() => {
        fetchDB().then(db => {
          setCustomers(db.customers || []);
          setProducts(db.products || []);
          setTransactions(db.transactions || []);
        }).catch(err => {
          if (err.message.includes("401") || err.message.includes("Unauthorized")) {
             localStorage.removeItem("dukaanmitra_auth");
             localStorage.removeItem("dukaanmitra_user");
             setUser(null);
          } else {
             console.warn("Auto-refresh failed", err);
          }
        });
      }, 5000);"""

content = re.sub(r'      const interval = setInterval\(\(\) => \{\n        fetchDB\(\)\.then\(db => \{\n          setCustomers\(db\.customers \|\| \[\]\);\n          setProducts\(db\.products \|\| \[\]\);\n          setTransactions\(db\.transactions \|\| \[\]\);\n        \}\)\.catch\(err => \{\n          console\.warn\("Auto-refresh failed", err\);\n          if \(err\.message\.includes\("401"\) \|\| err\.message\.includes\("Unauthorized"\)\) \{\n             localStorage\.removeItem\("dukaanmitra_auth"\);\n             localStorage\.removeItem\("dukaanmitra_user"\);\n             setUser\(null\);\n          \}\n        \}\);\n      \}, 5000\);', new_interval, content)

with open("src/App.tsx", "w") as f:
    f.write(content)
