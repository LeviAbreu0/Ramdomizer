import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/utils/theme';

interface Option<T> {
  label: string;
  value: T;
}

interface OptionGroupProps<T> {
  label: string;
  options: Array<Option<T>>;
  value: T;
  onChange: (value: T) => void;
}

export function OptionGroup<T>({ label, options, value, onChange }: OptionGroupProps<T>) {
  return (
    <View style={styles.section}>
      <View style={styles.labelRow}>
        <View style={styles.dash} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.options}>
        {options.map((option) => {
          const active = Object.is(option.value, value);
          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => {
                void Haptics.selectionAsync();
                onChange(option.value);
              }}
              style={({ pressed }) => [
                styles.option,
                active && styles.optionActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dash: { width: 16, height: 2, backgroundColor: colors.violet },
  label: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundRaised,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 4,
  },
  optionActive: { borderColor: colors.accent, backgroundColor: '#202A19' },
  optionText: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '700',
  },
  optionTextActive: { color: colors.accent },
  pressed: { opacity: 0.72 },
});
