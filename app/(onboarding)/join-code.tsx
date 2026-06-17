import { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text, Button, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { verifyInviteCode } from '@/lib/onboarding'

export default function JoinCodeScreen() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [errorVisible, setErrorVisible] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const canSubmit = code.trim().length > 0 && !verifying

  async function handleVerify() {
    if (!canSubmit) return
    try {
      setVerifying(true)
      const result = await verifyInviteCode(code)
      if (result) {
        router.push({
          pathname: '/(onboarding)/nickname',
          params: { familyId: result.familyId, petName: result.petName },
        } as never)
      } else {
        setErrorVisible(true)
      }
    } catch {
      setErrorVisible(true)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 52 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" style={{ flex: 1, textAlign: 'center', color: colors.ink.DEFAULT }}>
          초대 코드 입력
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text variant="body" style={{ color: colors.muted.foreground, textAlign: 'center', marginBottom: 24 }}>
          가족에게 받은 초대 코드를 입력해주세요
        </Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="예: POPO-7K2X"
          placeholderTextColor={colors.ink[300]}
          autoCapitalize="characters"
          textAlign="center"
          style={{
            height: 56,
            backgroundColor: colors.white,
            borderWidth: 1.5,
            borderColor: colors.cream[200],
            borderRadius: 14,
            fontSize: 20,
            fontFamily: 'Pretendard-SemiBold',
            color: colors.ink.DEFAULT,
            letterSpacing: 3,
          }}
          onSubmitEditing={handleVerify}
          returnKeyType="done"
        />

        <Button
          label={verifying ? '확인 중...' : '확인'}
          style={{ marginTop: 20, opacity: canSubmit ? 1 : 0.4 }}
          disabled={!canSubmit}
          loading={verifying}
          onPress={handleVerify}
        />
      </View>

      <AlertModal
        visible={errorVisible}
        title="코드 오류"
        message="유효하지 않은 초대 코드입니다. 다시 확인해주세요."
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}