import { StyleSheet, Text, View } from 'react-native';
import { Activity } from '@/types/domain';
import { formatBudget, formatDuration } from '@/utils/format';
import { categoryColors, colors, fonts } from '@/utils/theme';

export function RunMeta({ activity }: { activity: Activity }) {
  const items = [
    formatDuration(activity.estimatedMinutes),
    formatBudget(activity.minBudget, activity.maxBudget),
    activity.category,
  ];
  return (
    <View style={styles.row}>
      {items.map((item, index) => (
        <View key={item} style={styles.item}>
          {index > 0 && <View style={styles.dot} />}
          <Text
            style={[
              styles.text,
              index === 2 && { color: categoryColors[activity.category] },
            ]}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.border },
  text: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
