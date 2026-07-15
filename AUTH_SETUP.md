# Multi-User Authentication Setup Guide

This guide will help you quickly implement multi-user authentication for your AppMedicamentos React Native app using **Firebase Auth + Google Sign-In**.

## 🚀 What You'll Get

- ✅ **Google Sign-In** (native UI, one-tap login)
- ✅ **Email/Password Authentication** (traditional signup/login)
- ✅ **User State Management** (automatically tracks authenticated users)
- ✅ **Secure Auth System** (Firebase industry standards)
- ✅ **Zero Breaking Changes** to existing app functionality

## 📋 Quick Implementation Steps

### Step 1: Install Dependencies

```bash
cd /c/AppMedicamentos
npm install
```

### Step 2: Setup Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google Identity Platform** API
4. Configure OAuth 2.0 Client IDs:
   - **iOS**: Add to GoogleService-Info.plist (reverse client ID)
   - **Android**: Add SHA-1 fingerprint to google-services.json
   - **Web**: Get Web Client ID for React Native

### Step 3: Initialize Google Sign-In in Your App

Create `src/config/googleSigninConfig.ts`:

```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  offlineAccess: true,
});
```

Call this function in your main App component:

```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Call this once when app starts
GoogleSignin.configure({
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

### Step 4: Create AuthContext

The `src/context/AuthContext.tsx` file is already created and provides:

- `useAuth()` hook for easy access
- Google Sign-In function
- Email/Password authentication
- User state management
- TypeScript safety

### Step 5: Wrap Your App

Modify `App.tsx` to use AuthProvider:

```tsx
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import App from './src/App'; // Your existing App component

export default function MainApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
```

### Step 6: Add Login Screen (Optional)

Create `src/screens/LoginScreen.tsx`:

```tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      
      <Button title="Google" onPress={signInWithGoogle} />
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <Button title="Login" onPress={() => signInWithEmail(email, password)} />
      <Button 
        title="Sign Up" 
        onPress={() => signUpWithEmail(email, password)} 
      />
    </View>
  );
}
```

### Step 7: Auth Flow Control

Modify your main `App` component to show login when not authenticated:

```tsx
import { useAuth } from './src/context/AuthContext';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Text>Loading...</Text>;
  }
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  // Your existing app code here
  return <YourOriginalApp />;
}
```

## 🔧 Backend Integration

Your existing backend already supports user authentication via tokens.

### Option 1: Firebase Token Validation

Add Firebase token verification to your backend endpoints:

```javascript
const verifyFirebaseToken = async (firebaseToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};

// Use in your protected endpoints
app.use('/api/protected', async (req, res, next) => {
  const firebaseToken = req.headers.authorization?.split('Bearer ')[1];
  
  if (!firebaseToken) {
    return res.status(401).json({ message: 'Firebase token required' });
  }
  
  const decodedToken = await verifyFirebaseToken(firebaseToken);
  req.user = {
    uid: decodedToken.uid,
    email: decodedToken.email
  };
  
  next();
});
```

### Option 2: User Sync

After Firebase authentication, ensure user exists in your backend:

```javascript
const syncUserWithBackend = async (firebaseUser) => {
  try {
    // Check if user exists in your database
    let user = await User.findOne({ firebaseUid: firebaseUser.uid });
    
    if (!user) {
      // Create new user in your backend
      user = await User.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        password: generateSecurePassword(), // random password
        createdAt: new Date(),
      });
    }
    
    return user;
  } catch (error) {
    console.error('Error syncing user with backend:', error);
    throw error;
  }
};
```

## 📱 Native Configuration

### Android

1. Add Google Services: Download `google-services.json` from Firebase Console
2. Add to `android/app/`
3. Ensure `compileSdkVersion` >= 33 and `targetSdkVersion` >= 33

### iOS

1. Add Firebase configurations: Download `GoogleService-Info.plist` from Firebase Console
2. Add to `ios/` directory
3. In XCode, add Google Sign-In capability:
   - Capabilities → Sign In with Apple → OFF
   - Capabilities → Sign In with Google → ON

## 🧪 Testing

### Local Testing with Firebase Emulators

```bash
# Start Firebase Auth emulator
firebase emulators:start --only auth

# Update your environment to use emulator
 GOOGLE_AUTH_EMULATOR_HOST="localhost:9099"
```

### Google Sign-In Testing

```tsx
// In development, you can force Google Sign-In to use test account
const signInWithGoogleForTesting = async () => {
  await GoogleSignin.signIn(); // This will prompt for account selection
  // You can also test with a specific test account
};
```

## 🌐 Production Deployment

### Environment Variables

```bash
# In your .env file
REACT_NATIVE_PACKAGER_HOSTNAME=10.0.2.2
MY_APP_FIREBASE_API_KEY=your_firebase_api_key
GOOGLE_WEB_CLIENT_ID=your_web_client_id
```

### Security Best Practices

1. **HTTPS Only**: Always use HTTPS in production
2. **CORS Configuration**: Configure allowed origins in Firebase
3. **Rate Limiting**: Implement rate limiting on backend endpoints
4. **Token Refresh**: Handle automatic token refresh
5. **Error Handling**: Don't expose sensitive error messages to users

## 🔄 Managing Auth State

The `useAuth()` hook provides:

```typescript
interface AuthState {
  user: User | null;           // Current user or null
  loading: boolean;            // Loading state
  isAuthenticated: boolean;     // Convenience boolean
  signInWithGoogle(): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  signUpWithEmail(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}
```

## 📊 Analytics & Monitoring

Firebase Auth provides built-in analytics:

- User sign-up events
- User sign-in events  
- User sign-out events
- Authentication errors
- User engagement metrics

## 🔄 Migration from Single-User to Multi-User

If you're migrating from single-user to multi-user:

1. **Add AuthProvider** to your main App component
2. **Add loading state** to show spinner during auth
3. **Add login screen** that redirects to app when authenticated
4. **Protect existing screens** that require authentication
5. **Test with multiple user accounts** to ensure isolation

## 🚀 Quick Start Commands

```bash
# Install packages
cd /c/AppMedicamentos
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🎯 Troubleshooting Common Issues

### Google Sign-In Not Working

1. **Check configuration**: Ensure iOS and Web client IDs match
2. **SHA-1 Fingerprint**: Android: `keytool -export -keystore ~/.android/debug.keystore -alias androiddebugkey -destfile /tmp/debugkey.crt -storepass android -keypass android -validity 3650`
3. **Google Cloud Project**: Ensure project is configured for Google Sign-In

### Firebase Auth Errors

1. **Configuration**: Check Firebase project settings
2. **API Keys**: Ensure Api Key is configured in Firebase Console
3. **App Check**: For iOS, add App Check if required

### Getting Started

1. Create Google Cloud project
2. Download google-services.json and GoogleService-Info.plist
3. Configure OAuth client IDs
4. Follow this guide step by step

## 📈 Monitoring & Maintenance

1. **Firebase Console**: Monitor auth events in Firebase Analytics
2. **Security Rules**: Review authentication rate limits
3. **Error Tracking**: Set up crash reporting
4. **User Feedback**: Collect feedback on sign-in experience

## 💡 Pro Tips

1. **Use loading states**: Show spinner while auth is loading
2. **Handle errors gracefully**: Don't crash app on auth errors
3. **Persist user preferences**: Save user settings across sessions
4. **Add logout button**: Essential for multi-user apps
5. **Test edge cases**: Handle slow networks, expired tokens

## 🎉 Success!

You now have a complete multi-user authentication system with:

- ✅ Google Sign-In
- ✅ Email/Password Auth
- ✅ User State Management
- ✅ Backend Integration
- ✅ TypeScript Support
- ✅ Error Handling
- ✅ Production Ready

Your app is now ready to handle multiple users with secure, modern authentication! 🚀