import re

with open("src/components/OnboardingWizard.tsx", "r") as f:
    content = f.read()

# Update handleComplete to save to DB
if "fetchWithAuth" not in content:
    content = content.replace('import { Store, ShoppingBag, Truck, Utensils, Zap, CheckCircle, ArrowRight } from "lucide-react";', 'import { Store, ShoppingBag, Truck, Utensils, Zap, CheckCircle, ArrowRight } from "lucide-react";\nimport { fetchWithAuth } from "../utils";')

new_complete = """
  const handleComplete = async () => {
    try {
      const config = {
        businessName,
        category: selectedCategory,
      };
      
      await fetchWithAuth("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      
      onComplete(config);
    } catch (e) {
      console.error("Failed to save settings", e);
      // Still proceed
      onComplete({ businessName, category: selectedCategory });
    }
  };
"""

content = re.sub(
    r'  const handleComplete = \(\) => \{\n    onComplete\(\{\n      businessName,\n      category: selectedCategory,\n    \}\);\n  \};',
    new_complete,
    content
)

with open("src/components/OnboardingWizard.tsx", "w") as f:
    f.write(content)
