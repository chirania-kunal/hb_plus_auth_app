import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export function PrimaryButton({ title, onPress, loading, disabled }: {
  title: string; onPress: () => void; loading?: boolean; disabled?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { backgroundColor: '#173F35', borderRadius: 12, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  pressed: { opacity: 0.86 }, disabled: { opacity: 0.65 }, text: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
