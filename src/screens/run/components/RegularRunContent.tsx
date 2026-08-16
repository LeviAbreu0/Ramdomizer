import { Animated, StyleSheet, Text, View } from 'react-native';
import { RunMeta } from '@/components/RunMeta';
import { Activity } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface RegularRunContentProps {
  activity: Activity;
  revealAnimation: Animated.Value;
}

export function RegularRunContent({ activity, revealAnimation }: RegularRunContentProps) {
  return (
    <Animated.View style={[styles.container, { opacity: revealAnimation }]}>
      <Text style={styles.operationLabel}>OPERAÇÃO EM CURSO</Text>
      <Text style={styles.title}>{activity.title}</Text>
      <RunMeta activity={activity} />
      <Text style={styles.description}>{activity.description}</Text>

      {activity.steps.length > 0 && (
        <View style={styles.briefing}>
          <Text style={styles.briefingLabel}>MISSION BRIEF</Text>

          {activity.steps.map((step, index) => (
            <View key={step} style={styles.briefingStep}>
              <Text style={styles.briefingNumber}>
                {String(index + 1).padStart(2, '0')}
              </Text>
              <Text style={styles.briefingText}>{step}</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  operationLabel: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  description: {
    color: '#D6DCE5',
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 27,
  },
  briefing: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 18,
    gap: 14,
  },
  briefingLabel: {
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  briefingStep: {
    flexDirection: 'row',
    gap: 13,
  },
  briefingNumber: {
    color: colors.violet,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '900',
  },
  briefingText: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
});
