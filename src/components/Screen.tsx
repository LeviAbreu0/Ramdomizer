import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/utils/theme';

interface ScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

export function Screen({
  children,
  style,
  edges = ['top', 'right', 'bottom', 'left'],
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
});
