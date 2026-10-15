import re

with open("src/components/LoginScreen.tsx", "r") as f:
    content = f.read()

new_handle_google_login = """
  const handleGoogleLogin = async () => {
    if (!isOnline) {
      setError("इंटरनेट कनेक्शन नहीं है। कृपया अपना नेटवर्क जांचें।");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      
      // Save token for API auth
      localStorage.setItem("dukaanmitra_auth", JSON.stringify({ token }));
      
      // Let the main App component fetch the actual shop details if returning
      onLoginSuccess(result.user.displayName || "My Shop", result.user.email || "No email", false);
    } catch (err: any) {
"""

content = re.sub(
    r'  const handleGoogleLogin = async \(\) => \{.*?\n    try \{\n      const result = await signInWithPopup\(auth, googleAuthProvider\);\n      const token = await result\.user\.getIdToken\(\);\n.*?\n      onLoginSuccess\(result\.user\.displayName \|\| "My Shop", result\.user\.email \|\| "No email", false\);\n    \} catch \(err: any\) \{',
    new_handle_google_login,
    content,
    flags=re.DOTALL
)

with open("src/components/LoginScreen.tsx", "w") as f:
    f.write(content)
