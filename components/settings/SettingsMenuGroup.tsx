import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'

import type { ComponentProps } from 'react'

type IoniconsName = ComponentProps<typeof Ionicons>['name']

export interface SettingsMenuItem {
  icon: IoniconsName
  label: string
  subtitle?: string
  onPress?: () => void
  danger?: boolean
}

interface SettingsMenuGroupProps {
  items: SettingsMenuItem[]
}

const ROW_HEIGHT = 56

export function SettingsMenuGroup({ items }: SettingsMenuGroupProps) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              minHeight: ROW_HEIGHT,
              gap: 12,
              borderBottomWidth: isLast ? 0 : 1,
              borderBottomColor: colors.cream[200],
            }}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={item.danger ? colors.danger : colors.ink[500]}
            />
            <View style={{ flex: 1, paddingVertical: 12 }}>
              <Text
                variant="body"
                style={{ color: item.danger ? colors.danger : colors.ink.DEFAULT }}
              >
                {item.label}
              </Text>
              {item.subtitle && (
                <Text variant="caption" style={{ color: colors.muted.foreground }}>
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ink[300]} />
          </Pressable>
        )
      })}
    </Card>
  )
}