import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PersistedAppState } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface CurrentRunBannerProps {
  activityTitle: string;
  phase: PersistedAppState['runPhase'];
  onPress: () => void;
}

export function CurrentRunBanner({
  activityTitle,
  phase,
  onPress,
}: CurrentRunBannerProps) {
  const label = phase === 'feedback' ? 'RECOMPENSA PENDENTE' : 'RUN EM ANDAMENTO';

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <View style={styles.signal} />

      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text numberOfLines={1} style={styles.title}>
          {activityTitle}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.cyan,
    backgroundColor: colors.backgroundRaised,
  },
  signal: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.cyan,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  label: {
    color: colors.cyan,
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '700',
  },
  arrow: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '300',
  },
});
