import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RunMeta } from '@/components/RunMeta';
import { Screen } from '@/components/Screen';
import { Activity, RunRecord } from '@/types/domain';
import { categoryIcons } from '@/utils/format';
import { categoryColors, colors, fonts } from '@/utils/theme';

interface GeneratedRunScreenProps {
  activity: Activity;
  run: RunRecord;
  onBack: () => void;
  onAccept: () => Promise<void>;
  onReroll: () => Promise<void>;
}

export function GeneratedRunScreen({
  activity,
  run,
  onBack,
  onAccept,
  onReroll,
}: GeneratedRunScreenProps) {
  const [busy, setBusy] = useState(false);
  const revealAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    revealAnimation.setValue(0);
    Animated.timing(revealAnimation, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [activity.id, revealAnimation]);

  async function acceptRun() {
    setBusy(true);
    try {
      await onAccept();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } finally {
      setBusy(false);
    }
  }

  async function reroll() {
    setBusy(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onReroll();
    } finally {
      setBusy(false);
    }
  }

  const revealStyle = {
    opacity: revealAnimation,
    transform: [
      {
        translateY: revealAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← VOLTAR</Text>
          </TouchableOpacity>
          <Text style={styles.headerSeed}>{run.seed}</Text>
        </View>

        <Animated.View style={[styles.content, revealStyle]}>
          <View
            style={[
              styles.categoryIcon,
              { borderColor: categoryColors[activity.category] },
            ]}
          >
            <Text
              style={[
                styles.categoryIconText,
                { color: categoryColors[activity.category] },
              ]}
            >
              {categoryIcons[activity.category]}
            </Text>
          </View>

          <Text style={styles.generatedLabel}>RUN GENERATED</Text>

          {activity.isBlind && <Text style={styles.blindBadge}>◉ BLIND RUN</Text>}

          <View style={styles.titleContainer}>
            <Text style={styles.operationLabel}>OPERAÇÃO:</Text>
            <Text style={styles.title}>{activity.title}</Text>
          </View>

          <Text style={styles.description}>“{activity.description}”</Text>
          <RunMeta activity={activity} />

          <View style={styles.seedContainer}>
            <Text style={styles.seedLabel}>RUN SEED / CATÁLOGO {run.catalogVersion}</Text>
            <Text style={styles.seedValue}>{run.seed}</Text>
          </View>
        </Animated.View>

        <View style={styles.actions}>
          <PrimaryButton label="ACEITAR RUN" loading={busy} onPress={acceptRun} />
          <PrimaryButton
            label={`REROLL${run.rerollCount ? ` · ${run.rerollCount}` : ''}`}
            loading={busy}
            onPress={reroll}
            variant="outline"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 10,
    paddingRight: 14,
  },
  backText: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  headerSeed: {
    color: '#59667A',
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 22,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  categoryIconText: {
    fontSize: 27,
    fontWeight: '900',
  },
  generatedLabel: {
    color: colors.accent,
    fontFamily: fonts.mono,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  blindBadge: {
    alignSelf: 'center',
    color: colors.violet,
    backgroundColor: '#211A3A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontFamily: fonts.mono,
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 1.5,
  },
  titleContainer: {
    gap: 7,
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
    fontSize: 35,
    lineHeight: 39,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -0.6,
  },
  description: {
    color: '#D2D8E0',
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
  },
  seedContainer: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seedLabel: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  seedValue: {
    color: colors.cyan,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actions: {
    marginTop: 'auto',
    gap: 10,
  },
});
