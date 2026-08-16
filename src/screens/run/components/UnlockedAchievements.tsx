import { StyleSheet, Text, View } from 'react-native';
import { achievements } from '@/data/achievements';
import { AchievementId } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface UnlockedAchievementsProps {
  achievementIds: AchievementId[];
}

export function UnlockedAchievements({ achievementIds }: UnlockedAchievementsProps) {
  return achievementIds.map((achievementId) => {
    const achievement = achievements.find((item) => item.id === achievementId);

    if (!achievement) return null;

    return (
      <View key={achievementId} style={styles.container}>
        <Text style={styles.icon}>◆</Text>
        <View style={styles.content}>
          <Text style={styles.label}>CONQUISTA DESBLOQUEADA</Text>
          <Text style={styles.title}>{achievement.title}</Text>
        </View>
      </View>
    );
  });
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 13,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: '#251F13',
  },
  icon: {
    color: colors.warning,
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  label: {
    color: colors.warning,
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
});
