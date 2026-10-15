const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('🚀 Building Web Assets...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📱 Syncing Capacitor...');
  execSync('npx cap sync android', { stdio: 'inherit' });

  const destDir = path.join(__dirname, '../public/downloads');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const gradleCmd = process.platform === 'win32' ? '.\\gradlew.bat' : './gradlew';
  const apkPath = path.join(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');
  const destPath = path.join(destDir, 'petjanu-v1.2.0-beta.apk');

  if (fs.existsSync(path.join(__dirname, '../android/gradlew')) || fs.existsSync(path.join(__dirname, '../android/gradlew.bat'))) {
    console.log('🛠️ Compiling Android APK...');
    try {
      execSync(`cd android && ${gradleCmd} assembleDebug`, { stdio: 'inherit' });
      if (fs.existsSync(apkPath)) {
        console.log('📦 Copying compiled APK to public/downloads...');
        fs.copyFileSync(apkPath, destPath);
        console.log(`✅ Success! APK package ready at: ${destPath}`);
      }
    } catch (gradleErr) {
      console.warn('⚠️ Android SDK not configured locally. Native capacitor assets are fully synced. To compile a standalone .apk binary locally, set ANDROID_HOME or open the ./android folder in Android Studio.');
    }
  } else {
    console.log('📦 Android project directory not found. Please run npx cap add android first.');
  }
} catch (error) {
  console.error('❌ Build process encountered an error:', error.message);
  process.exitCode = 1;
}
