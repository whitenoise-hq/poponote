import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'

import type { ComponentProps } from 'react'

type IoniconsName = ComponentProps<typeof Ionicons>['name']

interface SocialButtonProps {
  label: string
  icon: IoniconsName
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
      <Ionicons name={icon} size={20} color={textColor} />
      <Text variant="label" style={{ color: textColor, fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  )
}