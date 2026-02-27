# Mobile App Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
cd mobile
npm install
```

This will install all required packages including:
- React Native core
- Navigation libraries
- Vector icons
- Document picker
- And more...

### 2. Fix TypeScript Errors

After `npm install`, TypeScript errors should disappear. If you still see errors:

```bash
# Clear cache
rm -rf node_modules
npm install

# For iOS (Mac only)
cd ios
pod install
cd ..
```

### 3. Run the App

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
npm run ios
```

## Troubleshooting TypeScript Errors

### Error: "Cannot find module 'react-native'"
**Solution:** Run `npm install` in the mobile directory

### Error: "Cannot find module 'react-native-vector-icons'"
**Solution:** 
```bash
npm install react-native-vector-icons
# For iOS
cd ios && pod install && cd ..
```

### Error: "Cannot find type definition file for 'jest'"
**Solution:** This is normal before `npm install`. After installation, it will be resolved.

### Error: "Cannot find type definition file for 'react-native'"
**Solution:** Run `npm install` - the `@types/react-native` package will be installed automatically.

## Why Are There Errors Before npm install?

TypeScript shows errors because:
1. Dependencies haven't been installed yet
2. Type definition files are missing
3. node_modules folder doesn't exist

**This is normal!** Just run `npm install` and all errors will be fixed.

## Verification

After `npm install`, verify everything is working:

```bash
# Check if node_modules exists
ls node_modules

# Check if types are installed
ls node_modules/@types

# Try running the app
npm run android  # or npm run ios
```

## Next Steps

1. ✅ Run `npm install`
2. ✅ Wait for installation to complete
3. ✅ TypeScript errors should disappear
4. ✅ Run the app with `npm run android` or `npm run ios`

## Still Having Issues?

Check the main README.md for detailed setup instructions or see CAMERA_SETUP.md for camera-specific setup.


## Font Setup (Outfit)

### Install Outfit Font

**For Android:**
1. Create folder: `mobile/android/app/src/main/assets/fonts/`
2. Download Outfit font files (.ttf) from [Google Fonts](https://fonts.google.com/specimen/Outfit)
3. Copy font files to the fonts folder:
   - Outfit-Regular.ttf
   - Outfit-Medium.ttf
   - Outfit-SemiBold.ttf
   - Outfit-Bold.ttf

**For iOS:**
1. Create folder: `mobile/ios/Fonts/`
2. Copy the same font files to this folder
3. Add fonts to `Info.plist`:
```xml
<key>UIAppFonts</key>
<array>
  <string>Outfit-Regular.ttf</string>
  <string>Outfit-Medium.ttf</string>
  <string>Outfit-SemiBold.ttf</string>
  <string>Outfit-Bold.ttf</string>
</array>
```

**Or use automated linking:**
```bash
npx react-native-asset
```

After adding fonts, rebuild the app completely.
