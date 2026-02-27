# Camera Setup for Sahayak AI Mobile

The camera functionality requires additional native setup. Choose one of these options:

## Option 1: React Native Vision Camera (Recommended)

### Install
```bash
npm install react-native-vision-camera
cd ios && pod install && cd ..
```

### Android Setup
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

### iOS Setup
Add to `ios/SahayakAIMobile/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan documents</string>
```

### Update CameraScreen.tsx
```typescript
import { Camera, useCameraDevices } from 'react-native-vision-camera';

// Replace placeholder with actual camera implementation
```

## Option 2: Expo Camera (If using Expo)

### Install
```bash
npx expo install expo-camera
```

### Usage
```typescript
import { Camera } from 'expo-camera';
```

## Option 3: Use Document Picker Only

The app already has `react-native-document-picker` installed. Users can:
- Select photos from gallery
- Use system camera app
- Upload existing files

This works without additional camera setup!

## Current Implementation

The CameraScreen currently shows a placeholder. To enable full camera:

1. Choose Option 1 or 2 above
2. Update `src/screens/CameraScreen.tsx` with actual camera code
3. Test on physical device (camera doesn't work in simulator)

## Quick Start (No Camera)

You can run the app without camera by:
1. Using document picker for uploads
2. Testing other features first
3. Adding camera later when needed

The app is fully functional without camera - users can still upload documents via file picker!
