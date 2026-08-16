import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feedback } from '@/types/domain';
import { colors, fonts } from '@/utils/theme';

interface FeedbackOptionsProps {
  selected?: Feedback;
  onSelect: (feedback: Feedback) => void;
}

const options: Array<{ value: Feedback; emoji: string; label: string }> = [
  { value: 'loved', emoji: '😍', label: 'ADOREI' },
  { value: 'liked', emoji: '🙂', label: 'GOSTEI' },
  { value: 'meh', emoji: '😐', label: 'MEH' },
  { value: 'never', emoji: '💀', label: 'NUNCA MAIS' },
];

export function FeedbackOptions({ selected, onSelect }: FeedbackOptionsProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.7}
            onPress={() => onSelect(option.value)}
            style={[styles.option, isSelected && styles.selectedOption]}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={[styles.label, isSelected && styles.selectedLabel]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 7,
  },
  option: {
    flex: 1,
    minHeight: 74,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundRaised,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 4,
  },
  selectedOption: {
    borderColor: colors.accent,
    backgroundColor: '#202A19',
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 7,
    fontWeight: '900',
    textAlign: 'center',
  },
  selectedLabel: {
    color: colors.accent,
  },
});
