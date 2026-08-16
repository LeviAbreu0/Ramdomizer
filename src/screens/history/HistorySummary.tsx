import { StyleSheet, Text, View } from 'react-native';
import { HistoryStats } from '@/domain/historyStats';
import { formatDuration } from '@/utils/format';
import { colors, fonts } from '@/utils/theme';

interface HistorySummaryProps {
  randomizations: number;
  stats: HistoryStats;
}

export function HistorySummary({ randomizations, stats }: HistorySummaryProps) {
  const favorite = stats.favoriteCategory;

  return (
    <>
      <View style={styles.hero}>
        <Text style={styles.heroValue}>{randomizations}</Text>
        <Text style={styles.heroLabel}>RANDOMIZAÇÕES</Text>
      </View>

      <View style={styles.grid}>
        <Stat value={stats.completedRuns} label="RUNS COMPLETAS" color={colors.accent} />
        <Stat value={stats.acceptedRuns} label="RUNS ACEITAS" color={colors.cyan} />
        <Stat
          value={formatDuration(stats.completedMinutes)}
          label="TEMPO EM RUN"
          color={colors.violet}
        />
        <Stat
          value={favorite ? `${favorite.count}×` : '—'}
          label={favorite?.name.toUpperCase() ?? 'CATEGORIA FAVORITA'}
          color={colors.warning}
        />
      </View>
    </>
  );
}

interface StatProps {
  value: string | number;
  label: string;
  color: string;
}

function Stat({ value, label, color }: StatProps) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statLine, { backgroundColor: color }]} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text numberOfLines={1} style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: 16,
  },
  heroValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 52,
    lineHeight: 55,
    fontWeight: '900',
  },
  heroLabel: {
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.border,
  },
  stat: {
    width: '50%',
    minHeight: 96,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    padding: 13,
    gap: 6,
  },
  statLine: {
    width: 18,
    height: 2,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 23,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
