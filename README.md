# HBPlus Portal — Cross-platform Google Authentication

A React Native + Expo application that runs on Android, iOS, and the web from one TypeScript codebase. Google sign-in is handled by Firebase Authentication; approved accounts are limited to the `@hbplus.fit` domain.

## Features

- Google OAuth login (Firebase popup on web; Expo AuthSession on Android/iOS)
- Exact email-domain validation and verified-email check
- Auth-aware navigation: signed-out users see Login; signed-in users see Dashboard
- Loading and authentication error states
- Logout and persisted Firebase session
- Firestore user profile with a default `user` role
- Optional `admin` role display; role changes are not permitted from the client
- Firestore rules and Firebase Authentication blocking functions for server-side enforcement

## 1. Prerequisites

- Node.js 20 LTS (or a version supported by Expo SDK 53)
- npm
- Expo Go for a quick mobile test, or Android Studio / Xcode for native builds
- A Firebase project
- A Google Cloud project (can be linked to the Firebase project)

## 2. Install

```bash
npm install
cp .env.example .env
```

Fill `.env` with the Firebase configuration and Google OAuth client IDs. Expo public environment variables are bundled into the client, so **never put service-account keys, private secrets, or admin credentials in `EXPO_PUBLIC_*` variables**.

## 3. Configure Firebase Authentication

1. Open Firebase Console → Authentication → Get started.
2. Under Sign-in method, enable **Google** and select a support email.
3. In Authentication → Settings → Authorized domains, add your web deployment hostname (for example, `your-site.netlify.app`) and `localhost` for local web development.
4. Create a Firestore database.
5. Copy the Firebase web app configuration into `.env`.
6. Publish the rules in `firestore.rules` using Firebase Console → Firestore Database → Rules, or the Firebase CLI.

### Google OAuth client IDs

In Google Cloud Console → APIs & Services → Credentials, create OAuth 2.0 Client IDs for:

- **Web application**: add `http://localhost:8081` and your Netlify URL as authorized JavaScript origins. Add the Firebase Auth handler URL (`https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler`) as an authorized redirect URI if prompted.
- **Android**: use your Android package name (`fit.hbplus.portal`) and the SHA-1 certificate fingerprints for your debug/release signing keys.
- **iOS**: use your bundle ID (`fit.hbplus.portal`). Configure the iOS URL scheme / reversed client ID as required by the Google OAuth setup.

Put the corresponding client IDs in `.env`. For production mobile builds, configure the native app identifiers and signing fingerprints to match the OAuth clients. Google OAuth configuration differs between Expo Go and standalone development builds; use an EAS development build for reliable native testing.

## 4. Run the application

```bash
npm run start
```

Then choose the platform, or run directly:

```bash
npm run web       # browser
npm run android   # Android emulator/device
npm run ios       # iOS simulator (macOS required)
```

## 5. Authentication flow

1. The user selects **Continue with Google**.
2. On web, Firebase opens Google's OAuth popup. On native, Expo AuthSession obtains a Google ID token and exchanges it for a Firebase credential.
3. Firebase authenticates the Google account.
4. The client checks that the email is verified and its domain is exactly `hbplus.fit`. An account such as `person@gmail.com` is signed out and shown the restriction error.
5. An allowed user profile is created in Firestore with the default `user` role. Existing profile data is read to determine the role.
6. The auth-aware navigator renders the Dashboard only while a valid Firebase session exists. Logout clears the session and returns to Login.

## 6. How domain restriction is secured

The UI check is a user-experience guard, not the security boundary. This project includes two server-side layers:

- **Firebase Authentication blocking functions** in `functions/index.js` reject both account creation and sign-in unless the email is verified and ends in exactly `@hbplus.fit`.
- **Firestore Security Rules** independently check the authenticated token's verified-email claim and domain before allowing user-profile access. They also prevent users from setting or changing their own role.

To deploy blocking functions, upgrade/enable Firebase Authentication with **Identity Platform** (blocking functions require this capability), install function dependencies, and deploy:

```bash
cd functions
npm install
cd ..
npx firebase-tools login
npx firebase-tools use YOUR_PROJECT_ID
npx firebase-tools deploy --only functions
```

Deploy Firestore rules:

```bash
npx firebase-tools deploy --only firestore:rules
```

If Identity Platform blocking functions are not enabled, the client and Firestore rules still prevent unauthorized access to this app's protected data, but they do **not** prevent an unauthorized Firebase account from being created/authenticated. Enable and deploy the blocking functions before treating this as production access control.

## 7. Role-based access

New users receive `role: "user"`. To promote a trusted account, use Firebase Console → Firestore → `users` → the user's UID document, and change `role` to `admin` using an authorized administrator account. Do not add a role selector to the client. For larger systems, use a trusted Admin SDK process and Firebase custom claims for authorization. The sample Dashboard only displays the role; it does not yet define separate admin-only business features.

## 8. Netlify web deployment

This Expo project uses Metro for web. A simple deployment flow:

1. Push the repository to GitHub.
2. In Netlify, import the repository.
3. Build command: `npx expo export --platform web`
4. Publish directory: `dist`
5. Add every `EXPO_PUBLIC_*` variable from `.env` in Netlify → Site configuration → Environment variables.
6. Add the deployed Netlify hostname to Firebase Authentication → Authorized domains and to the Google Web OAuth client's authorized origins.
7. Trigger a new deploy after changing environment variables.

Netlify build settings are also provided in `netlify.toml`.

## Project structure

```text
hbplus-auth-app/
├── App.tsx
├── app.json
├── firestore.rules
├── functions/
│   ├── index.js
│   └── package.json
├── src/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   └── googleSignIn.ts
│   ├── components/PrimaryButton.tsx
│   ├── navigation/RootNavigator.tsx
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   └── LoginScreen.tsx
│   ├── services/firebase.ts
│   └── config.ts
├── .env.example
└── README.md
```

## Production checklist

- [ ] Replace all sample Firebase and OAuth values.
- [ ] Deploy both Identity Platform blocking functions and Firestore rules.
- [ ] Configure correct Android SHA-1/SHA-256 fingerprints and iOS URL scheme.
- [ ] Test with one `@hbplus.fit` account and one personal Gmail account on all platforms.
- [ ] Assign admin roles only through a trusted server/admin workflow.
- [ ] Add monitoring, rate limiting for any future backend APIs, and a privacy policy before public release.

## Notes

- Domain matching is case-insensitive and checks the complete domain, not merely whether the email contains the text `hbplus.fit`.
- The example domain is set in `src/config.ts` and in the server-side rules/functions. If your organization domain changes, update all three places.
- This repository is a starter implementation. You must configure your own Firebase/Google projects and deploy the server-side controls before production use.
