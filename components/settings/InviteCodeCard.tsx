import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'
import * as Clipboard from 'expo-clipboard'

interface InviteCodeCardProps {
  code: string
}

export function InviteCodeCard({ code }: InviteCodeCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await Clipboard.setStringAsync(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text variant="label" className="text-ink">
            초대 코드
          </Text>
          <Text variant="caption" className="text-muted-foreground mt-0.5">
            가족에게 코드를 공유하세요
          </Text>
        </View>
        <Ionicons name="people-outline" size={22} color={colors.primary.DEFAULT} />
      </View>

      <View className="flex-row items-center gap-3">
        <View
          className="flex-1 py-3 items-center rounded-xl"
          style={{ backgroundColor: colors.meal.bg, borderWidth: 1.5, borderColor: colors.primary.DEFAULT + '44', borderStyle: 'dashed' }}
        >
          <Text variant="subtitle" className="text-primary tracking-widest">
            {code}
          </Text>
        </View>
        <Pressable
          onPress={handleCopy}
          style={{
            width: 48,
            height: 48,
            borderRadius: 99,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: copied ? colors.treat.DEFAULT : colors.primary.DEFAULT,
          }}
        >
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={22}
            color={colors.white}
          />
        </Pressable>
      </View>
    </Card>
  )
}