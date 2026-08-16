import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '@/utils/theme';

interface PreferenceToggleProps {
  checked: boolean;
  label: string;
  danger?: boolean;
  onPress: () => void;
}

export function PreferenceToggle({
  checked,
  label,
  danger = false,
  onPress,
}: PreferenceToggleProps) {
  const selectedButtonStyle = danger ? styles.dangerButton : styles.selectedButton;
  const selectedCheckboxStyle = danger ? styles.dangerCheckbox : styles.selectedCheckbox;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.button, checked && selectedButtonStyle]}
    >
      <View style={[styles.checkbox, checked && selectedCheckboxStyle]}>
        {checked && <Text style={styles.checkboxText}>{danger ? '×' : '✓'}</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 11,
    minHeight: 48,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedButton: {
    borderColor: colors.cyan,
  },
  dangerButton: {
    borderColor: colors.danger,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckbox: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  dangerCheckbox: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  checkboxText: {
    color: colors.black,
    fontWeight: '900',
  },
  label: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
  },
});
