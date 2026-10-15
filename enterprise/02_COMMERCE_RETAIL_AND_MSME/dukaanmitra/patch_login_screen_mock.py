import re

with open("src/components/LoginScreen.tsx", "r") as f:
    content = f.read()

# Fix handleEmailLogin
new_email = """
    try {
      const res = await fetch("/api/auth/mock-login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, name: shopName })
      });
      if (res.ok) {
         const data = await res.json();
         localStorage.setItem("dukaanmitra_auth", JSON.stringify({ token: data.token }));
      }
      onLoginSuccess(shopName, email, false);
    } catch (err: any) {
"""
content = re.sub(
    r'    try \{\n      await new Promise\(\(resolve\) => setTimeout\(resolve, 1000\)\);\n      onLoginSuccess\(shopName, email, false\);\n    \} catch \(err: any\) \{',
    new_email,
    content
)

# Fix handleVerifyOtp
new_verify_otp = """
    try {
      const res = await fetch("/api/auth/mock-login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ phone, name: shopName })
      });
      if (res.ok) {
         const data = await res.json();
         localStorage.setItem("dukaanmitra_auth", JSON.stringify({ token: data.token }));
      }
      onLoginSuccess(shopName, phone, false);
    } catch (err: any) {
"""
content = re.sub(
    r'    try \{\n      await new Promise\(\(resolve\) => setTimeout\(resolve, 1000\)\);\n      onLoginSuccess\(shopName, phone, false\);\n    \} catch \(err: any\) \{',
    new_verify_otp,
    content
)

with open("src/components/LoginScreen.tsx", "w") as f:
    f.write(content)
