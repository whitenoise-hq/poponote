import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'

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

export function SettingsMenuGroup({ items }: SettingsMenuGroupProps) {
  return (
    <Card className="overflow-hidden">
      {items.map((item, i) => (
        <Pressable
          key={item.label}
          onPress={item.onPress}
          className={`flex-row items-center px-4 py-3.5 gap-3 ${
            i > 0 ? 'border-t border-cream-200' : ''
          }`}
        >
          <Ionicons
            name={item.icon}
            size={20}
            color={item.danger ? '#D45D5D' : '#7A6F64'}
          />
          <View className="flex-1">
            <Text
              variant="body"
              className={item.danger ? 'text-danger' : 'text-ink'}
            >
              {item.label}
            </Text>
            {item.subtitle && (
              <Text variant="caption" className="text-muted-foreground">
                {item.subtitle}
              </Text>
            )}
          </View>
          {!item.danger && (
            <Ionicons name="chevron-forward" size={18} color="#C4B9AC" />
          )}
        </Pressable>
      ))}
    </Card>
  )
}