import { Animated, StyleSheet, Text, View } from 'react-native';
import { Activity } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface BlindRunContentProps {
  activity: Activity;
  stepIndex: number;
  revealAnimation: Animated.Value;
}

export function BlindRunContent({
  activity,
  stepIndex,
  revealAnimation,
}: BlindRunContentProps) {
  const stepCount = activity.steps.length;
  const safeIndex = Math.min(stepIndex, Math.max(0, stepCount - 1));
  const currentStep = activity.steps[safeIndex];
  const isFinalStep = stepIndex >= stepCount - 1;

  const revealStyle = {
    opacity: revealAnimation,
    transform: [
      {
        translateY: revealAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, revealStyle]}>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>
          {isFinalStep ? 'ETAPA FINAL' : `ETAPA ${stepIndex + 1}/${stepCount}`}
        </Text>

        <View style={styles.progress}>
          {activity.steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressItem,
                index <= stepIndex && styles.progressItemActive,
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.currentStep}>“{currentStep}”</Text>
      <Text style={styles.lockedSteps}>
        {stepCount - stepIndex - 1} ETAPA(S) AINDA BLOQUEADA(S)
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
  },
  header: {
    gap: 16,
  },
  stepLabel: {
    color: colors.violet,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  progress: {
    flexDirection: 'row',
    gap: 7,
  },
  progressItem: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
  },
  progressItemActive: {
    backgroundColor: colors.violet,
  },
  currentStep: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 41,
    fontWeight: '800',
  },
  lockedSteps: {
    color: '#5B687B',
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
