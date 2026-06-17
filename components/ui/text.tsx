import { Text as RNText, StyleSheet, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { colors } from '@/theme/colors';

export type TextVariant =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

const variantStyles = StyleSheet.create<Record<TextVariant, TextStyle>>({
  display: { fontFamily: 'Jua_400Regular', fontSize: 30, lineHeight: 40, color: colors.ink.DEFAULT },
  title: { fontFamily: 'Pretendard-Bold', fontSize: 22, lineHeight: 30, color: colors.ink.DEFAULT },
  subtitle: { fontFamily: 'Pretendard-SemiBold', fontSize: 16, lineHeight: 22, color: colors.ink.DEFAULT },
  body: { fontFamily: 'Pretendard-Regular', fontSize: 14, lineHeight: 20, color: colors.ink[700] },
  caption: { fontFamily: 'Pretendard-Regular', fontSize: 12, lineHeight: 18, color: colors.ink[500] },
  label: { fontFamily: 'Pretendard-Medium', fontSize: 13, lineHeight: 18, color: colors.ink.DEFAULT },
});

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  style?: TextStyle | TextStyle[];
}

/**
 * 타이포 토큰을 적용한 텍스트. variant로 폰트·크기·색을 일괄 지정한다.
 */
export function Text({ variant = 'body', style, ...props }: TextProps) {
  return <RNText style={[variantStyles[variant], style]} {...props} />;
}