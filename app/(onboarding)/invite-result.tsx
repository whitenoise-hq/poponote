import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'

import { Text, Button } from '@/components/ui'
import { colors } from '@/theme/colors'

export default function InviteResultScreen() {
  const router = useRouter()
  const { code } = useLocalSearchParams<{ code: string }>()
  const inviteCode = code ?? 'PPNT-XXXX'
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await Clipboard.setStringAsync(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleStart() {
    // 이미 로그인 + 가족 있음 → 가드가 홈으로 보냄
    router.replace('/(tabs)' as never)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.treat.bg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
          <Ionicons name="checkmark-circle" size={44} color={colors.treat.DEFAULT} />
        </View>

        <Text variant="title" style={{ color: colors.ink.DEFAULT, textAlign: 'center' }}>
          가족 그룹이 만들어졌어요!
        </Text>
        <Text variant="body" style={{ color: colors.muted.foreground, marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
          아래 초대 코드를 가족에게 공유해{'\n'}함께 기록을 시작하세요
        </Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginTop: 28,
          width: '100%',
        }}>
          <View style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: colors.meal.bg,
            borderWidth: 1.5,
            borderColor: colors.primary.DEFAULT + '44',
            borderStyle: 'dashed',
          }}>
            <Text variant="subtitle" style={{ color: colors.primary.DEFAULT, letterSpacing: 4 }}>
              {inviteCode}
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
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <Button label="시작하기" onPress={handleStart} />
      </View>
    </SafeAreaView>
  )
}