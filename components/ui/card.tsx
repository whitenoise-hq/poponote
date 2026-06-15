import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

interface CardProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

/**
 * 흰 표면 + 부드러운 그림자 + 라운드 컨테이너. 케어/일기/리스트 카드의 기본 골격.
 */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn('rounded-2xl bg-white p-4 shadow-card', className)}
      {...props}
    >
      {children}
    </View>
  );
}
