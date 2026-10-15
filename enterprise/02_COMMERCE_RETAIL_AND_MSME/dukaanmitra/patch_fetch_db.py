import re

with open("src/utils.ts", "r") as f:
    content = f.read()

new_fetch_db = """export async function fetchDB() {
  if (isGuestUser()) {
    return getGuestDB();
  }
  const response = await fetchWithAuth("/api/db");
  if (response.status === 401) {
    throw new Error("401 Unauthorized: Missing token");
  }
  if (!response.ok) {
    const text = await response.text();
    console.error("fetchDB failed:", response.status, text);
    throw new Error(`Failed to load database (Status: ${response.status}): ${text}`);
  }
  return response.json();
}"""

content = re.sub(r'export async function fetchDB\(\) \{\s*if \(isGuestUser\(\)\) \{\s*return getGuestDB\(\);\s*\}\s*const response = await fetchWithAuth\("/api/db"\);\s*if \(!response\.ok\) \{\s*const text = await response\.text\(\);\s*console\.error\("fetchDB failed:", response\.status, text\);\s*throw new Error\(`Failed to load database \(Status: \$\{response\.status\}\): \$\{text\}`\);\s*\}\s*return response\.json\(\);\s*\}', new_fetch_db, content)

with open("src/utils.ts", "w") as f:
    f.write(content)
