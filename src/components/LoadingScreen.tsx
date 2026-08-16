import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Screen } from './Screen';
import { colors, fonts } from '@/utils/theme';

export function LoadingScreen() {
  return (
    <Screen style={styles.screen}>
      <View style={styles.mark}>
        <Text style={styles.markText}>R</Text>
      </View>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.text}>CARREGANDO CATÁLOGO LOCAL</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', justifyContent: 'center', gap: 18 },
  mark: {
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  markText: {
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: 26,
    fontWeight: '900',
    transform: [{ rotate: '-45deg' }],
  },
  text: { color: colors.muted, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5 },
});
