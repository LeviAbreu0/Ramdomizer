import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Screen } from '@/components/Screen';
import { calculateHistoryStats } from '@/domain/historyStats';
import { useRandomizer } from '@/hooks/RandomizerProvider';
import { AchievementList } from '@/screens/history/AchievementList';
import { HistoryHeader } from '@/screens/history/HistoryHeader';
import { HistorySummary } from '@/screens/history/HistorySummary';
import { RunHistoryItem } from '@/screens/history/RunHistoryItem';
import { colors, fonts } from '@/utils/theme';

export default function HistoryScreen() {
  const router = useRouter();
  const randomizer = useRandomizer();

  const stats = useMemo(
    () => calculateHistoryStats(randomizer.history),
    [randomizer.history],
  );

  if (!randomizer.isReady) {
    return <LoadingScreen />;
  }

  return (
    <Screen edges={['top', 'right', 'left']}>
      <FlatList
        data={randomizer.history}
        keyExtractor={(run) => run.id}
        renderItem={({ item }) => <RunHistoryItem run={item} />}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <HistoryHeader onBack={() => router.back()} />

            <HistorySummary randomizations={randomizer.history.length} stats={stats} />

            <AchievementList unlockedIds={randomizer.profile.unlockedAchievements} />

            <View style={styles.logHeader}>
              <Text style={styles.sectionTitle}>RUN LOG</Text>
              <Text style={styles.logCount}>
                {randomizer.history.length.toString().padStart(3, '0')} ENTRADAS
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyHistory />}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              LOCAL-FIRST ARCHIVE · PRIVATE BY DEFAULT
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

function EmptyHistory() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>◇</Text>
      <Text style={styles.emptyTitle}>NENHUMA RUN AINDA</Text>
      <Text style={styles.emptyDescription}>
        Seu arquivo começa depois do primeiro RANDOMIZE.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerContent: {
    gap: 23,
    marginBottom: 10,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  logCount: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: {
    color: colors.border,
    fontSize: 34,
  },
  emptyTitle: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emptyDescription: {
    color: '#536074',
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    paddingTop: 28,
    alignItems: 'center',
  },
  footerText: {
    color: '#465264',
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
