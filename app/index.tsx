import { ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { EntropyControl } from '@/components/EntropyControl';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ProgressHud } from '@/components/ProgressHud';
import { Screen } from '@/components/Screen';
import { useRandomizer } from '@/hooks/RandomizerProvider';
import { CurrentRunBanner } from '@/screens/home/CurrentRunBanner';
import { HomeFilters } from '@/screens/home/HomeFilters';
import { HomeHeader } from '@/screens/home/HomeHeader';
import { RandomizeButton } from '@/screens/home/RandomizeButton';
import { colors, fonts } from '@/utils/theme';

export default function HomeScreen() {
  const router = useRouter();
  const randomizer = useRandomizer();

  if (!randomizer.isReady) {
    return <LoadingScreen />;
  }

  async function generateRun() {
    await randomizer.randomize(false);
    router.push('/run');
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader onOpenHistory={() => router.push('/history')} />

        <Text style={styles.tagline}>Você tem tempo.{`\n`}Eu tenho um plano.</Text>

        <ProgressHud profile={randomizer.profile} />

        {randomizer.currentRun && randomizer.currentActivity && (
          <CurrentRunBanner
            activityTitle={randomizer.currentActivity.title}
            phase={randomizer.runPhase}
            onPress={() => router.push('/run')}
          />
        )}

        <EntropyControl
          value={randomizer.filters.entropy}
          onChange={(value) => randomizer.setFilter('entropy', value)}
        />

        <HomeFilters filters={randomizer.filters} onChange={randomizer.setFilter} />

        <RandomizeButton onRandomize={generateRun} />

        <Text style={styles.privacy}>OFFLINE · SEM CONTA · SEUS DADOS FICAM AQUI</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 34,
    gap: 24,
  },
  tagline: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 4,
  },
  privacy: {
    textAlign: 'center',
    color: '#536074',
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
});
