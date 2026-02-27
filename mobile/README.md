# Sahayak AI Mobile App

React Native mobile application (CLI - No Expo) for Sahayak AI platform.

## Prerequisites

- Node.js 20+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, Mac only)
- CocoaPods (for iOS)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. iOS Setup (Mac only)
```bash
cd ios
pod install
cd ..
```

### 3. Android Setup
Make sure Android Studio is installed with:
- Android SDK
- Android SDK Platform
- Android Virtual Device

## Running the App

### Android
```bash
npm run android
```

### iOS (Mac only)
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

## Features

- ✅ Native navigation (React Navigation)
- ✅ Camera document scanning
- ✅ Offline storage with AsyncStorage
- ✅ Voice interface (speech-to-text, text-to-speech)
- ✅ Push notifications (Firebase)
- ✅ Multi-language support (8 Indian languages)
- ✅ Document upload and analysis
- ✅ Compliance tracking
- ✅ Auto-sync when online

## Project Structure

```
mobile/
├── src/
│   ├── components/      # Reusable components
│   │   └── Button.tsx
│   ├── screens/         # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   ├── ComplianceScreen.tsx
│   │   └── CameraScreen.tsx
│   ├── services/        # Business logic
│   │   ├── OfflineStorage.ts
│   │   ├── VoiceService.ts
│   │   └── NotificationService.ts
│   └── utils/           # Helper functions
├── android/             # Android native code
├── ios/                 # iOS native code
├── App.tsx              # Root component
└── index.js             # Entry point
```

## Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Android AAB (for Play Store)
```bash
cd android
./gradlew bundleRelease
```

### iOS (Mac only)
1. Open `ios/SahayakAIMobile.xcworkspace` in Xcode
2. Select Product → Archive
3. Distribute to App Store

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## Environment Variables

Create `.env` file:
```
API_URL=https://your-api-gateway-url.amazonaws.com/prod
AWS_REGION=ap-south-1
```

## Permissions

### Android (android/app/src/main/AndroidManifest.xml)
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- INTERNET
- RECORD_AUDIO

### iOS (ios/SahayakAIMobile/Info.plist)
- NSCameraUsageDescription
- NSPhotoLibraryUsageDescription
- NSMicrophoneUsageDescription
- NSLocationWhenInUseUsageDescription

## Testing

```bash
npm test
```

## License

MIT
