import { StyleSheet, Text, View } from 'react-native';
import { PlayerProfile } from '@/types/domain';
import { getLevel, getLevelProgress } from '@/domain/progression';
import { colors, fonts } from '@/utils/theme';

export function ProgressHud({ profile }: { profile: PlayerProfile }) {
  const level = getLevel(profile.xp);
  const progress = getLevelProgress(profile.xp);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.level}>LV. {level.toString().padStart(2, '0')}</Text>
        <Text style={styles.xp}>{profile.xp.toLocaleString('pt-BR')} XP</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(2, progress.ratio * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  level: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  xp: { color: colors.muted, fontFamily: fonts.mono, fontWeight: '700', fontSize: 11 },
  track: { height: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent },
});
