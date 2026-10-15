const fs = require('fs');
let content = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

// Patch handleVerifyOtp
content = content.replace(
  /if \(otp === "1234" \|\| otp === "4321" \|\| otp === "0000" \|\| phone === "9876543210"\) \{\s+onLoginSuccess\(shopName, `\+91 \$\{phone\}`, false\);\s+\} else \{/,
  `if (otp === "1234" || otp === "4321" || otp === "0000" || phone === "9876543210") {
        const res = await fetch("/api/auth/mock-login", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ phone, name: shopName })
        });
        if (res.ok) {
           const data = await res.json();
           localStorage.setItem("dukaanmitra_auth", JSON.stringify({ token: data.token }));
        }
        onLoginSuccess(shopName, \`+91 \${phone}\`, false);
      } else {`
);

// Patch handleGoogleLogin
content = content.replace(
  /const result = await signInWithPopup\(auth, googleAuthProvider\);\s+const token = await result\.user\.getIdToken\(\);\s+\/\/ token can be used to authenticate with backend if needed\s+\/\/ Let the main App component fetch the actual shop details if returningonLoginSuccess\(result\.user\.displayName \|\| "My Shop", result\.user\.email \|\| "No email", false\);/,
  `const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      // Use standard google token
      localStorage.setItem("dukaanmitra_auth", JSON.stringify({ token }));
      onLoginSuccess(result.user.displayName || "My Shop", result.user.email || "No email", false);`
);

fs.writeFileSync('src/components/LoginScreen.tsx', content);
