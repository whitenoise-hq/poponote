import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';
import { colors } from '@/theme/colors';
import { Text } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

const CONTAINER_BASE = 'flex-row items-center justify-center rounded-2xl';

const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-cream-100 border border-cream-200',
  ghost: 'bg-transparent',
};

const VARIANT_LABEL: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-ink',
  ghost: 'text-primary-600',
};

const SIZE_CONTAINER: Record<ButtonSize, string> = {
  md: 'px-4 py-3',
  lg: 'px-5 py-4',
};

const SPINNER_COLOR: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.ink.DEFAULT,
  ghost: colors.primary[600],
};

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

/**
 * 기본 액션 버튼. primary=코랄, secondary=웜 뉴트럴, ghost=투명.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        CONTAINER_BASE,
        VARIANT_CONTAINER[variant],
        SIZE_CONTAINER[size],
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={SPINNER_COLOR[variant]} />
      ) : (
        <Text variant="label" className={cn('text-base', VARIANT_LABEL[variant])}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
