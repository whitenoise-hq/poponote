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
    <Card style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <View>
          <Text variant="label" style={{ color: colors.ink.DEFAULT }}>
            초대 코드
          </Text>
          <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 2 }}>
            가족에게 코드를 공유하세요
          </Text>
        </View>
        <Ionicons name="people-outline" size={22} color={colors.primary.DEFAULT} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: colors.meal.bg,
            borderWidth: 1.5,
            borderColor: colors.primary.DEFAULT + '44',
            borderStyle: 'dashed',
          }}
        >
          <Text variant="subtitle" style={{ color: colors.primary.DEFAULT, letterSpacing: 4 }}>
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