
import React, { useEffect, useRef } from 'react';

import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';

type SplashScreenProps = {
  navigation: any;
  nextScreen: string;
};

export function SplashScreen({
  navigation,
  nextScreen,
}: SplashScreenProps) {
  const scale = useRef(new Animated.Value(0.94)).current;

  const horizontal = useRef(new Animated.Value(100)).current;

  const vertical = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    // Web: Skip animation and navigate directly
    if (Platform.OS === 'web') {
      navigation.replace(nextScreen);
      return;
    }

    // HB logo scaling animation
    const logoAnimation = Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.06,
        duration: 1100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 35,
        useNativeDriver: true,
      }),
    ]);

    // Run all animations together
    const animation = Animated.parallel([
      logoAnimation,

      // Horizontal line comes from right
      Animated.timing(horizontal, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      // Vertical line comes from top
      Animated.timing(vertical, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        navigationTimer();
      }
    });

    let timer: ReturnType<typeof setTimeout>;

    function navigationTimer() {
      timer = setTimeout(() => {
        navigation.replace(nextScreen);
      }, 700);
    }

    return () => {
      animation.stop();
      if (timer) clearTimeout(timer);
    };
  }, [navigation, nextScreen]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>

        {/* HB Logo */}
        <Animated.View
          style={[
            styles.logo,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <Svg
            width={320}
            height={180}
            viewBox="0 0 320 180"
          >
            {/* H */}
            <Path
              d="M30 20 V140 M30 80 H110"
              stroke="#fff"
              strokeWidth={12}
              fill="none"
              strokeLinecap="square"
            />

            {/* B */}
            {/* B Logo */}
            <Path
              d="
                M150 20 V140
                M150 20 H195
                C255 20 255 80 195 80
                H150
                M150 80 H195
                C260 80 260 140 195 140
                H150
              "
              stroke="#fff"
              strokeWidth={12}
              fill="none"
              strokeLinecap="square"
            />

            {/* White vertical gap */}
            <Path
              d="M150 30 V128"
              stroke="#173F35"
              strokeWidth={12}
              fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Horizontal line */}
        <Animated.View
          style={[
            styles.horizontalLine,
            {
              transform: [{ translateX: horizontal }],
            },
          ]}
        />

        {/* Vertical line */}
        <Animated.View
          style={[
            styles.verticalLine,
            {
              transform: [{ translateY: vertical }],
            },
          ]}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#173F35',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    width: 320,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    position: 'absolute',
    zIndex: 1,
  },

  horizontalLine: {
    position: 'absolute',
    width: 90,
    height: 12,
    backgroundColor: '#fff',
    left: 230,
    top: 76,
    zIndex: 2,
  },

  verticalLine: {
    position: 'absolute',
    width: 12,
    height: 110,
    backgroundColor: '#fff',
    left: 264,
    top: 25,
    zIndex: 2,
  },
});
