import { StyleSheet, Text, View } from 'react-native';
import { RunRecord, RunStatus } from '@/types/domain';
import { categoryIcons, formatDate, formatDuration } from '@/utils/format';
import { categoryColors, colors, fonts } from '@/utils/theme';

interface RunHistoryItemProps {
  run: RunRecord;
}

const statusLabels: Record<RunStatus, string> = {
  generated: 'GERADA',
  accepted: 'EM CURSO',
  completed: 'COMPLETA',
  abandoned: 'ABANDONADA',
  rerolled: 'REROLL',
};

export function RunHistoryItem({ run }: RunHistoryItemProps) {
  const completed = run.status === 'completed';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.timelineDot,
          { backgroundColor: completed ? colors.accent : colors.border },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.category, { color: categoryColors[run.category] }]}>
            {categoryIcons[run.category]} {run.category.toUpperCase()}
          </Text>

          <Text style={[styles.status, completed && styles.completedStatus]}>
            {statusLabels[run.status]}
          </Text>
        </View>

        <Text style={styles.title}>{run.activityTitle}</Text>

        <View style={styles.metadata}>
          <Text style={styles.date}>{formatDate(run.generatedAt)}</Text>
          <Text style={styles.details}>
            {formatDuration(run.estimatedMinutes)}
            {run.xpEarned ? `  ·  +${run.xpEarned} XP` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 13,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#192332',
  },
  timelineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 5,
  },
  content: {
    flex: 1,
    gap: 7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  status: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '800',
  },
  completedStatus: {
    color: colors.accent,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '700',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: '#5E6A7C',
    fontFamily: fonts.mono,
    fontSize: 9,
  },
  details: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '700',
  },
});
