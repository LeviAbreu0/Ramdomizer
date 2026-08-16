import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/utils/theme';

interface EntropyControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function EntropyControl({ value, onChange }: EntropyControlProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.label}>ENTROPY</Text>
        <Text style={styles.value}>{Math.round(value)}%</Text>
      </View>
      <Slider
        accessibilityLabel="Nível de entropia"
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={onChange}
        onSlidingComplete={() => void Haptics.selectionAsync()}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.accent}
        style={styles.slider}
      />
      <View style={styles.range}>
        <Text style={styles.rangeText}>SAFE</Text>
        <Text style={styles.rangeTextChaos}>CHAOS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 20,
  },
  topline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 2,
  },
  value: {
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: '900',
  },
  slider: { width: '100%', height: 38 },
  range: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  rangeText: {
    color: colors.cyan,
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  rangeTextChaos: {
    color: colors.danger,
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
});
