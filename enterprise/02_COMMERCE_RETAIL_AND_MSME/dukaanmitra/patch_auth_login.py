import re

with open("src/middleware/auth.ts", "r") as f:
    content = f.read()

# Make sure we don't accidentally create duplicate users, let's just make sure getOrCreateUser is solid

with open("src/db/users.ts", "r") as f:
    users_content = f.read()

if "getOrCreateUser" in users_content:
    print("Users DB seems fine.")
else:
    print("Error: getOrCreateUser not found.")
    
