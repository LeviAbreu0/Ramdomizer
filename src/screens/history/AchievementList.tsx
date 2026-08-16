import { StyleSheet, Text, View } from 'react-native';
import { achievements } from '@/data/achievements';
import { AchievementId } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface AchievementListProps {
  unlockedIds: AchievementId[];
}

export function AchievementList({ unlockedIds }: AchievementListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>CONQUISTAS</Text>
        <Text style={styles.count}>
          {unlockedIds.length}/{achievements.length}
        </Text>
      </View>

      <View style={styles.list}>
        {achievements.map((achievement) => {
          const unlocked = unlockedIds.includes(achievement.id);

          return (
            <View
              key={achievement.id}
              style={[styles.item, unlocked && styles.itemUnlocked]}
            >
              <Text style={[styles.mark, unlocked && styles.markUnlocked]}>
                {unlocked ? '◆' : '◇'}
              </Text>

              <View style={styles.content}>
                <Text style={[styles.name, !unlocked && styles.nameLocked]}>
                  {achievement.title}
                </Text>
                <Text style={styles.description}>{achievement.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  count: {
    color: colors.warning,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '900',
  },
  list: {
    gap: 7,
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    minHeight: 62,
    padding: 11,
    borderWidth: 1,
    borderColor: '#202B3A',
    backgroundColor: colors.backgroundRaised,
  },
  itemUnlocked: {
    borderColor: '#65552B',
    backgroundColor: '#19170F',
  },
  mark: {
    color: '#4E5B6E',
    fontSize: 19,
  },
  markUnlocked: {
    color: colors.warning,
  },
  content: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  nameLocked: {
    color: '#697588',
  },
  description: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 3,
  },
});
