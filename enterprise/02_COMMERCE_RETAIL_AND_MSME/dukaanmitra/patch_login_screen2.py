import re

with open("src/components/LoginScreen.tsx", "r") as f:
    content = f.read()

# Add a check to fetch user by email/phone to see if they are a new or returning user
# Currently login passes the user details directly to App.tsx via onLoginSuccess

new_content = re.sub(
    r'onLoginSuccess\(result.user.displayName \|\| "My Shop", result.user.email \|\| "No email", false\);',
    r'// Let the main App component fetch the actual shop details if returning\nonLoginSuccess(result.user.displayName || "My Shop", result.user.email || "No email", false);',
    content
)

with open("src/components/LoginScreen.tsx", "w") as f:
    f.write(new_content)
