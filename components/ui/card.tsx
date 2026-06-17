import { type ReactNode } from 'react';
import { View, StyleSheet, type ViewProps, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

interface CardProps extends ViewProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

/**
 * 흰 표면 + 부드러운 그림자 + 라운드 컨테이너. 케어/일기/리스트 카드의 기본 골격.
 */
export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[cardStyles.card, style]} {...props}>
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 16,
  },
});