import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '@/utils/theme';

interface HomeHeaderProps {
  onOpenHistory: () => void;
}

export function HomeHeader({ onOpenHistory }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>LOCAL SIDEQUEST SYSTEM</Text>
        <Text style={styles.logo}>
          RANDOMIZER<Text style={styles.logoDot}>.</Text>
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onOpenHistory}
        style={styles.historyButton}
      >
        <Text style={styles.historyIcon}>≡</Text>
        <Text style={styles.historyLabel}>HISTORY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1.8,
    marginBottom: 3,
  },
  logo: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  logoDot: {
    color: colors.accent,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 4,
  },
  historyIcon: {
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '900',
  },
  historyLabel: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
