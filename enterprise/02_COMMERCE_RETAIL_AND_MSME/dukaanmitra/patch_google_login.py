import re

with open("src/components/LoginScreen.tsx", "r") as f:
    content = f.read()

new_google = """const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("dukaanmitra_auth", JSON.stringify({ token }));
      onLoginSuccess(result.user.displayName || "My Shop", result.user.email || "No email", false);"""

content = re.sub(r'const result = await signInWithPopup\(auth, googleAuthProvider\);\s+const token = await result\.user\.getIdToken\(\);\s+// token can be used to authenticate with backend if needed\s+// Let the main App component fetch the actual shop details if returningonLoginSuccess\(result\.user\.displayName \|\| "My Shop", result\.user\.email \|\| "No email", false\);', new_google, content)

with open("src/components/LoginScreen.tsx", "w") as f:
    f.write(content)
