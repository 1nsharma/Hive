import re

with open("src/db/schema.ts", "r") as f:
    content = f.read()

content = content.replace("({ many }) => ({", "({ many, one }) => ({")
content = content.replace("relations.one(userSettings)", "one(userSettings)")

with open("src/db/schema.ts", "w") as f:
    f.write(content)
