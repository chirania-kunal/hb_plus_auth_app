import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase';
import { isAllowedEmail } from '../config';


WebBrowser.maybeCompleteAuthSession();

export const googleClientIds = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};

export async function signInWithGoogleWeb() {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  if (!isAllowedEmail(result.user.email) || !result.user.emailVerified) {
    await auth.signOut();
    throw new Error('Access restricted. Please login using your official domain email.');
  }
  return result;
}

export async function signInWithGoogleToken(idToken?: string | null) {
  if (!idToken) throw new Error('Google did not return an ID token. Check your OAuth client configuration.');
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  if (!isAllowedEmail(result.user.email) || !result.user.emailVerified) {
    await auth.signOut();
    throw new Error('Access restricted. Please login using your official domain email.');
  }
  return result;
}

export { Google, Platform };
