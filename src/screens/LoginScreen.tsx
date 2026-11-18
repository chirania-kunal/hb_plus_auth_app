import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Google, googleClientIds, signInWithGoogleToken, signInWithGoogleWeb } from '../auth/googleSignIn';
import { PrimaryButton } from '../components/PrimaryButton';
import { ALLOWED_DOMAIN } from '../config';

export function LoginScreen() {

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest(googleClientIds);

  useEffect(() => {
    if (Platform.OS === 'web' || !response) return;
    if (response.type !== 'success') { setBusy(false); return; }
    const idToken = response.authentication?.idToken ?? response.params?.id_token;
    setBusy(true);
    signInWithGoogleToken(idToken)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Sign-in failed. Please try again.'))
      .finally(() => setBusy(false));
  }, [response]);

  const handleLogin = async () => {
    console.log("CURRENT PLATFORM:", Platform.OS);
    console.log("Login Button Clicked");
    setError('');
    setBusy(true);
    try {
      if (Platform.OS === 'web') await signInWithGoogleWeb();
      else {
        console.log("reached here");
        const result = await promptAsync();
        console.log(result);
        if (result.type !== 'success') setBusy(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in. Please try again.');
      setBusy(false);
    } finally {
      if (Platform.OS === 'web') setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.logo}><Text style={styles.logoText}>HB+</Text></View>
        <Text style={styles.eyebrow}>HBPLUS WORKSPACE</Text>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in with your official Google account to continue to your workspace.</Text>
        <View style={styles.rule} />
        <PrimaryButton title="Continue with Google" onPress={handleLogin} loading={busy} disabled={Platform.OS !== 'web' && !request} />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Official accounts only</Text>
          <Text style={styles.noticeText}>Access is limited to verified Google accounts ending in @{ALLOWED_DOMAIN}.</Text>
        </View>
        <Text style={styles.footer}>Secure sign-in powered by Google and Firebase</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F6F4', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 440, backgroundColor: '#fff', borderRadius: 24, padding: 32, shadowColor: '#10251E', shadowOpacity: 0.08, shadowRadius: 28, shadowOffset: { width: 0, height: 12 }, elevation: 4 },
  logo: { width: 54, height: 54, borderRadius: 16, backgroundColor: '#173F35', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 19 }, eyebrow: { color: '#658078', fontSize: 11, letterSpacing: 2, fontWeight: '800', marginBottom: 10 },
  heading: { fontSize: 32, fontWeight: '800', color: '#172923', letterSpacing: -0.8 }, subtitle: { color: '#687871', fontSize: 15, lineHeight: 23, marginTop: 10 },
  rule: { height: 1, backgroundColor: '#E8EEEA', marginVertical: 26 }, error: { color: '#B42318', backgroundColor: '#FEF3F2', padding: 12, borderRadius: 10, lineHeight: 20, marginTop: 14 },
  notice: { backgroundColor: '#F3F7F4', borderRadius: 12, padding: 14, marginTop: 20 }, noticeTitle: { color: '#254B3E', fontWeight: '700', fontSize: 13 }, noticeText: { color: '#64766E', fontSize: 12, lineHeight: 18, marginTop: 5 },
  footer: { color: '#9AA8A1', fontSize: 11, textAlign: 'center', marginTop: 26 },
});
