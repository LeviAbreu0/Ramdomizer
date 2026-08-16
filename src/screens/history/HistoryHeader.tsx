import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '@/utils/theme';

interface HistoryHeaderProps {
  onBack: () => void;
}

export function HistoryHeader({ onBack }: HistoryHeaderProps) {
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.eyebrow}>ARCHIVE / LOCAL MEMORY</Text>
          <Text style={styles.title}>HISTORY</Text>
        </View>

        <Text style={styles.year}>{new Date().getFullYear()}</Text>
      </View>

      <Text style={styles.description}>
        Um registro das pequenas coisas que aconteceram porque você confiou no dado.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  backButton: {
    width: 39,
    height: 39,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.text,
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  eyebrow: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 1,
  },
  year: {
    color: '#4D596C',
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '900',
  },
  description: {
    color: '#AAB4C3',
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 340,
  },
});
