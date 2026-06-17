import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { Text } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

const variantContainerStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.primary.DEFAULT },
  secondary: { backgroundColor: colors.cream[100], borderWidth: 1, borderColor: colors.cream[200] },
  ghost: { backgroundColor: 'transparent' },
};

const variantLabelColors: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.ink.DEFAULT,
  ghost: colors.primary[600],
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  md: { paddingHorizontal: 16, paddingVertical: 12 },
  lg: { paddingHorizontal: 20, paddingVertical: 16 },
};

const spinnerColors: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.ink.DEFAULT,
  ghost: colors.primary[600],
};

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  style?: ViewStyle;
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
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={[
        btnStyles.base,
        variantContainerStyles[variant],
        sizeStyles[size],
        isDisabled && btnStyles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColors[variant]} />
      ) : (
        <Text
          variant="label"
          style={{ fontSize: 16, color: variantLabelColors[variant] }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const btnStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});