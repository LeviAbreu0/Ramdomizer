import { useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, fonts } from '@/utils/theme';

interface RandomizeButtonProps {
  onRandomize: () => Promise<void>;
}

export function RandomizeButton({ onRandomize }: RandomizeButtonProps) {
  const [loading, setLoading] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const spinAnimation = useRef(new Animated.Value(0)).current;

  function playAnimation() {
    spinAnimation.setValue(0);

    return new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnimation, {
            toValue: 0.84,
            duration: 110,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnimation, {
            toValue: 1.08,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnimation, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 520,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  }

  async function randomize() {
    if (loading) return;

    setLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Promise.all([playAnimation(), onRandomize()]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tente alterar um dos filtros.';

      Alert.alert('Sem run compatível', message);
    } finally {
      setLoading(false);
    }
  }

  const rotation = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '540deg'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      disabled={loading}
      onPress={randomize}
      style={styles.button}
    >
      <LinearGradient colors={['#D9FF47', '#B9E32D']} style={styles.gradient}>
        <Animated.Text
          style={[
            styles.icon,
            {
              transform: [{ scale: scaleAnimation }, { rotate: rotation }],
            },
          ]}
        >
          ✦
        </Animated.Text>

        <View>
          <Text style={styles.title}>{loading ? 'ROLLING...' : 'RANDOMIZE'}</Text>
          <Text style={styles.subtitle}>GERAR UMA NOVA RUN</Text>
        </View>

        <Text style={styles.arrow}>→</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  gradient: {
    minHeight: 86,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    color: colors.black,
    fontSize: 30,
    width: 38,
    textAlign: 'center',
  },
  title: {
    color: colors.black,
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#526416',
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 3,
  },
  arrow: {
    marginLeft: 'auto',
    color: colors.black,
    fontSize: 28,
  },
});
