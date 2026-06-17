import { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: readonly Edge[];
}

/**
 * 모든 화면의 루트 래퍼. 웜 크림 배경 + SafeArea + 기본 좌우 패딩.
 */
export function Screen({
  children,
  style,
  contentStyle,
  edges = ['top', 'bottom', 'left', 'right'],
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream.DEFAULT,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});