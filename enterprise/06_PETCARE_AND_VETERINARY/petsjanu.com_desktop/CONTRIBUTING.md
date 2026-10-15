# 🤝 Contributing to PetJanu

Thank you for your interest in contributing to **PetJanu**! We welcome community contributions to improve pet safety, AI health guidance, and pet care tools across India.

---

## 🚀 How to Contribute

### 1. Reporting Bugs & Suggesting Features
- Search existing issues to ensure your topic hasn't already been discussed.
- Open a new issue describing the problem, reproduction steps, or suggested feature enhancement.

### 2. Development Setup

```bash
# Fork & clone the repository
git clone https://github.com/your-username/petjanu-app.git
cd petjanu-app

# Install dependencies
npm install

# Create local environment configuration
cp .env.example .env.local

# Run local dev server
npm run dev
```

### 3. Code Quality Guidelines
- **TypeScript:** Ensure strict typing across components and API routes. Run `npm run lint` before committing.
- **Styling:** Use Tailwind CSS utility classes directly.
- **Privacy & Security:** Do NOT hardcode personal data, test phone numbers, or secret keys in source code.

### 4. Submitting a Pull Request (PR)
- Create a feature branch (`git checkout -b feature/amazing-feature`).
- Ensure all linter checks pass (`npm run lint`).
- Open a Pull Request against the `main` branch with a clear description of your changes.
