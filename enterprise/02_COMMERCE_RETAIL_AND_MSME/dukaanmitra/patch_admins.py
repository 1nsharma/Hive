import re

with open("src/middleware/auth.ts", "r") as f:
    content = f.read()

content = content.replace("['founder@dukaanmitra.com', 'admin@dukaanmitra.com', 'amitsharmaanxt@gmail.com']", "['founder@dukaanmitra.com', 'admin@dukaanmitra.com', 'amitsharmaanxt@gmail.com', 'amitsharma99976@gmail.com']")

with open("src/middleware/auth.ts", "w") as f:
    f.write(content)
