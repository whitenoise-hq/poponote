import { type ReactNode } from 'react'
import { Pressable } from 'react-native'
import { Text } from '@/components/ui'

interface SocialButtonProps {
  label: string
  icon: ReactNode
  backgroundColor: string
  textColor: string
  borderColor?: string
  onPress: () => void
}

export function SocialButton({
  label,
  icon,
  backgroundColor,
  textColor,
  borderColor,
  onPress,
}: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 52,
        borderRadius: 12,
        backgroundColor,
        borderWidth: borderColor ? 1 : 0,
        borderColor,
      }}
    >
      {icon}
      <Text variant="label" style={{ color: textColor, fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  )
}