
import React from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../auth/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SplashScreen } from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#173F35" />
      </View>
    );
  }

  const nextScreen = user ? 'Dashboard' : 'Login';

  // Choose initial screen based on platform
  const initialScreen =
    Platform.OS === 'web' ? nextScreen : 'Splash';

  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash">
        {(props) => (
          <SplashScreen
            {...props}
            nextScreen={nextScreen}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Dashboard" component={DashboardScreen} />

    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6F4',
  },
});
