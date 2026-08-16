import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fonts } from '@/utils/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'accent' | 'outline' | 'danger';
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'accent',
  style,
}: PrimaryButtonProps) {
  if (variant === 'accent') {
    return (
      <Pressable
        disabled={disabled || loading}
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          style,
          pressed && styles.pressed,
          (disabled || loading) && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={[colors.accent, '#B8E42F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.accentText}>{label}</Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.outline,
        variant === 'danger' && styles.danger,
        style,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={[styles.outlineText, variant === 'danger' && styles.dangerText]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { minHeight: 58, borderRadius: 5, overflow: 'hidden' },
  gradient: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  accentText: {
    color: colors.black,
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  outline: {
    minHeight: 54,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  outlineText: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  danger: { borderColor: '#5B2932' },
  dangerText: { color: colors.danger },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
});
