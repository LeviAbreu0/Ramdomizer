import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { FeedbackOptions } from './components/FeedbackOptions';
import { PreferenceToggle } from './components/PreferenceToggle';
import { UnlockedAchievements } from './components/UnlockedAchievements';
import { AchievementId, Feedback, RunRecord } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface RunFeedbackScreenProps {
  run: RunRecord;
  unlockedAchievements: AchievementId[];
  onSave: (feedback: Feedback, wantMore: boolean, neverAgain: boolean) => Promise<void>;
}

export function RunFeedbackScreen({
  run,
  unlockedAchievements,
  onSave,
}: RunFeedbackScreenProps) {
  const [feedback, setFeedback] = useState<Feedback>();
  const [wantMore, setWantMore] = useState(false);
  const [neverAgain, setNeverAgain] = useState(false);
  const [saving, setSaving] = useState(false);

  function selectFeedback(value: Feedback) {
    void Haptics.selectionAsync();
    setFeedback(value);

    if (value === 'never') {
      setNeverAgain(true);
      setWantMore(false);
    }
  }

  function toggleWantMore() {
    setWantMore((current) => !current);
    setNeverAgain(false);
  }

  function toggleNeverAgain() {
    setNeverAgain((current) => !current);
    setWantMore(false);
  }

  async function saveFeedback() {
    if (!feedback) return;

    setSaving(true);
    try {
      const shouldBlock = neverAgain || feedback === 'never';
      await onSave(feedback, wantMore, shouldBlock);
      await Haptics.selectionAsync();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.completeIcon}>
          <Text style={styles.completeIconText}>✓</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.statusLabel}>MISSION STATUS</Text>
          <Text style={styles.title}>RUN{`\n`}COMPLETE</Text>
        </View>

        <Text style={styles.xpReward}>+{run.xpEarned ?? 0} XP</Text>

        <UnlockedAchievements achievementIds={unlockedAchievements} />

        <View style={styles.feedbackContainer}>
          <Text style={styles.question}>Como foi?</Text>

          <FeedbackOptions selected={feedback} onSelect={selectFeedback} />

          <PreferenceToggle
            checked={wantMore}
            label="Quero mais atividades assim"
            onPress={toggleWantMore}
          />

          <PreferenceToggle
            checked={neverAgain}
            danger
            label="Não me recomende isso novamente"
            onPress={toggleNeverAgain}
          />
        </View>

        <PrimaryButton
          disabled={!feedback}
          label="SALVAR & VOLTAR"
          loading={saving}
          onPress={saveFeedback}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 30,
    gap: 24,
  },
  completeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: '#1E2816',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeIconText: {
    color: colors.accent,
    fontSize: 34,
    fontWeight: '900',
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 42,
    lineHeight: 42,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 1,
  },
  xpReward: {
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  feedbackContainer: {
    gap: 12,
  },
  question: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
});
