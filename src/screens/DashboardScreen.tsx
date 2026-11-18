import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { PrimaryButton } from '../components/PrimaryButton';

export function DashboardScreen() {
  const { user, role, logout } = useAuth();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View><Text style={styles.brand}>HB+ <Text style={styles.brandLight}>WORKSPACE</Text></Text><Text style={styles.headerCaption}>Your organization portal</Text></View>
        <View style={styles.avatar}>{user?.photoURL ? <Image source={{ uri: user.photoURL }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{user?.displayName?.[0] ?? 'U'}</Text>}</View>
      </View>
      <View style={styles.content}>
        <Text style={styles.kicker}>OVERVIEW</Text>
        <Text style={styles.title}>You're signed in.</Text>
        <Text style={styles.description}>Welcome to your HBPlus workspace. Your account has been authenticated and your organization access has been verified.</Text>
        <View style={styles.profileCard}>
          <Text style={styles.cardLabel}>SIGNED-IN ACCOUNT</Text>
          <Text style={styles.name}>{user?.displayName || 'HBPlus Member'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.metaRow}><Text style={styles.metaLabel}>ACCESS ROLE</Text><View style={styles.rolePill}><Text style={styles.roleText}>{role.toUpperCase()}</Text></View></View>
          <View style={styles.metaRow}><Text style={styles.metaLabel}>ACCOUNT STATUS</Text><Text style={styles.status}>● Verified</Text></View>
        </View>
        {role === 'admin' ? <View style={styles.adminNote}><Text style={styles.adminTitle}>Administrator access</Text><Text style={styles.adminBody}>Your account has the administrator role. Assign this role only through the trusted Firebase Console or a privileged server process.</Text></View> : null}
        <PrimaryButton title="Sign out" onPress={() => void logout()} />
      </View>
      <Text style={styles.bottom}>HBPlus Portal · Secure organization access</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F6F4' }, header: { backgroundColor: '#173F35', paddingHorizontal: 26, paddingTop: 22, paddingBottom: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#fff', fontSize: 20, fontWeight: '900' }, brandLight: { color: '#C6D8D0', fontSize: 10, letterSpacing: 2 }, headerCaption: { color: '#C6D8D0', fontSize: 12, marginTop: 4 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#D9E7E0', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, avatarImage: { width: 42, height: 42 }, avatarText: { color: '#173F35', fontWeight: '800', fontSize: 17 },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 26, flex: 1 }, kicker: { color: '#6B8177', fontWeight: '800', letterSpacing: 2, fontSize: 11, marginTop: 20 }, title: { color: '#172923', fontSize: 32, fontWeight: '800', marginTop: 10 }, description: { color: '#687871', fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 26 },
  profileCard: { backgroundColor: '#fff', borderRadius: 18, padding: 22, marginBottom: 20, borderWidth: 1, borderColor: '#E7EDE9' }, cardLabel: { color: '#84948C', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }, name: { color: '#1C3028', fontSize: 20, fontWeight: '800', marginTop: 13 }, email: { color: '#6B7B73', fontSize: 14, marginTop: 4, marginBottom: 20 }, metaRow: { borderTopWidth: 1, borderTopColor: '#EDF1EE', paddingTop: 14, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, metaLabel: { color: '#84948C', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, rolePill: { backgroundColor: '#EAF2ED', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }, roleText: { color: '#285642', fontWeight: '800', fontSize: 10 }, status: { color: '#24804F', fontSize: 12, fontWeight: '700' },
  adminNote: { backgroundColor: '#FFF8E7', borderRadius: 12, padding: 14, marginBottom: 18 }, adminTitle: { color: '#815B13', fontWeight: '800' }, adminBody: { color: '#806D49', fontSize: 12, lineHeight: 18, marginTop: 5 }, bottom: { textAlign: 'center', color: '#9AA8A1', fontSize: 11, padding: 18 },
});
