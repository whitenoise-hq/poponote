import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Text, Card } from '@/components/ui'
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
      <Text variant="label" className="text-ink mb-2">
        초대 코드
      </Text>
      <View className="flex-row items-center gap-3">
        <View
          className="flex-1 py-3 items-center rounded-xl"
          style={{ borderWidth: 1.5, borderColor: '#f4846a44', borderStyle: 'dashed' }}
        >
          <Text variant="subtitle" className="text-primary tracking-widest">
            {code}
          </Text>
        </View>
        <Pressable
          onPress={handleCopy}
          className={`px-4 py-3 rounded-xl ${copied ? 'bg-treat-bg' : 'bg-secondary'}`}
        >
          <Text
            variant="label"
            className={copied ? 'text-treat' : 'text-primary'}
          >
            {copied ? '복사됨' : '복사'}
          </Text>
        </Pressable>
      </View>
    </Card>
  )
}