import { type ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

interface ScreenProps {
  children: ReactNode;
  /** 추가 className (루트 SafeAreaView에 병합) */
  className?: string;
  /** 내부 컨텐츠 래퍼 className (기본 좌우 패딩 적용) */
  contentClassName?: string;
  /** SafeArea를 적용할 가장자리. 기본 상하좌우 */
  edges?: readonly Edge[];
}

/**
 * 모든 화면의 루트 래퍼. 웜 크림 배경 + SafeArea + 기본 좌우 패딩.
 */
export function Screen({
  children,
  className,
  contentClassName,
  edges = ['top', 'bottom', 'left', 'right'],
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-cream', className)}>
      <View className={cn('flex-1 px-5', contentClassName)}>{children}</View>
    </SafeAreaView>
  );
}
