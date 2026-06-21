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

// Pretendard는 굵기별 폰트 파일이 개별 패밀리로 등록돼 있어, fontWeight로 굵기를 지정할 수 없다.
const WEIGHT_TO_PRETENDARD: Record<string, string> = {
  '400': 'Pretendard-Regular',
  normal: 'Pretendard-Regular',
  '500': 'Pretendard-Medium',
  '600': 'Pretendard-SemiBold',
  '700': 'Pretendard-Bold',
  bold: 'Pretendard-Bold',
  '800': 'Pretendard-Bold',
  '900': 'Pretendard-Bold',
};

/**
 * 타이포 토큰을 적용한 텍스트. variant로 폰트·크기·색을 일괄 지정한다.
 *
 * Android는 커스텀 fontFamily와 fontWeight를 함께 주면 해당 굵기를 못 찾아
 * 시스템 기본 폰트로 폴백된다. 그래서 fontWeight를 Pretendard 굵기 variant(fontFamily)로
 * 변환하고 fontWeight는 제거한다.
 */
export function Text({ variant = 'body', style, ...props }: TextProps) {
  const flat = StyleSheet.flatten([variantStyles[variant], style]) as TextStyle;

  if (
    flat.fontWeight != null &&
    typeof flat.fontFamily === 'string' &&
    flat.fontFamily.startsWith('Pretendard')
  ) {
    const mapped = WEIGHT_TO_PRETENDARD[String(flat.fontWeight)];
    if (mapped) flat.fontFamily = mapped;
    delete flat.fontWeight;
  }

  return <RNText style={flat} {...props} />;
}