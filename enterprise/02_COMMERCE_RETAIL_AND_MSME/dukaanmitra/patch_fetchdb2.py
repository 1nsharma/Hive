import re

with open("src/utils.ts", "r") as f:
    content = f.read()

new_fetchdb = """export async function fetchDB() {
  if (isGuestUser()) {
    return getGuestDB();
  }
  const response = await fetchWithAuth("/api/db");
  if (!response.ok) {
    const text = await response.text();
    console.error("fetchDB failed:", response.status, text);
    throw new Error(`Failed to load database (Status: ${response.status}): ${text}`);
  }
  return response.json();
}"""

content = re.sub(
    r'export async function fetchDB\(\) \{\n  if \(isGuestUser\(\)\) \{\n    return getGuestDB\(\);\n  \}\n  const response = await fetchWithAuth\("/api/db"\);\n  if \(!response\.ok\) \{\n    const text = await response\.text\(\);\n    console\.error\("fetchDB failed:", response\.status, text\);\n    throw new Error\("Failed to load database: " \+ text\);\n  \}\n  return response\.json\(\);\n\}',
    new_fetchdb,
    content
)

with open("src/utils.ts", "w") as f:
    f.write(content)
