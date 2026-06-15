import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/cn';

export type TextVariant =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

const VARIANT_CLASSES: Record<TextVariant, string> = {
  // 로고/대형 제목 (둥근 디스플레이 폰트)
  display: 'font-display text-3xl text-ink',
  title: 'font-bold text-2xl text-ink',
  subtitle: 'font-semibold text-lg text-ink',
  body: 'font-sans text-base text-ink-700',
  caption: 'font-sans text-sm text-ink-500',
  label: 'font-medium text-sm text-ink',
};

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

/**
 * 타이포 토큰을 적용한 텍스트. variant로 폰트·크기·색을 일괄 지정한다.
 */
export function Text({ variant = 'body', className, ...props }: TextProps) {
  return <RNText className={cn(VARIANT_CLASSES[variant], className)} {...props} />;
}
