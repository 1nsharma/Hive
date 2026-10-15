import re

with open("src/App.tsx", "r") as f:
    content = f.read()

new_refresh = """    } catch (err: any) {
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
         localStorage.removeItem("dukaanmitra_auth");
         localStorage.removeItem("dukaanmitra_user");
         setUser(null);
         return;
      }
      console.error(err);
      setDbError("सर्वर से डेटा लोड करने में त्रुटि: " + err.message);
    } finally {"""

content = re.sub(r'    \} catch \(err: any\) \{\n      console\.error\(err\);\n      if \(err\.message\.includes\("401"\) \|\| err\.message\.includes\("Unauthorized"\)\) \{\n         localStorage\.removeItem\("dukaanmitra_auth"\);\n         localStorage\.removeItem\("dukaanmitra_user"\);\n         setUser\(null\);\n         return;\n      \}\n      setDbError\("सर्वर से डेटा लोड करने में त्रुटि: " \+ err\.message\);\n    \} finally \{', new_refresh, content)

with open("src/App.tsx", "w") as f:
    f.write(content)
