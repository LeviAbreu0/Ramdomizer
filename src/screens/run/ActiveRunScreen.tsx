import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { BlindRunContent } from './components/BlindRunContent';
import { RegularRunContent } from './components/RegularRunContent';
import { Activity, RunRecord } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface ActiveRunScreenProps {
  activity: Activity;
  run: RunRecord;
  stepIndex: number;
  onAdvanceStep: () => Promise<void>;
  onComplete: () => Promise<void>;
  onAbandon: () => Promise<void>;
}

export function ActiveRunScreen({
  activity,
  run,
  stepIndex,
  onAdvanceStep,
  onComplete,
  onAbandon,
}: ActiveRunScreenProps) {
  const [busy, setBusy] = useState(false);
  const revealAnimation = useRef(new Animated.Value(0)).current;
  const isBlindRun = Boolean(activity.isBlind);
  const isFinalStep = isBlindRun && stepIndex >= activity.steps.length - 1;
  const actionLabel = getActionLabel(isBlindRun, isFinalStep);
  const primaryAction = isBlindRun ? advanceBlindRun : finishRun;

  useEffect(() => {
    revealAnimation.setValue(0);
    Animated.timing(revealAnimation, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [stepIndex, revealAnimation]);

  async function advanceBlindRun() {
    const feedbackStyle = isFinalStep
      ? Haptics.ImpactFeedbackStyle.Heavy
      : Haptics.ImpactFeedbackStyle.Light;

    await Haptics.impactAsync(feedbackStyle);

    if (isFinalStep) {
      await finishRun();
      return;
    }

    await onAdvanceStep();
  }

  async function finishRun() {
    setBusy(true);
    try {
      await onComplete();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } finally {
      setBusy(false);
    }
  }

  function confirmAbandon() {
    Alert.alert(
      'Abandonar run?',
      'Ela continuará registrada no seu histórico como abandonada.',
      [
        { text: 'Continuar run', style: 'cancel' },
        { text: 'Abandonar', style: 'destructive', onPress: onAbandon },
      ],
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.activeStatus}>● RUN ACTIVE</Text>
          <Text style={styles.seed}>{run.seed}</Text>
        </View>

        {isBlindRun ? (
          <BlindRunContent
            activity={activity}
            stepIndex={stepIndex}
            revealAnimation={revealAnimation}
          />
        ) : (
          <RegularRunContent activity={activity} revealAnimation={revealAnimation} />
        )}

        <View style={styles.actions}>
          <PrimaryButton label={actionLabel} loading={busy} onPress={primaryAction} />

          <PrimaryButton label="ABANDONAR" onPress={confirmAbandon} variant="danger" />
        </View>
      </ScrollView>
    </Screen>
  );
}

function getActionLabel(isBlindRun: boolean, isFinalStep: boolean) {
  if (!isBlindRun) return 'CONCLUIR RUN';
  if (isFinalStep) return 'FINALIZAR RUN';
  return 'ETAPA CONCLUÍDA';
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeStatus: {
    color: colors.success,
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  seed: {
    color: '#59667A',
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actions: {
    marginTop: 'auto',
    gap: 10,
  },
});
