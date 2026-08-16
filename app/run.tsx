import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRandomizer } from '@/hooks/RandomizerProvider';
import { ActiveRunScreen } from '@/screens/run/ActiveRunScreen';
import { GeneratedRunScreen } from '@/screens/run/GeneratedRunScreen';
import { RunFeedbackScreen } from '@/screens/run/RunFeedbackScreen';

export default function RunRoute() {
  const router = useRouter();
  const randomizer = useRandomizer();

  const { isReady, currentRun, currentActivity, runPhase } = randomizer;

  useEffect(() => {
    if (isReady && (!currentRun || !currentActivity)) {
      router.replace('/');
    }
  }, [isReady, currentRun, currentActivity, router]);

  if (!isReady || !currentRun || !currentActivity) {
    return <LoadingScreen />;
  }

  if (runPhase === 'feedback') {
    return (
      <RunFeedbackScreen
        run={currentRun}
        unlockedAchievements={randomizer.unlockedNow}
        onSave={async (feedback, wantMore, neverAgain) => {
          await randomizer.submitFeedback(feedback, wantMore, neverAgain);
          await randomizer.finishFeedback();
          router.replace('/');
        }}
      />
    );
  }

  if (runPhase === 'active') {
    return (
      <ActiveRunScreen
        activity={currentActivity}
        run={currentRun}
        stepIndex={randomizer.currentStepIndex}
        onAdvanceStep={randomizer.advanceStep}
        onComplete={randomizer.completeRun}
        onAbandon={async () => {
          await randomizer.abandonRun();
          router.replace('/');
        }}
      />
    );
  }

  return (
    <GeneratedRunScreen
      activity={currentActivity}
      run={currentRun}
      onBack={() => router.back()}
      onAccept={randomizer.acceptRun}
      onReroll={() => randomizer.randomize(true)}
    />
  );
}
