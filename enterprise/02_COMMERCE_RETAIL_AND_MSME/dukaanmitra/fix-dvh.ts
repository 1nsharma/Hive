import fs from 'fs';

let loginStr = fs.readFileSync('src/components/LoginScreen.tsx', 'utf-8');
loginStr = loginStr.replace(/min-h-screen/g, 'min-h-[100dvh]');
fs.writeFileSync('src/components/LoginScreen.tsx', loginStr);

let onbStr = fs.readFileSync('src/components/OnboardingWizard.tsx', 'utf-8');
onbStr = onbStr.replace(/min-h-screen/g, 'min-h-[100dvh]');
fs.writeFileSync('src/components/OnboardingWizard.tsx', onbStr);

