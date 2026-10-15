import re

with open("server.ts", "r") as f:
    content = f.read()

mock_endpoint = """
app.post("/api/auth/mock-login", async (req, res) => {
  try {
    const { phone, email, name } = req.body;
    const identifier = phone || email || 'demo';
    
    // Create a custom JWT token
    const token = jwt.sign(
      { type: 'admin_ssh', email: identifier, name }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
"""

if "/api/auth/mock-login" not in content:
    content = content.replace("app.post(\"/api/auth/send-ssh\"", mock_endpoint + "\napp.post(\"/api/auth/send-ssh\"")
    with open("server.ts", "w") as f:
        f.write(content)
    print("Added mock login endpoint.")
else:
    print("Mock login already exists.")
